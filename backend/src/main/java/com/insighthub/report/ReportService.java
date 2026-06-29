package com.insighthub.report;

import com.insighthub.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;

    public List<ReportDto> getAllReports() {
        return reportRepository.findAll().stream()
            .map(this::toDto)
            .toList();
    }

    public ReportDto getReportById(Long id) {
        return reportRepository.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));
    }

    @Transactional
    public void deleteReport(Long id) {
        if (!reportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Report", "id", id);
        }
        reportRepository.deleteById(id);
    }

    private ReportDto toDto(ReportEntity report) {
        return ReportDto.builder()
            .id(report.getId())
            .name(report.getName())
            .shortDescription(report.getShortDescription())
            .description(report.getDescription())
            .reportType(report.getReportType())
            .reportGroupId(report.getReportGroup() != null ? report.getReportGroup().getId() : null)
            .reportGroupName(report.getReportGroup() != null ? report.getReportGroup().getName() : null)
            .datasourceId(report.getDatasource() != null ? report.getDatasource().getId() : null)
            .datasourceName(report.getDatasource() != null ? report.getDatasource().getName() : null)
            .contactPerson(report.getContactPerson())
            .active(report.isActive())
            .hidden(report.isHidden())
            .defaultReportFormat(report.getDefaultReportFormat())
            .createdAt(report.getCreatedAt())
            .updatedAt(report.getUpdatedAt())
            .build();
    }
}
