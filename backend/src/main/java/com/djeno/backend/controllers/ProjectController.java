package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.ProjectCreate;
import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.DTO.project.ProjectDTO;
import com.djeno.backend.models.models.Project;
import com.djeno.backend.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/project")
@RestController
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Эндпоинт для получения списка проектов, принадлежащих пользователю по его username, с пагинацией и сортировкой
     *
     * @param username username пользователя
     * @param page     номер страницы (начиная с 0)
     * @param size     количество элементов на странице
     * @return Страница проектов, принадлежащих пользователю
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<Page<ProjectDTO>> getProjectsByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Создаем объект Pageable с сортировкой по дате создания (сначала новые)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ProjectDTO> projects = projectService.getProjectsByUsername(username, pageable);
        return ResponseEntity.ok(projects);
    }

    /**
     * Эндпоинт для получения всей информации о проекте
     *
     * @param projectId ID проекта
     * @return Информация о проекте
     */
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long projectId) {
        ProjectDTO project = projectService.getProjectById(projectId);
        return ResponseEntity.ok(project);
    }

    /**
     * Эндпоинт для получения проектов с фильтрами, сортировкой и пагинацией
     *
     * @param categoryId    ID категории (опционально)
     * @param minBudget     Минимальный бюджет (опционально)
     * @param maxBudget     Максимальный бюджет (опционально)
     * @param deadlineStart Начальная дата дедлайна (опционально)
     * @param deadlineEnd   Конечная дата дедлайна (опционально)
     * @param sortBy        Поле для сортировки (например, "price" или "createdAt")
     * @param sortDirection Направление сортировки ("asc" или "desc")
     * @param page          Номер страницы (начиная с 0)
     * @param size          Количество элементов на странице
     * @return Страница с проектами
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<ProjectDTO>> getProjects(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime deadlineStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime deadlineEnd,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ProjectDTO> projects = projectService.getProjects(
                categoryId,
                minBudget,
                maxBudget,
                deadlineStart,
                deadlineEnd,
                sortBy,
                sortDirection,
                page,
                size
        );
        return ResponseEntity.ok(projects);
    }

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
