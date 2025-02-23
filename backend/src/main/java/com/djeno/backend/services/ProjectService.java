package com.djeno.backend.services;

import com.djeno.backend.models.DTO.ProjectCreate;
import com.djeno.backend.models.enums.ProjectStatus;
import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.Category;
import com.djeno.backend.models.models.Project;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.CategoryRepository;
import com.djeno.backend.repositories.ProjectRepository;
import com.djeno.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private final UserService userService;


    /**
     * Метод для создания проекта
     *
     * @param projectCreate
     * @return
     */
    public Project createProject(ProjectCreate projectCreate) {
        User currentUser = userService.getCurrentUser();

        // Получаем категорию проекта
        Category category = categoryRepository.findById(projectCreate.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));

        Project project = new Project();
        project.setTitle(projectCreate.getTitle());
        project.setDescription(projectCreate.getDescription());
        project.setBudget(projectCreate.getBudget());
        project.setDeadline(projectCreate.getDeadline());
        project.setStatus(ProjectStatus.PENDING);
        project.setOwner(currentUser);
        project.setCategory(category);
        project.setBalance(BigDecimal.ZERO);

        // Сохраняем проект
        return projectRepository.save(project);
    }

    /**
     * Метод для обновления бюджета проекта
     *
     * @param projectId ID проекта
     * @param newBudget Новый бюджет проекта
     */
    public void updateProjectBudget(Long projectId, BigDecimal newBudget) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        project.setBudget(newBudget);
        projectRepository.save(project);
    }

    /**
     * Метод для обновления дедлайна проекта
     *
     * @param projectId ID проекта
     * @param newDeadline Новый дедлайн проекта
     */
    public void updateProjectDeadline(Long projectId, LocalDateTime newDeadline) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        project.setDeadline(newDeadline);
        projectRepository.save(project);
    }
    /**
     * Метод для получения информации о проекте
     *
     * @param projectId ID проекта
     * @return Информация о проекте
     */
    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));
    }

    /**
     * Метод для назначения фрилансера на проект
     *
     * @param projectId ID проекта
     * @param freelancerId ID фрилансера
     */
    public void assignFreelancer(Long projectId, Long freelancerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Фрилансер не найден"));

        if (freelancer.getRole() != Role.ROLE_FREELANCER) {
            throw new RuntimeException("Этот пользователь не является фрилансером");
        }

        project.setFreelancer(freelancer);
        project.setStatus(ProjectStatus.IN_PROGRESS);

        projectRepository.save(project);
    }
}
