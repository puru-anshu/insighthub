package com.insighthub.execution;

import com.insighthub.guardrails.GuardrailsConfigEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

/**
 * Cursor-based streaming result set handler that executes SQL queries
 * with memory-bounded row extraction.
 *
 * <p>Enforces guardrails:</p>
 * <ul>
 *   <li>fetchSize — controls JDBC cursor batch size to limit heap usage</li>
 *   <li>queryTimeout — Statement.setQueryTimeout() for timeout enforcement</li>
 *   <li>maxRows — stop fetching when row limit is reached</li>
 *   <li>maxResultSizeBytes — track estimated byte size and stop if exceeded</li>
 * </ul>
 *
 * <p>Properties guaranteed:</p>
 * <ul>
 *   <li>Property 2: Memory Bounded — rows in heap bounded by max(pageSize, fetchSize)</li>
 *   <li>Property 3: Timeout Guarantee — Statement.cancel() on timeout</li>
 * </ul>
 *
 * <p>JDBC resources (ResultSet, Statement, Connection) are always released in finally blocks.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class StreamingResultSetHandler {

    /**
     * Result of a streaming query execution containing the extracted page of rows,
     * column metadata, truncation info, and total rows encountered.
     */
    public record StreamingResult(
            List<String> columns,
            List<Map<String, Object>> rows,
            long totalRowsScanned,
            boolean truncated,
            String truncationReason,
            long estimatedBytes
    ) {}

    /**
     * Executes the given SQL against the provided DataSource using cursor-based streaming.
     * Extracts a single page of rows (defined by page number and page size) without
     * buffering the full result set in memory.
     *
     * @param dataSource the JDBC DataSource to execute against
     * @param sql        the fully-substituted SQL query (with ORDER BY and any wrapping applied)
     * @param guardrails the effective guardrails config (timeout, maxRows, maxResultSizeBytes)
     * @param page       the 1-based page number to extract
     * @param pageSize   the number of rows per page
     * @return StreamingResult containing the extracted page and metadata
     */
    public StreamingResult execute(DataSource dataSource, String sql,
                                   GuardrailsConfigEntity guardrails,
                                   int page, int pageSize) {
        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;

        try {
            connection = dataSource.getConnection();

            // Use forward-only, read-only ResultSet for cursor-based streaming
            statement = connection.createStatement(
                    ResultSet.TYPE_FORWARD_ONLY,
                    ResultSet.CONCUR_READ_ONLY
            );

            // Configure fetch size from guardrails — controls how many rows the
            // JDBC driver fetches from the database per network round-trip.
            // This bounds the number of rows held in the driver's internal buffer.
            int fetchSize = Math.min(pageSize, guardrails.getMaxRows());
            statement.setFetchSize(fetchSize);

            // Set query timeout from guardrails for timeout enforcement (Property 3)
            statement.setQueryTimeout(guardrails.getExecutionTimeoutSeconds());

            resultSet = statement.executeQuery(sql);

            // Extract column names from ResultSet metadata
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();
            List<String> columns = new ArrayList<>(columnCount);
            for (int i = 1; i <= columnCount; i++) {
                columns.add(metaData.getColumnLabel(i));
            }

            // Calculate the offset for cursor skip (page is 1-based)
            int offset = (page - 1) * pageSize;
            int maxRows = guardrails.getMaxRows();
            long maxResultSizeBytes = guardrails.getMaxResultSizeBytes();

            // Skip rows before the requested page (cursor-based skip)
            int rowsSkipped = 0;
            while (rowsSkipped < offset && resultSet.next()) {
                rowsSkipped++;
                // Check if we've exceeded maxRows while skipping
                if (rowsSkipped > maxRows) {
                    return new StreamingResult(
                            columns,
                            Collections.emptyList(),
                            rowsSkipped,
                            true,
                            "max_rows",
                            0L
                    );
                }
            }

            // Extract the page of rows
            List<Map<String, Object>> rows = new ArrayList<>(pageSize);
            long estimatedBytes = 0L;
            long totalRowsScanned = rowsSkipped;
            boolean truncated = false;
            String truncationReason = null;

            int rowsExtracted = 0;
            while (rowsExtracted < pageSize && resultSet.next()) {
                totalRowsScanned++;

                // Check max rows guardrail
                if (totalRowsScanned > maxRows) {
                    truncated = true;
                    truncationReason = "max_rows";
                    break;
                }

                // Extract row data
                Map<String, Object> row = new LinkedHashMap<>(columnCount);
                long rowBytes = 0L;
                for (int i = 1; i <= columnCount; i++) {
                    Object value = resultSet.getObject(i);
                    row.put(columns.get(i - 1), value);
                    rowBytes += estimateObjectBytes(value);
                }

                // Check result size limit before adding this row
                estimatedBytes += rowBytes;
                if (estimatedBytes > maxResultSizeBytes) {
                    truncated = true;
                    truncationReason = "max_result_size_bytes";
                    break;
                }

                rows.add(row);
                rowsExtracted++;
            }

            // If not truncated, continue scanning to count total rows for pagination
            // (only scan forward without accumulating — maintains memory bound)
            if (!truncated) {
                while (resultSet.next()) {
                    totalRowsScanned++;
                    if (totalRowsScanned > maxRows) {
                        truncated = true;
                        truncationReason = "max_rows";
                        break;
                    }
                }
            }

            return new StreamingResult(columns, rows, totalRowsScanned, truncated, truncationReason, estimatedBytes);

        } catch (SQLTimeoutException e) {
            log.warn("Query execution timed out after {} seconds for SQL: {}",
                    guardrails.getExecutionTimeoutSeconds(), truncateSql(sql));
            // Cancel the statement if it's still running (Property 3: Timeout Guarantee)
            cancelStatementQuietly(statement);
            throw new QueryTimeoutException(
                    "Query execution timed out after " + guardrails.getExecutionTimeoutSeconds() + " seconds", e);
        } catch (SQLException e) {
            log.error("SQL execution error: {}", e.getMessage());
            cancelStatementQuietly(statement);
            throw new QueryExecutionException("SQL error: " + e.getMessage(), e);
        } finally {
            // Release JDBC resources in reverse order (Requirement 17.4)
            closeQuietly(resultSet);
            closeQuietly(statement);
            closeQuietly(connection);
        }
    }

    /**
     * Estimates the byte size of a Java object value for result-size tracking.
     * Uses a conservative estimate based on value type.
     */
    private long estimateObjectBytes(Object value) {
        if (value == null) {
            return 4L; // null reference overhead
        }
        if (value instanceof String s) {
            // 2 bytes per char (UTF-16) + object overhead
            return 40L + (long) s.length() * 2;
        }
        if (value instanceof byte[] bytes) {
            return 16L + bytes.length;
        }
        if (value instanceof Integer || value instanceof Float) {
            return 16L;
        }
        if (value instanceof Long || value instanceof Double) {
            return 24L;
        }
        if (value instanceof java.math.BigDecimal bd) {
            return 32L + (long) bd.toString().length() * 2;
        }
        if (value instanceof java.sql.Timestamp || value instanceof java.sql.Date) {
            return 32L;
        }
        if (value instanceof Boolean) {
            return 16L;
        }
        // Default estimate for unknown types
        return 48L + (long) value.toString().length() * 2;
    }

    /**
     * Cancels a JDBC Statement quietly, logging any errors.
     */
    private void cancelStatementQuietly(Statement statement) {
        if (statement != null) {
            try {
                statement.cancel();
            } catch (SQLException e) {
                log.debug("Error cancelling statement: {}", e.getMessage());
            }
        }
    }

    /**
     * Closes an AutoCloseable resource quietly, logging any errors.
     */
    private void closeQuietly(AutoCloseable resource) {
        if (resource != null) {
            try {
                resource.close();
            } catch (Exception e) {
                log.debug("Error closing resource: {}", e.getMessage());
            }
        }
    }

    /**
     * Truncates SQL for logging (avoid logging huge queries).
     */
    private String truncateSql(String sql) {
        if (sql == null) {
            return "null";
        }
        return sql.length() > 200 ? sql.substring(0, 200) + "..." : sql;
    }

    /**
     * Exception indicating query execution timeout.
     */
    public static class QueryTimeoutException extends RuntimeException {
        public QueryTimeoutException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * Exception indicating a SQL execution error.
     */
    public static class QueryExecutionException extends RuntimeException {
        public QueryExecutionException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
