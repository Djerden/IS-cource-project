package com.djeno.backend.services;

import com.djeno.backend.models.DTO.dispute.DisputeDTO;
import com.djeno.backend.models.DTO.dispute.ResolveDisputeRequest;
import com.djeno.backend.models.enums.DisputeStatus;
import com.djeno.backend.models.enums.ProjectStatus;
import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.Dispute;
import com.djeno.backend.models.models.Project;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.DisputeRepository;
import com.djeno.backend.repositories.ProjectRepository;
import com.djeno.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final UserService userService;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public DisputeDTO resolveDispute(ResolveDisputeRequest request) {
        User admin = userService.getCurrentUser();

        if (!admin.getRole().equals(Role.ROLE_ADMIN) && !admin.getRole().equals(Role.ROLE_MAIN_ADMIN)) {
            throw new RuntimeException("Только администратор может разрешать споры");
        }

        Dispute dispute = disputeRepository.findById(request.getDisputeId())
                .orElseThrow(() -> new RuntimeException("Спор не найден"));

        if (dispute.getStatus() != DisputeStatus.OPEN) {
            throw new RuntimeException("Спор уже разрешен или закрыт");
        }

        Project project = dispute.getProject();

        switch (request.getResolution()) {
            case RETURN_TO_CUSTOMER:
                // Возвращаем деньги заказчику
                User owner = project.getOwner();
                owner.setBalance(owner.getBalance().add(project.getBalance()));
                userRepository.save(owner);
                project.setBalance(BigDecimal.ZERO);
                project.setStatus(ProjectStatus.CANCELLED); // Отменяем проект
                break;

            case PAY_TO_FREELANCER:
                // Переводим деньги фрилансеру
                User freelancer = project.getFreelancer();
                if (freelancer == null) {
                    throw new RuntimeException("Фрилансер не назначен на проект");
                }
                freelancer.setBalance(freelancer.getBalance().add(project.getBalance()));
                userRepository.save(freelancer);
                project.setBalance(BigDecimal.ZERO);
                project.setStatus(ProjectStatus.COMPLETED);
                break;

            case CONTINUE_PROJECT:
                // Оставляем проект на доработку, ничего не меняем
                break;

            default:
                throw new RuntimeException("Неизвестное решение администратора");
        }

        dispute.setStatus(DisputeStatus.RESOLVED);
        dispute.setAdmin(admin);
        dispute.setResolution(request.getMessage());
        dispute.setResolvedAt(LocalDateTime.now());

        Dispute updatedDispute = disputeRepository.save(dispute);

        // Закрываем все остальные открытые споры по проекту
        List<Dispute> otherOpenDisputes = disputeRepository.findAllByProjectIdAndStatus(project.getId(), DisputeStatus.OPEN);
        for (Dispute otherDispute : otherOpenDisputes) {
            if (!otherDispute.getId().equals(dispute.getId())) {
                otherDispute.setStatus(DisputeStatus.CLOSED);
                otherDispute.setAdmin(admin);
                otherDispute.setResolution("Спор закрыт, так как по проекту уже принято решение.");
                otherDispute.setResolvedAt(LocalDateTime.now());
                disputeRepository.save(otherDispute);
            }
        }

        projectRepository.save(project);

        return mapToDTO(updatedDispute);
    }

    // Метод для создания спора
    public DisputeDTO createDispute(Long projectId, String comment) {

        User currentUser = userService.getCurrentUser();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        // Проверяем, что проект не завершен
        if (project.getStatus() == ProjectStatus.COMPLETED || project.getStatus() == ProjectStatus.CANCELLED) {
            throw new RuntimeException("Нельзя создать спор для завершенного или отмененного проекта");
        }

        Dispute dispute = Dispute.builder()
                .project(project)
                .initiator(currentUser)
                .status(DisputeStatus.OPEN)
                .comment(comment)
                .createdAt(LocalDateTime.now())
                .build();

        Dispute savedDispute = disputeRepository.save(dispute);

        return mapToDTO(savedDispute);
    }

    // Метод для получения всех споров по ID проекта
    public List<DisputeDTO> getDisputesByProjectId(Long projectId) {
        List<Dispute> disputes = disputeRepository.findAllByProjectId(projectId);

        return disputes.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Метод для назначения админа на спор
    public DisputeDTO assignAdminToDispute(Long disputeId) {

        User currentUser = userService.getCurrentUser();

        if (!currentUser.getRole().equals(Role.ROLE_ADMIN) && !currentUser.getRole().equals(Role.ROLE_MAIN_ADMIN)) {
            throw new RuntimeException("Только админ может быть назначен на спор");
        }

        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new RuntimeException("Спор не найден"));

        if (dispute.getAdmin() != null) {
            throw new RuntimeException("Админ уже назначен на этот спор");
        }

        dispute.setAdmin(currentUser);
        dispute.setStatus(DisputeStatus.OPEN); // Обновляем статус, если нужно
        Dispute updatedDispute = disputeRepository.save(dispute);

        return mapToDTO(updatedDispute);
    }

    // Метод для получения всех споров без назначенного админа
    public Page<DisputeDTO> getDisputesWithoutAdmin(Pageable pageable) {
        Page<Dispute> disputes = disputeRepository.findAllByAdminIsNull(pageable);

        return disputes.map(this::mapToDTO);
    }

    // Метод для преобразования Dispute в DisputeDTO
    private DisputeDTO mapToDTO(Dispute dispute) {
        return DisputeDTO.builder()
                .id(dispute.getId())
                .projectId(dispute.getProject().getId())
                .initiatorUsername(dispute.getInitiator().getUsername())
                .status(dispute.getStatus())
                .comment(dispute.getComment())
                .createdAt(dispute.getCreatedAt())
                .adminUsername(dispute.getAdmin() != null ? dispute.getAdmin().getUsername() : null)
                .resolution(dispute.getResolution())
                .resolvedAt(dispute.getResolvedAt())
                .build();
    }

}
