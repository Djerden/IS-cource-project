package com.djeno.backend.services;

import com.djeno.backend.models.models.Project;
import com.djeno.backend.models.models.ProjectFile;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.ProjectFileRepository;
import com.djeno.backend.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProjectFileService {
    private final ProjectFileRepository projectFileRepository;
    private final ProjectRepository projectRepository;
    private final MinioService minioService;
    private final UserService userService;


    @Transactional
    public ProjectFile uploadFile(Long projectId, MultipartFile file) {
        User uploadedBy = userService.getCurrentUser();

        String uniqueFileName = minioService.uploadFile(file, MinioService.PROJECT_FILES_BUCKET);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        ProjectFile projectFile = ProjectFile.builder()
                .project(project)
                .uploadedBy(uploadedBy)
                .fileName(file.getOriginalFilename())
                .fileUrl(uniqueFileName)
                .build();


        return projectFileRepository.save(projectFile);
    }

    public List<ProjectFile> getFilesByProjectId(Long projectId) {
        return projectFileRepository.findByProjectId(projectId);
    }

    @Transactional
    public void deleteFile(Long fileId) {
        ProjectFile projectFile = projectFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Файл не найден"));

        minioService.deleteFile(projectFile.getFileUrl(), MinioService.PROJECT_FILES_BUCKET);

        projectFileRepository.delete(projectFile);
    }

    public String downloadLink(Long fileId) {
        ProjectFile projectFile = projectFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Файл не найден"));

        String downloadUrl = "http://localhost:9000/" + MinioService.PROJECT_FILES_BUCKET + "/" + projectFile.getFileUrl();
        return downloadUrl;
    }
}
