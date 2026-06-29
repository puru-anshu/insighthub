package com.insighthub.job;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JobRunResult {
    private boolean success;
    private String message;
    private long executionMs;
}
