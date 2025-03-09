package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.DTO.project.ProjectApplicationDTO;
import com.djeno.backend.models.DTO.project.ProjectApplicationRequest;
import com.djeno.backend.services.ProjectApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/project-application")
@RestController
public class ProjectApplicationController {
    private final ProjectApplicationService projectApplicationService;

    @PostMapping
    public ResponseEntity<SimpleMessage> createApplication(@RequestBody ProjectApplicationRequest applicationDTO) {
        projectApplicationService.createApplication(applicationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SimpleMessage("Заявка создана"));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectApplicationDTO>> getApplicationsByProjectId(@PathVariable Long projectId) {
        List<ProjectApplicationDTO> applications = projectApplicationService.getApplicationsByProjectId(projectId);
        return ResponseEntity.ok(applications);
    }
}
