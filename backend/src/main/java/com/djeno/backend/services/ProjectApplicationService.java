package com.djeno.backend.services;

import com.djeno.backend.models.DTO.project.ProjectApplicationDTO;
import com.djeno.backend.models.DTO.project.ProjectApplicationRequest;
import com.djeno.backend.models.enums.ApplicationStatus;
import com.djeno.backend.models.enums.ProjectStatus;
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

    // Метод для получения принятой заявки по ID проекта
    public ProjectApplicationDTO getApprovedApplicationByProjectId(Long projectId) {
        ProjectApplication approvedApplication = projectApplicationRepository
                .findByProjectIdAndStatus(projectId, ApplicationStatus.APPROVED)
                .orElseThrow(() -> new RuntimeException("Принятая заявка для проекта не найдена"));

        return mapToDTO(approvedApplication);
    }

    public void createApplication(ProjectApplicationRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        User freelancer = userService.getCurrentUser();

        ProjectApplication application = new ProjectApplication();
        application.setProject(project);
        application.setFreelancer(freelancer);
        application.setStatus(ApplicationStatus.PENDING);
        application.setMessage(request.getMessage());
        application.setPrice(request.getPrice());
        application.setDeadline(request.getDeadline());

        ProjectApplication savedApplication = projectApplicationRepository.save(application);
    }

    public List<ProjectApplicationDTO> getApplicationsByProjectId(Long projectId) {
        List<ProjectApplication> applications = projectApplicationRepository.findByProjectId(projectId);
        return applications.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void acceptApplication(Long applicationId) {
        ProjectApplication application = projectApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));

        Project project = application.getProject();

        User owner = userService.getCurrentUser();

        if (!project.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Только владелец проекта может принимать заявки");
        }

        User freelancer = application.getFreelancer();

        project.setFreelancer(freelancer);

        project.setBudget(application.getPrice());
        project.setDeadline(application.getDeadline());
        project.setStatus(ProjectStatus.IN_PROGRESS);

        application.setStatus(ApplicationStatus.APPROVED);

        projectRepository.save(project);
        projectApplicationRepository.save(application);
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
