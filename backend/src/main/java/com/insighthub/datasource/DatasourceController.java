package com.insighthub.datasource;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/datasources")
@RequiredArgsConstructor
public class DatasourceController {

    private final DatasourceRepository datasourceRepository;

    @GetMapping
    public ResponseEntity<List<DatasourceEntity>> getAllDatasources() {
        return ResponseEntity.ok(datasourceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatasourceEntity> getDatasourceById(@PathVariable Long id) {
        return datasourceRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
