package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.DTO.user.*;
import com.djeno.backend.models.models.Skill;
import com.djeno.backend.services.AdminService;
import com.djeno.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
public class UserController {

    private final UserService userService;
    private final AdminService adminService;

    @GetMapping("/freelancers")
    public ResponseEntity<Page<UserForList>> getAllFreelancers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Boolean isBanned, // Новый параметр для фильтрации по isBanned
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        // Создаем объект Pageable для пагинации и сортировки
        Pageable pageable = PageRequest.of(page, size, parseSort(sort));

        // Получаем страницу фрилансеров
        Page<UserForList> freelancers = adminService.getAllFreelancers(username, email, isBanned, pageable);

        return ResponseEntity.ok(freelancers);
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

    // Получение баланса
    @GetMapping("/balance")
    public ResponseEntity<Money> getBalance() {
        BigDecimal balance = userService.getCurrentUser().getBalance();
        Money money = new Money();
        money.setCurrency(balance);
        return ResponseEntity.ok(money);
    }

    // Пополнение баланса
    @PostMapping("/balance/deposit")
    public ResponseEntity<Money> deposit(@RequestBody Money money) {
        BigDecimal newBalance = userService.deposit(money.getCurrency());
        Money response = new Money();
        response.setCurrency(newBalance);
        return ResponseEntity.ok(response);
    }

    // Вывод денег с баланса
    @PostMapping("/balance/withdraw")
    public ResponseEntity<Money> withdraw(@RequestBody Money money) {
        BigDecimal newBalance = userService.withdraw(money.getCurrency());
        Money response = new Money();
        response.setCurrency(newBalance);
        return ResponseEntity.ok(response);
    }

    // Метод, который вернет необходимые данные для хедера: username, аватар профиля
    @GetMapping("/get-user-header-info")
    public ResponseEntity<UserHeaderinfo> getUserHeaderInfo() {
        UserHeaderinfo userHeaderinfo = userService.getUserHeaderinfo();
        return ResponseEntity.ok(userHeaderinfo);
    }

    /**
     * Эндпоинт изменяет пользовательские данные такие как:
     * name, middleName, surname, description
     * @param userDetailsUpdate
     * @return
     */
    @PostMapping("/update-user-details")
    public ResponseEntity<SimpleMessage> updateUserDetails(@RequestBody UserDetailsUpdate userDetailsUpdate) {
        userService.updateUserDetails(userDetailsUpdate);

        return ResponseEntity.ok(new SimpleMessage("Данные пользователя успешно обновлены"));
    }

    // метод для смены username
    @PostMapping("/change-username")
    public ResponseEntity<SimpleMessage> changeUsername(@RequestBody ChangeUsernameRequest changeUsernameRequest) {
        userService.changeUsername(changeUsernameRequest.getNewUsername());
        return ResponseEntity.ok(new SimpleMessage("Имя пользователя успешно изменено"));
    }

    // метод для смены email
    @PostMapping("/change-email")
    public ResponseEntity<SimpleMessage> changeEmail(@RequestBody ChangeEmailRequest changeEmailRequest) {
        userService.changeEmail(changeEmailRequest.getNewEmail());
        return ResponseEntity.ok(new SimpleMessage("Email успешно изменен"));
    }

    // метод для добавления/смены картинки профиля
    @PostMapping(value = "/update-profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SimpleMessage> updateProfilePicture(@RequestPart("file") MultipartFile file) {
        userService.updateProfilePicture(file);
        return ResponseEntity.ok(new SimpleMessage("Картинка профиля успешно обновлена"));
    }

    // метод, который вернет полную информацию для профиля
    @GetMapping("/get-full-profile-info")
    public ResponseEntity<UserProfileInfo> getFullProfileInfo() {
        UserProfileInfo userProfileInfo = userService.getFullProfileInfo();
        return ResponseEntity.ok(userProfileInfo);
    }

    // метод для смены пароля
    @PostMapping("/change-password")
    public ResponseEntity<SimpleMessage> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        userService.changePassword(changePasswordRequest);
        return ResponseEntity.ok(new SimpleMessage("Пароль успешно изменен"));
    }

    /**
     * Создать новый навык
     */
    @PostMapping("/create-skill")
    public ResponseEntity<Skill> createSkill(@RequestParam String skillName) {
        Skill skill = userService.createSkill(skillName);
        return ResponseEntity.ok(skill);
    }

    /**
     * Получить все навыки
     */
    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = userService.getAllSkills();
        return ResponseEntity.ok(skills);
    }

    /**
     * Получить навыки пользователя
     */
    @GetMapping("/my-skills")
    public ResponseEntity<List<Skill>> getUserSkills() {
        List<Skill> skills = userService.getUserSkills();
        return ResponseEntity.ok(skills);
    }

    /**
     * Добавить навык пользователю
     */
    @PostMapping("/add-skill")
    public ResponseEntity<SimpleMessage> addSkillToUser(@RequestParam Long skillId) {
        userService.addSkillToUser(skillId);
        return ResponseEntity.ok(new SimpleMessage("Навык успешно добавлен"));
    }

    /**
     * Удалить навык у пользователя
     */
    @DeleteMapping("/remove-skill")
    public ResponseEntity<SimpleMessage> removeSkillFromUser(@RequestParam Long skillId) {
        userService.removeSkillFromUser(skillId);
        return ResponseEntity.ok(new SimpleMessage("Навык успешно удален"));
    }

}
