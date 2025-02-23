package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.*;
import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.Category;
import com.djeno.backend.models.models.Skill;
import com.djeno.backend.models.models.User;
import com.djeno.backend.services.CategoryService;
import com.djeno.backend.services.SkillService;
import com.djeno.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RequestMapping("/admin")
@RestController
public class AdminController {

    private final CategoryService categoryService;
    private final SkillService skillService;
    private final UserService userService;

    /**
     * Эндпоинт для создания категории
     *
     * @param categoryCreate
     * @return
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MAIN_ADMIN')")
    @PostMapping("/create-category")
    public ResponseEntity<SimpleMessage> createCategory(@RequestBody CategoryCreate categoryCreate) {
        Category newCategory = categoryService.createCategory(
                categoryCreate.getName(),
                categoryCreate.getParentId(),
                categoryCreate.getParentName()
        );

        return ResponseEntity.ok(new SimpleMessage("Категория '" + newCategory.getName() + "' успешно добавлена"));
    }

    /**
     * Эндпоинт для создания навыка
     *
     * @param skillCreate
     * @return
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MAIN_ADMIN')")
    @PostMapping("/create-skill")
    public ResponseEntity<SimpleMessage> createSkill(@RequestBody SkillCreate skillCreate) {
        Skill newSkill = skillService.createSkill(skillCreate.getName());
        return ResponseEntity.ok(new SimpleMessage("Навык '" + newSkill.getName() + "' успешно добавлен"));
    }

    /**
     * Эндпоинт для выдачи роли ROLE_ADMIN пользователю
     *
     * @param userId ID пользователя, которому будет выдана роль
     * @return Сообщение об успешном выполнении
     */
    @PreAuthorize("hasRole('ROLE_MAIN_ADMIN')")
    @PatchMapping("/grant-admin/{userId}")
    public ResponseEntity<SimpleMessage> grantAdminRole(@PathVariable Long userId) {
        System.out.println("Получен id " + userId);
        User user = userService.grantAdminRole(userId);
        return ResponseEntity.ok(new SimpleMessage("Роль ADMIN успешно выдана пользователю " + user.getUsername()));
    }

    /**
     * Эндпоинт для снятия роли ROLE_ADMIN с пользователя
     *
     * @param userId ID пользователя, с которого будет снята роль
     * @return Сообщение об успешном выполнении
     */
    @PreAuthorize("hasRole('ROLE_MAIN_ADMIN')")
    @PatchMapping("/revoke-admin/{userId}")
    public ResponseEntity<SimpleMessage> revokeAdminRole(@PathVariable Long userId) {
        User user = userService.revokeAdminRole(userId);
        return ResponseEntity.ok(new SimpleMessage("Роль ADMIN успешно снята с пользователя " + user.getUsername()));
    }

    /**
     * Эндпоинт для выдачи роли ROLE_MAIN_ADMIN
     *
     * @param userId ID пользователя, которому будет выдана роль MAIN_ADMIN
     * @return Сообщение об успешном выполнении
     */
    @PreAuthorize("hasRole('ROLE_MAIN_ADMIN')")
    @PatchMapping("/grant-main-admin/{userId}")
    public ResponseEntity<SimpleMessage> grantMainAdminRole(@PathVariable Long userId) {
        User user = userService.grantMainAdminRole(userId);
        return ResponseEntity.ok(new SimpleMessage("Роль MAIN_ADMIN успешно выдана пользователю " + user.getUsername()));
    }


    /**
     * Эндпоинт для получения списка администраторов с пагинацией и фильтрацией
     *
     * @param role
     * @param username
     * @param email
     * @param page
     * @param size
     * @param sortBy
     * @param ascending
     * @return
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MAIN_ADMIN')")
    @GetMapping("/get-admins")
    public ResponseEntity<Page<UserListDTO>> getAdmins(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending) {

        // Если role не передан, ищем пользователей с ролями ROLE_ADMIN и ROLE_MAIN_ADMIN
        if (role == null) {
            role = "ROLE_ADMIN,ROLE_MAIN_ADMIN"; // Строка с двумя ролями
        }

        // Преобразуем строку role в список ролей
        List<Role> roles = Arrays.stream(role.split(","))
                .map(String::toUpperCase) // Преобразуем в верхний регистр, чтобы избежать проблем с регистром
                .map(Role::valueOf) // Преобразуем строку в enum Role
                .collect(Collectors.toList());

        Page<UserListDTO> users = userService.getUsersWithFilters(roles, username, email, page, size, sortBy, ascending);
        return ResponseEntity.ok(users);
    }

    /**
     * Эндпоинт для выдачи бана пользователю с указанием причины
     *
     * @param banInfo
     * @return
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MAIN_ADMIN')")
    @PatchMapping("/ban")
    public ResponseEntity<SimpleMessage> banUser(@RequestBody BanInfo banInfo) {

        User bannedUser = userService.banUser(banInfo.getUserId(), banInfo.getBanReason());
        return ResponseEntity.ok(new SimpleMessage("Пользователь " + bannedUser.getUsername() + " забанен по причине: " + bannedUser.getBanReason()));
    }

    /**
     * Эндпоинт снятия бана с пользователя
     *
     * @param userId
     * @return
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MAIN_ADMIN')")
    @PatchMapping("/unban/{userId}")
    public ResponseEntity<SimpleMessage> unbanUser(@PathVariable Long userId) {
        User unbannedUser = userService.unbanUser(userId);
        return ResponseEntity.ok(new SimpleMessage("Пользователь " + unbannedUser.getUsername() + " разбанен"));
    }

    /**
     * Эндпоинт для получения списка забаненых пользователей с пагинацией и фильтрацией
     *
     * @param role
     * @param username
     * @param email
     * @param page
     * @param size
     * @param sortBy
     * @param ascending
     * @return
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MAIN_ADMIN')")
    @GetMapping("/get-banned-users")
    public ResponseEntity<Page<UserListDTO>> getBannedUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending) {

        // Если role не передан, ищем пользователей с ролями ROLE_CUSTOMER и ROLE_FREELANCER
        if (role == null) {
            role = "ROLE_CUSTOMER,ROLE_FREELANCER"; // Строка с двумя ролями
        }

        // Преобразуем строку role в список ролей
        List<Role> roles = Arrays.stream(role.split(","))
                .map(String::toUpperCase)
                .map(Role::valueOf)
                .collect(Collectors.toList());

        Page<UserListDTO> users = userService.getBannedUsersWithFilters(roles, username, email, page, size, sortBy, ascending);
        return ResponseEntity.ok(users);
    }
}
