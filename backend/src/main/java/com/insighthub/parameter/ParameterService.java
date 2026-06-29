package com.insighthub.parameter;

import com.insighthub.common.exception.ResourceNotFoundException;
import com.insighthub.report.ReportEntity;
import com.insighthub.report.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ParameterService {

    private final ParameterRepository parameterRepository;
    private final ReportRepository reportRepository;

    public List<ParameterDto> getParametersForReport(Long reportId) {
        return parameterRepository.findByReportIdOrderByPositionAsc(reportId).stream()
            .map(this::toDto)
            .toList();
    }

    public ParameterDto getParameterById(Long id) {
        return parameterRepository.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Parameter", "id", id));
    }

    @Transactional
    public ParameterDto createParameter(Long reportId, ParameterRequest request) {
        ReportEntity report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));

        ParameterEntity entity = ParameterEntity.builder()
            .report(report)
            .name(request.getName())
            .label(request.getLabel())
            .paramType(request.getParamType())
            .defaultValue(request.getDefaultValue())
            .placeholder(request.getPlaceholder())
            .required(request.isRequired())
            .position(request.getPosition())
            .build();

        return toDto(parameterRepository.save(entity));
    }

    @Transactional
    public ParameterDto updateParameter(Long id, ParameterRequest request) {
        ParameterEntity entity = parameterRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Parameter", "id", id));

        entity.setName(request.getName());
        entity.setLabel(request.getLabel());
        entity.setParamType(request.getParamType());
        entity.setDefaultValue(request.getDefaultValue());
        entity.setPlaceholder(request.getPlaceholder());
        entity.setRequired(request.isRequired());
        entity.setPosition(request.getPosition());

        return toDto(parameterRepository.save(entity));
    }

    @Transactional
    public void deleteParameter(Long id) {
        if (!parameterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Parameter", "id", id);
        }
        parameterRepository.deleteById(id);
    }

    private ParameterDto toDto(ParameterEntity entity) {
        return ParameterDto.builder()
            .id(entity.getId())
            .reportId(entity.getReport().getId())
            .name(entity.getName())
            .label(entity.getLabel())
            .paramType(entity.getParamType())
            .defaultValue(entity.getDefaultValue())
            .placeholder(entity.getPlaceholder())
            .required(entity.isRequired())
            .position(entity.getPosition())
            .build();
    }
}
