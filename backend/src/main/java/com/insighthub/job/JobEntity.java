package com.insighthub.job;

import com.insighthub.report.ReportEntity;
import com.insighthub.schedule.ScheduleEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private ReportEntity report;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private ScheduleEntity schedule;

    @Column(name = "job_type", nullable = false, length = 30)
    @Builder.Default
    private String jobType = "PUBLISH";

    @Column(name = "output_format", length = 30)
    @Builder.Default
    private String outputFormat = "PDF";

    @Column(length = 1000)
    private String recipients;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    private LocalDateTime lastRunAt;

    @Column(length = 20)
    private String lastRunStatus;

    @Column(length = 1000)
    private String lastRunMessage;

    private LocalDateTime nextRunAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(length = 50)
    private String createdBy;

    @Column(length = 50)
    private String updatedBy;
}
