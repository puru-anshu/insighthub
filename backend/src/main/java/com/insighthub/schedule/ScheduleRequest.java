package com.insighthub.schedule;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ScheduleRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 200)
    private String description;

    @NotBlank(message = "Cron expression is required")
    @Size(max = 100)
    private String cronExpression;

    private boolean active = true;
}
