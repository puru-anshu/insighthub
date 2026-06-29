package com.insighthub.parameter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ParameterRequest {

    @NotBlank(message = "Parameter name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 100)
    private String label;

    @NotBlank(message = "Parameter type is required")
    private String paramType;

    @Size(max = 500)
    private String defaultValue;

    @Size(max = 200)
    private String placeholder;

    private boolean required;

    private int position;
}
