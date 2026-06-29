package com.insighthub.parameter;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParameterDto {
    private Long id;
    private Long reportId;
    private String name;
    private String label;
    private String paramType;
    private String defaultValue;
    private String placeholder;
    private boolean required;
    private int position;
}
