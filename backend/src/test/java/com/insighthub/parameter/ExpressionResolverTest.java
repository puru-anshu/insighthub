package com.insighthub.parameter;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class ExpressionResolverTest {

    private ExpressionResolver resolver;

    @BeforeEach
    void setUp() {
        resolver = new ExpressionResolver();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void resolve_CURDATE_returnsCurrentDate() {
        String result = resolver.resolve("CURDATE()");

        String expected = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        assertEquals(expected, result);
    }

    @Test
    void resolve_CURRENT_DATE_returnsCurrentDate() {
        String result = resolver.resolve("CURRENT_DATE");

        String expected = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        assertEquals(expected, result);
    }

    @Test
    void resolve_NOW_returnsCurrentDateTime() {
        String result = resolver.resolve("NOW()");

        // Verify format matches yyyy-MM-dd HH:mm:ss
        assertNotNull(result);
        assertTrue(result.matches("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}"),
                "NOW() should return format yyyy-MM-dd HH:mm:ss but got: " + result);

        // Verify the date portion matches today
        String datePart = result.substring(0, 10);
        String expected = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        assertEquals(expected, datePart);
    }

    @Test
    void resolve_CURRENT_USER_returnsAuthenticatedUsername() {
        // Set up security context with a test user
        UserDetails userDetails = User.builder()
                .username("testuser")
                .password("password")
                .authorities(Collections.emptyList())
                .build();
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        String result = resolver.resolve("CURRENT_USER");

        assertEquals("testuser", result);
    }

    @Test
    void resolve_CURRENT_USER_returnsAnonymousWhenNoAuth() {
        SecurityContextHolder.clearContext();

        String result = resolver.resolve("CURRENT_USER");

        assertEquals("anonymous", result);
    }

    @Test
    void resolve_FIRST_DAY_OF_MONTH_returnsFirstDay() {
        String result = resolver.resolve("FIRST_DAY_OF_MONTH");

        String expected = YearMonth.now().atDay(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        assertEquals(expected, result);
    }

    @Test
    void resolve_LAST_DAY_OF_MONTH_returnsLastDay() {
        String result = resolver.resolve("LAST_DAY_OF_MONTH");

        String expected = YearMonth.now().atEndOfMonth().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        assertEquals(expected, result);
    }

    @Test
    void resolve_nonExpression_returnsUnchanged() {
        String input = "some default value";
        String result = resolver.resolve(input);

        assertEquals(input, result);
    }

    @Test
    void resolve_null_returnsNull() {
        String result = resolver.resolve(null);

        assertNull(result);
    }

    @Test
    void resolve_blank_returnsBlank() {
        String result = resolver.resolve("   ");

        assertEquals("   ", result);
    }

    @Test
    void resolve_expressionWithSurroundingWhitespace_isTrimmedAndResolved() {
        String result = resolver.resolve("  CURDATE()  ");

        String expected = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        assertEquals(expected, result);
    }

    @Test
    void resolve_CURRENT_USER_withStringPrincipal() {
        // Authentication with a string principal (not UserDetails)
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken("admin", null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);

        String result = resolver.resolve("CURRENT_USER");

        assertEquals("admin", result);
    }
}
