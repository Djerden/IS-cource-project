package com.djeno.backend.services;

import com.djeno.backend.models.DTO.ProjectCreate;
import com.djeno.backend.models.DTO.project.ProjectDTO;
import com.djeno.backend.models.DTO.project.TopUpProjectBalanceRequest;
import com.djeno.backend.models.enums.ProjectStatus;
import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.Category;
import com.djeno.backend.models.models.Project;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.CategoryRepository;
import com.djeno.backend.repositories.ProjectRepository;
import com.djeno.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private final UserService userService;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void completeProject(Long projectId) {
        User currentUser = userService.getCurrentUser();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        // Проверяем, что текущий пользователь — владелец проекта
        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Только владелец проекта может завершить проект");
        }

        // Проверяем, что проект еще не завершен
        if (project.getStatus() == ProjectStatus.COMPLETED || project.getStatus() == ProjectStatus.CANCELLED) {
            throw new RuntimeException("Проект уже завершен или отменен");
        }

        // Получаем владельца и фрилансера
        User owner = project.getOwner();
        User freelancer = project.getFreelancer();

        // Сумма для перевода
        BigDecimal projectBalance = project.getBalance();

        // Если есть фрилансер, проверяем, что баланс проекта не меньше бюджета
        if (freelancer != null) {
            if (projectBalance.compareTo(project.getBudget()) < 0) {
                throw new RuntimeException("Недостаточно средств на балансе проекта для выплаты фрилансеру");
            }

            // Переводим бюджет фрилансеру
            freelancer.setBalance(freelancer.getBalance().add(project.getBudget()));
            userRepository.save(freelancer);

            // Остаток возвращаем владельцу
            BigDecimal remainingBalance = projectBalance.subtract(project.getBudget());
            if (remainingBalance.compareTo(BigDecimal.ZERO) > 0) {
                owner.setBalance(owner.getBalance().add(remainingBalance));
                userRepository.save(owner);
            }

            project.setStatus(ProjectStatus.COMPLETED);
        } else {
            // Если фрилансера нет, возвращаем всю сумму владельцу
            owner.setBalance(owner.getBalance().add(projectBalance));
            userRepository.save(owner);

            project.setStatus(ProjectStatus.CANCELLED);
        }

        // Обнуляем баланс проекта
        project.setBalance(BigDecimal.ZERO);

        projectRepository.save(project);
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void topUpProjectBalance(TopUpProjectBalanceRequest request) {

        User user = userService.getCurrentUser();

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        // Проверяем, что пользователь — владелец проекта
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Только владелец проекта может пополнять его баланс");
        }

        if (project.getStatus() == ProjectStatus.COMPLETED || project.getStatus() == ProjectStatus.CANCELLED) {
            throw new RuntimeException("Проект уже завершен или отменен");
        }

        // Проверяем, что у пользователя достаточно средств
        if (user.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Недостаточно средств на балансе пользователя");
        }

        // Проверяем, что сумма для пополнения положительная
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Сумма для пополнения должна быть больше нуля");
        }

        user.setBalance(user.getBalance().subtract(request.getAmount()));
        userRepository.save(user);

        project.setBalance(project.getBalance().add(request.getAmount()));
        projectRepository.save(project);
    }

    /**
     * Метод для получения списка проектов, принадлежащих пользователю по его username, с пагинацией и сортировкой
     *
     * @param username username пользователя
     * @param pageable объект пагинации и сортировки
     * @return Страница проектов, принадлежащих пользователю
     */
    public Page<ProjectDTO> getProjectsByUsername(String username, Pageable pageable) {

        User user = userService.getByUsername(username);

        Long userId = user.getId();

        Page<Project> projects = projectRepository.findByOwnerIdOrFreelancerId(userId, userId, pageable);
        return projects.map(this::convertToDTO);
    }

    /**
     * Метод для получения информации о проекте
     *
     * @param projectId ID проекта
     * @return Информация о проекте
     */
    public ProjectDTO getProjectById(Long projectId) {
        Project project =  projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));
        return convertToDTO(project);
    }

    /**
     * Метод для получения проектов с фильтрами, сортировкой и пагинацией
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
    public Page<ProjectDTO> getProjects(
            Long categoryId,
            BigDecimal minBudget,
            BigDecimal maxBudget,
            LocalDateTime deadlineStart,
            LocalDateTime deadlineEnd,
            String sortBy,
            String sortDirection,
            int page,
            int size
    ) {
        // Создаем спецификацию для фильтрации
        Specification<Project> spec = Specification.where(null);

        if (categoryId != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("category").get("id"), categoryId));
        }

        if (minBudget != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("budget"), minBudget));
        }

        if (maxBudget != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("budget"), maxBudget));
        }

        if (deadlineStart != null && deadlineEnd != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.between(root.get("deadline"), deadlineStart, deadlineEnd));
        }

        // Создаем сортировку
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);

        // Получаем страницу с проектами
        Page<Project> projects = projectRepository.findAll(spec, PageRequest.of(page, size, sort));

        // Преобразуем сущности Project в DTO
        List<ProjectDTO> projectDTOs = projects.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // Возвращаем страницу с DTO
        return new PageImpl<>(projectDTOs, projects.getPageable(), projects.getTotalElements());
    }

    /**
     * Метод для преобразования сущности Project в DTO
     *
     * @param project Сущность Project
     * @return DTO
     */
    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setCategoryName(project.getCategory() != null ? project.getCategory().getName() : null);
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setBudget(project.getBudget());
        dto.setDeadline(project.getDeadline());
        dto.setStatus(project.getStatus());
        dto.setFreelancerUsername(project.getFreelancer() != null ? project.getFreelancer().getUsername() : null);
        dto.setOwnerUsername(project.getOwner() != null ? project.getOwner().getUsername() : null);
        dto.setBalance(project.getBalance());
        dto.setCreatedAt(project.getCreatedAt());
        return dto;
    }

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
