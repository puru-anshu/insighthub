package com.insighthub.schedule;

import com.insighthub.common.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;

    @GetMapping
    public ResponseEntity<List<ScheduleDto>> getAll() {
        List<ScheduleDto> list = scheduleRepository.findAll().stream()
            .map(this::toDto).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleDto> getById(@PathVariable Long id) {
        return scheduleRepository.findById(id)
            .map(this::toDto)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));
    }

    @PostMapping
    public ResponseEntity<ScheduleDto> create(@Valid @RequestBody ScheduleRequest req) {
        if (scheduleRepository.existsByName(req.getName())) {
            throw new IllegalArgumentException("Schedule already exists: " + req.getName());
        }
        ScheduleEntity entity = ScheduleEntity.builder()
            .name(req.getName())
            .description(req.getDescription())
            .cronExpression(req.getCronExpression())
            .active(req.isActive())
            .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(scheduleRepository.save(entity)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleDto> update(@PathVariable Long id, @Valid @RequestBody ScheduleRequest req) {
        ScheduleEntity entity = scheduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));
        entity.setName(req.getName());
        entity.setDescription(req.getDescription());
        entity.setCronExpression(req.getCronExpression());
        entity.setActive(req.isActive());
        return ResponseEntity.ok(toDto(scheduleRepository.save(entity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule", "id", id);
        }
        scheduleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ScheduleDto toDto(ScheduleEntity e) {
        return ScheduleDto.builder()
            .id(e.getId()).name(e.getName()).description(e.getDescription())
            .cronExpression(e.getCronExpression()).active(e.isActive())
            .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt())
            .build();
    }
}
