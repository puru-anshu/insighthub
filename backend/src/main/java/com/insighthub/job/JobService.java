package com.insighthub.job;

import com.insighthub.common.exception.ResourceNotFoundException;
import com.insighthub.report.ReportEntity;
import com.insighthub.report.ReportRepository;
import com.insighthub.report.ReportRunService;
import com.insighthub.report.RunReportResult;
import com.insighthub.schedule.ScheduleEntity;
import com.insighthub.schedule.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobService {

    private static final Logger log = LoggerFactory.getLogger(JobService.class);

    private final JobRepository jobRepository;
    private final ReportRepository reportRepository;
    private final ScheduleRepository scheduleRepository;
    private final ReportRunService reportRunService;

    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream().map(this::toDto).toList();
    }

    public JobDto getJobById(Long id) {
        return jobRepository.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
    }

    @Transactional
    public JobDto createJob(JobRequest request, String createdBy) {
        ReportEntity report = reportRepository.findById(request.getReportId())
            .orElseThrow(() -> new ResourceNotFoundException("Report", "id", request.getReportId()));

        ScheduleEntity schedule = null;
        if (request.getScheduleId() != null) {
            schedule = scheduleRepository.findById(request.getScheduleId()).orElse(null);
        }

        JobEntity entity = JobEntity.builder()
            .name(request.getName())
            .description(request.getDescription())
            .report(report)
            .schedule(schedule)
            .jobType(request.getJobType())
            .outputFormat(request.getOutputFormat())
            .recipients(request.getRecipients())
            .active(request.isActive())
            .createdBy(createdBy)
            .build();

        return toDto(jobRepository.save(entity));
    }

    @Transactional
    public JobDto updateJob(Long id, JobRequest request, String updatedBy) {
        JobEntity entity = jobRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setJobType(request.getJobType());
        entity.setOutputFormat(request.getOutputFormat());
        entity.setRecipients(request.getRecipients());
        entity.setActive(request.isActive());
        entity.setUpdatedBy(updatedBy);

        if (request.getReportId() != null) {
            entity.setReport(reportRepository.findById(request.getReportId()).orElse(null));
        }
        if (request.getScheduleId() != null) {
            entity.setSchedule(scheduleRepository.findById(request.getScheduleId()).orElse(null));
        } else {
            entity.setSchedule(null);
        }

        return toDto(jobRepository.save(entity));
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job", "id", id);
        }
        jobRepository.deleteById(id);
    }

    /**
     * Execute a job immediately (manual trigger).
     */
    @Transactional
    public JobRunResult executeJob(Long id) {
        JobEntity job = jobRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        try {
            RunReportResult result = reportRunService.runReport(job.getReport().getId(), Map.of());

            job.setLastRunAt(LocalDateTime.now());
            job.setLastRunStatus("SUCCESS");
            job.setLastRunMessage(result.getRowCount() + " rows generated");
            jobRepository.save(job);

            return new JobRunResult(true, "Job executed successfully. " + result.getRowCount() + " rows.", result.getExecutionMs());
        } catch (Exception e) {
            log.error("Job execution failed: {}", e.getMessage());
            job.setLastRunAt(LocalDateTime.now());
            job.setLastRunStatus("FAILED");
            job.setLastRunMessage(e.getMessage());
            jobRepository.save(job);

            return new JobRunResult(false, e.getMessage(), 0);
        }
    }

    private JobDto toDto(JobEntity e) {
        return JobDto.builder()
            .id(e.getId())
            .name(e.getName())
            .description(e.getDescription())
            .reportId(e.getReport() != null ? e.getReport().getId() : null)
            .reportName(e.getReport() != null ? e.getReport().getName() : null)
            .scheduleId(e.getSchedule() != null ? e.getSchedule().getId() : null)
            .scheduleName(e.getSchedule() != null ? e.getSchedule().getName() : null)
            .cronExpression(e.getSchedule() != null ? e.getSchedule().getCronExpression() : null)
            .jobType(e.getJobType())
            .outputFormat(e.getOutputFormat())
            .recipients(e.getRecipients())
            .active(e.isActive())
            .lastRunAt(e.getLastRunAt())
            .lastRunStatus(e.getLastRunStatus())
            .lastRunMessage(e.getLastRunMessage())
            .nextRunAt(e.getNextRunAt())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
    }
}
