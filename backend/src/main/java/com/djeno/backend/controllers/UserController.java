package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.DTO.UserDetailsUpdate;
import com.djeno.backend.models.DTO.UserHeaderinfo;
import com.djeno.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    // метод для смены email

    // метод, который вернет полную информацию по пользователю
}
