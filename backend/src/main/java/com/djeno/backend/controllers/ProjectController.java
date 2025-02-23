package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.ProjectCreate;
import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.models.Project;
import com.djeno.backend.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@RequestMapping("/project")
@RestController
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Эндпоинт для создания нового проекта
     *
     * @param projectCreate Данные для создания проекта
     * @return созданный проект
     */
    @PostMapping("/create")
    public ResponseEntity<SimpleMessage> createProject(@RequestBody ProjectCreate projectCreate) {
        Project createdProject = projectService.createProject(projectCreate);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SimpleMessage("Проект '" + createdProject.getTitle() + "' создан"));
    }

    /**
     * Эндпоинт для редактирования бюджета проекта
     *
     * @param projectId ID проекта
     * @param newBudget Новый бюджет проекта
     * @return Сообщение о результате операции
     */
    @PatchMapping("/update-budget/{projectId}")
    public ResponseEntity<SimpleMessage> updateProjectBudget(@PathVariable Long projectId, @RequestBody BigDecimal newBudget) {
        projectService.updateProjectBudget(projectId, newBudget);
        return ResponseEntity.ok(new SimpleMessage("Бюджет проекта обновлен"));
    }

    /**
     * Эндпоинт для редактирования дедлайна проекта
     *
     * @param projectId ID проекта
     * @param newDeadline Новый дедлайн проекта
     * @return Сообщение о результате операции
     */
    @PatchMapping("/update-deadline/{projectId}")
    public ResponseEntity<SimpleMessage> updateProjectDeadline(@PathVariable Long projectId, @RequestBody LocalDateTime newDeadline) {
        projectService.updateProjectDeadline(projectId, newDeadline);
        return ResponseEntity.ok(new SimpleMessage("Дедлайн проекта обновлен"));
    }

    /**
     * Эндпоинт для получения всей информации о проекте
     *
     * @param projectId ID проекта
     * @return Информация о проекте
     */
    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) {
        Project project = projectService.getProjectById(projectId);
        return ResponseEntity.ok(project);
    }

    /**
     * Эндпоинт для назначения фрилансера на проект
     *
     * @param projectId ID проекта
     * @param freelancerId ID фрилансера
     * @return Сообщение о результате операции
     */
    @PatchMapping("/assign-freelancer/{projectId}")
    public ResponseEntity<SimpleMessage> assignFreelancer(@PathVariable Long projectId, @RequestBody Long freelancerId) {
        projectService.assignFreelancer(projectId, freelancerId);
        return ResponseEntity.ok(new SimpleMessage("Фрилансер назначен на проект"));
    }

    // получить отклики по проекту

    // сделать отклик на проект

    // Сделать пополнение баланса проекта (придумать, нужно ли сразу иметь баланс, чтобы выбрать исполнителя или нет)

    // завершить проект (поработать с балансами проекта и исполнителя)
}
