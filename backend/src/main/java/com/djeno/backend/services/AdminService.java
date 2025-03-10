package com.djeno.backend.services;

import com.djeno.backend.models.DTO.user.UserForList;
import com.djeno.backend.models.enums.ProjectStatus;
import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.ProjectRepository;
import com.djeno.backend.repositories.UserRepository;
import com.djeno.backend.repositories.specification.UserSpecifications;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AdminService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MinioService minioService;

    public Page<UserForList> getAllBannedUsers(String username, String email, Pageable pageable) {
        Specification<User> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (username != null && !username.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("username"), "%" + username + "%"));
            }

            if (email != null && !email.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("email"), "%" + email + "%"));
            }

            predicates.add(criteriaBuilder.isTrue(root.get("isBanned")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<User> bannedUsersPage = userRepository.findAll(spec, pageable);

        return bannedUsersPage.map(this::convertToUserForList);
    }

    public Page<UserForList> getAllRegularUsers(
            String username, String email, Boolean isBanned, List<Role> roles, Pageable pageable) {
        if (roles == null || roles.isEmpty()) {
            roles = List.of(Role.ROLE_CUSTOMER, Role.ROLE_FREELANCER);
        }

        Specification<User> spec = UserSpecifications.withFilters(username, email, roles, isBanned);

        Page<User> regularUsersPage = userRepository.findAll(spec, pageable);

        return regularUsersPage.map(this::convertToUserForList);
    }

    public Page<UserForList> getAllAdmins(String username, String email, Boolean isBanned, Pageable pageable) {
        List<Role> roles = List.of(Role.ROLE_ADMIN, Role.ROLE_MAIN_ADMIN);

        Specification<User> spec = UserSpecifications.withFilters(username, email, roles, isBanned);

        Page<User> adminsPage = userRepository.findAll(spec, pageable);

        return adminsPage.map(this::convertToUserForList);
    }

    public Page<UserForList> getAllFreelancers(String username, String email, Boolean isBanned, Pageable pageable) {
        List<Role> roles = List.of(Role.ROLE_FREELANCER);

        Specification<User> spec = UserSpecifications.withFilters(username, email, roles, isBanned);

        Page<User> freelancersPage = userRepository.findAll(spec, pageable);

        return freelancersPage.map(this::convertToUserForList);
    }

    private UserForList convertToUserForList(User user) {
        UserForList userForList = new UserForList();
        userForList.setId(user.getId());
        userForList.setUsername(user.getUsername());
        userForList.setEmail(user.getEmail());
        userForList.setName(user.getName());
        userForList.setSurname(user.getSurname());
        userForList.setMiddleName(user.getMiddleName());
        userForList.setRole(user.getRole());
        userForList.setRating(user.getRating());
        userForList.setIsBanned(user.getIsBanned());
        userForList.setBanReason(user.getBanReason());

        if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isEmpty()) {
            try {
                InputStream inputStream = minioService.downloadFile(user.getProfilePictureUrl(), MinioService.AVATARS_BUCKET);
                byte[] profilePicture = inputStream.readAllBytes();
                userForList.setProfilePicture(profilePicture);

                // Определение MIME-типа
                Tika tika = new Tika();
                String mimeType = tika.detect(profilePicture);
                userForList.setPictureMimeType(mimeType);
            } catch (IOException e) {
                // Логируем ошибку, если не удалось загрузить аватарку
                e.printStackTrace();
            }
        }

        return userForList;
    }

    /**
     * Метод для получения статистики по сайту
     *
     * @return Объект с данными статистики
     */
    public Map<String, Long> getSiteStatistics() {
        Map<String, Long> stats = new HashMap<>();

        // Статистика по пользователям
        long customers = userRepository.countByRole(Role.ROLE_CUSTOMER);
        long freelancers = userRepository.countByRole(Role.ROLE_FREELANCER);
        long bannedUsers = userRepository.countByIsBanned(true);
        long totalUsers = userRepository.count();

        stats.put("customers", customers);
        stats.put("freelancers", freelancers);
        stats.put("bannedUsers", bannedUsers);
        stats.put("totalUsers", totalUsers);

        // Статистика по проектам
        long completedOrders = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        long unassignedOrders = projectRepository.countByFreelancerIsNull();
        long inProgressOrders = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long totalOrders = projectRepository.count();

        stats.put("completedOrders", completedOrders);
        stats.put("unassignedOrders", unassignedOrders);
        stats.put("inProgressOrders", inProgressOrders);
        stats.put("totalOrders", totalOrders);

        return stats;
    }
}
