package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.models.ProjectFile;
import com.djeno.backend.services.ProjectFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/project-files")
@RequiredArgsConstructor
public class ProjectFileController {

    private final ProjectFileService projectFileService;

    // Загрузка файла
    @PostMapping("/upload")
    public ResponseEntity<ProjectFile> uploadFile(
            @RequestParam Long projectId,
            @RequestParam("file") MultipartFile file) {
        ProjectFile uploadedFile = projectFileService.uploadFile(projectId, file);
        return ResponseEntity.ok(uploadedFile);
    }

    // Получение всех файлов по проекту
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectFile>> getFilesByProjectId(@PathVariable Long projectId) {
        List<ProjectFile> files = projectFileService.getFilesByProjectId(projectId);
        return ResponseEntity.ok(files);
    }

    // Удаление файла
    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        projectFileService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/download-url/{fileId}")
    public ResponseEntity<SimpleMessage> getFileDownloadUrl(@PathVariable Long fileId) {
        String downloadUrl = projectFileService.downloadLink(fileId);
        return ResponseEntity.ok(new SimpleMessage(downloadUrl));
    }
}
