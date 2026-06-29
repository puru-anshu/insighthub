package com.insighthub.job;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class JobDto {
    private Long id;
    private String name;
    private String description;
    private Long reportId;
    private String reportName;
    private Long scheduleId;
    private String scheduleName;
    private String cronExpression;
    private String jobType;
    private String outputFormat;
    private String recipients;
    private boolean active;
    private LocalDateTime lastRunAt;
    private String lastRunStatus;
    private String lastRunMessage;
    private LocalDateTime nextRunAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
