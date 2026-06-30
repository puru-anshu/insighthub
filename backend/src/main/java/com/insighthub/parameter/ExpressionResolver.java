package com.insighthub.parameter;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

/**
 * Resolves expression keywords in parameter default values.
 * <p>
 * Supported expressions:
 * <ul>
 *   <li>{@code CURDATE()} — current date in yyyy-MM-dd format</li>
 *   <li>{@code CURRENT_DATE} — current date in yyyy-MM-dd format</li>
 *   <li>{@code NOW()} — current date-time in yyyy-MM-dd HH:mm:ss format</li>
 *   <li>{@code CURRENT_USER} — authenticated username from Spring SecurityContext</li>
 *   <li>{@code FIRST_DAY_OF_MONTH} — first day of current month in yyyy-MM-dd format</li>
 *   <li>{@code LAST_DAY_OF_MONTH} — last day of current month in yyyy-MM-dd format</li>
 * </ul>
 * <p>
 * If the input value is not a recognized expression, it is returned unchanged.
 * Expressions are resolved before SQL parameter substitution.
 */
@Component
public class ExpressionResolver {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Resolves a parameter default value if it matches a recognized expression keyword.
     * If the value is not a recognized expression, it is returned unchanged.
     *
     * @param defaultValue the raw default value string (may be an expression keyword)
     * @return the resolved value, or the original string if not an expression
     */
    public String resolve(String defaultValue) {
        if (defaultValue == null || defaultValue.isBlank()) {
            return defaultValue;
        }

        String trimmed = defaultValue.trim();

        return switch (trimmed) {
            case "CURDATE()", "CURRENT_DATE" -> resolveCurrentDate();
            case "NOW()" -> resolveNow();
            case "CURRENT_USER" -> resolveCurrentUser();
            case "FIRST_DAY_OF_MONTH" -> resolveFirstDayOfMonth();
            case "LAST_DAY_OF_MONTH" -> resolveLastDayOfMonth();
            default -> defaultValue;
        };
    }

    /**
     * Resolves CURDATE() / CURRENT_DATE to the current date in yyyy-MM-dd format.
     */
    private String resolveCurrentDate() {
        return LocalDate.now().format(DATE_FORMAT);
    }

    /**
     * Resolves NOW() to the current date-time in yyyy-MM-dd HH:mm:ss format.
     */
    private String resolveNow() {
        return LocalDateTime.now().format(DATETIME_FORMAT);
    }

    /**
     * Resolves CURRENT_USER to the authenticated username from Spring SecurityContext.
     * Returns "anonymous" if no authentication is available.
     */
    private String resolveCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "anonymous";
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }

        return principal.toString();
    }

    /**
     * Resolves FIRST_DAY_OF_MONTH to the first day of the current month in yyyy-MM-dd format.
     */
    private String resolveFirstDayOfMonth() {
        return YearMonth.now().atDay(1).format(DATE_FORMAT);
    }

    /**
     * Resolves LAST_DAY_OF_MONTH to the last day of the current month in yyyy-MM-dd format.
     */
    private String resolveLastDayOfMonth() {
        return YearMonth.now().atEndOfMonth().format(DATE_FORMAT);
    }
}
