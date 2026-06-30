package com.insighthub.parameter;

import com.insighthub.report.ReportEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "parameters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParameterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private ReportEntity report;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String label;

    @Column(name = "param_type", nullable = false, length = 30)
    private String paramType;

    @Column(length = 500)
    private String defaultValue;

    @Column(length = 200)
    private String placeholder;

    @Column(nullable = false)
    private boolean required;

    @Column(nullable = false)
    private int position;

    // --- LOV (List of Values) fields ---

    /**
     * LOV type: 'DYNAMIC' (SQL query), 'STATIC' (fixed list), or null (no LOV).
     */
    @Column(name = "lov_type", length = 10)
    private String lovType;

    /**
     * SQL query for dynamic LOV resolution. Executed against the report datasource.
     */
    @Column(name = "lov_query", columnDefinition = "TEXT")
    private String lovQuery;

    /**
     * JSON array of static LOV entries: [{"value":"x","label":"Y"}]
     */
    @Column(name = "lov_static_values", columnDefinition = "TEXT")
    private String lovStaticValues;

    // --- Cascading parameter support ---

    /**
     * Self-referencing FK for cascading parameters. The parent parameter whose
     * selected value filters this parameter's LOV options.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_param_id")
    private ParameterEntity parentParam;

    // --- Multi-value support ---

    /**
     * Whether this parameter accepts multiple values (for IN-clause expansion).
     */
    @Column(name = "multi_value", nullable = false)
    @Builder.Default
    private boolean multiValue = false;

    // --- Date range pair support ---

    /**
     * Date range pair indicator: 'FROM', 'TO', or null.
     * Links two date parameters as a range pair for guardrail validation.
     */
    @Column(name = "date_range_pair", length = 10)
    private String dateRangePair;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
