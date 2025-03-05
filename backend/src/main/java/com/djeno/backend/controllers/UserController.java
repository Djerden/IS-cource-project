package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.DTO.user.UserDetailsUpdate;
import com.djeno.backend.models.DTO.UserHeaderinfo;
import com.djeno.backend.models.DTO.user.ChangeEmailRequest;
import com.djeno.backend.models.DTO.user.ChangePasswordRequest;
import com.djeno.backend.models.DTO.user.ChangeUsernameRequest;
import com.djeno.backend.models.DTO.user.UserProfileInfo;
import com.djeno.backend.models.models.Skill;
import com.djeno.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
public class UserController {

    private final UserService userService;



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
