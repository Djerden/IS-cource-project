package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.*;
import com.djeno.backend.models.DTO.user.UserForList;
import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.Category;
import com.djeno.backend.models.models.Skill;
import com.djeno.backend.models.models.User;
import com.djeno.backend.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RequestMapping("/admin")
@RestController
public class AdminController {

    private final CategoryService categoryService;
    private final SkillService skillService;
    private final UserService userService;
    private final AdminService adminService;

    @GetMapping("/banned-users")
    public ResponseEntity<Page<UserForList>> getAllBannedUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {


        Pageable pageable = PageRequest.of(page, size, parseSort(sort));


        Page<UserForList> bannedUsers = adminService.getAllBannedUsers(username, email, pageable);

        return ResponseEntity.ok(bannedUsers);
    }

    @GetMapping("/regular-users")
    public ResponseEntity<Page<UserForList>> getAllRegularUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Boolean isBanned, // Фильтр по статусу бана
            @RequestParam(required = false) List<Role> roles, // Фильтр по ролям
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, parseSort(sort));

        Page<UserForList> regularUsers = adminService.getAllRegularUsers(username, email, isBanned, roles, pageable);

        return ResponseEntity.ok(regularUsers);
    }

    @GetMapping("/admins")
    public ResponseEntity<Page<UserForList>> getAllAdmins(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Boolean isBanned, // Новый параметр для фильтрации по isBanned
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, parseSort(sort));

        Page<UserForList> admins = adminService.getAllAdmins(username, email, isBanned, pageable);

        return ResponseEntity.ok(admins);
    }

    private Sort parseSort(String[] sort) {
        if (sort == null || sort.length == 0) {
            // Возвращаем сортировку по умолчанию, если параметр sort не передан
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        List<Sort.Order> orders = new ArrayList<>();
        for (String sortOrder : sort) {
            String[] parts = sortOrder.split(",");
            if (parts.length == 2) {
                String field = parts[0]; // Поле для сортировки (например, "createdAt")
                Sort.Direction direction = Sort.Direction.fromString(parts[1]); // Направление сортировки
                orders.add(new Sort.Order(direction, field));
            } else {
                // Если строка некорректна, используем сортировку по умолчанию
                orders.add(new Sort.Order(Sort.Direction.DESC, "createdAt"));
            }
        }

        // Преобразуем список Sort.Order в объект Sort
        return Sort.by(orders);
    }


    /**
     * Эндпоинт для получения статистики по сайту
     *
     * @return Статистика в формате JSON
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getSiteStatistics() {
        Map<String, Long> stats = adminService.getSiteStatistics();
        return ResponseEntity.ok(stats);
    }

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
}
