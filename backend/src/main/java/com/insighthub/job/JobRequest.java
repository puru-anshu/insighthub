package com.insighthub.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JobRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull(message = "Report is required")
    private Long reportId;

    private Long scheduleId;

    @NotBlank(message = "Job type is required")
    private String jobType;

    private String outputFormat;

    @Size(max = 1000)
    private String recipients;

    private boolean active = true;
}
