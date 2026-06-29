package com.insighthub.parameter;

import com.insighthub.report.ReportEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "parameters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParameterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private ReportEntity report;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String label;

    @Column(name = "param_type", nullable = false, length = 30)
    private String paramType;

    @Column(length = 500)
    private String defaultValue;

    @Column(length = 200)
    private String placeholder;

    @Column(nullable = false)
    private boolean required;

    @Column(nullable = false)
    private int position;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
