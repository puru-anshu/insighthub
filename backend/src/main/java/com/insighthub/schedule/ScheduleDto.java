package com.insighthub.schedule;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ScheduleDto {
    private Long id;
    private String name;
    private String description;
    private String cronExpression;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
