package com.djeno.backend.services;

import com.djeno.backend.models.DTO.project.ProjectApplicationDTO;
import com.djeno.backend.models.enums.ApplicationStatus;
import com.djeno.backend.models.models.Project;
import com.djeno.backend.models.models.ProjectApplication;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.ProjectApplicationRepository;
import com.djeno.backend.repositories.ProjectRepository;
import com.djeno.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProjectApplicationService {

    private final ProjectApplicationRepository projectApplicationRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectApplicationDTO createApplication(ProjectApplicationDTO applicationDTO) {
        Project project = projectRepository.findById(applicationDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        User freelancer = userService.getCurrentUser();

        ProjectApplication application = new ProjectApplication();
        application.setProject(project);
        application.setFreelancer(freelancer);
        application.setStatus(ApplicationStatus.PENDING);
        application.setMessage(applicationDTO.getMessage());
        application.setPrice(applicationDTO.getPrice());
        application.setDeadline(applicationDTO.getDeadline());

        ProjectApplication savedApplication = projectApplicationRepository.save(application);

        return mapToDTO(savedApplication);
    }

    public List<ProjectApplicationDTO> getApplicationsByProjectId(Long projectId) {
        List<ProjectApplication> applications = projectApplicationRepository.findByProjectId(projectId);
        return applications.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ProjectApplicationDTO mapToDTO(ProjectApplication application) {
        ProjectApplicationDTO dto = new ProjectApplicationDTO();
        dto.setId(application.getId());
        dto.setProjectId(application.getProject().getId());
        dto.setFreelancerUsername(application.getFreelancer().getUsername());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setStatus(application.getStatus());
        dto.setMessage(application.getMessage());
        dto.setPrice(application.getPrice());
        dto.setDeadline(application.getDeadline());
        return dto;
    }
}
