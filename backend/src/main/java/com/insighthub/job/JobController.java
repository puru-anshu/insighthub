package com.insighthub.job;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobDto> createJob(
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(jobService.createJob(request, currentUser.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDto> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {
        return ResponseEntity.ok(jobService.updateJob(id, request, currentUser.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<JobRunResult> executeJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.executeJob(id));
    }
}
