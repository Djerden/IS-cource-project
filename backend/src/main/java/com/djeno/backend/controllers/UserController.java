package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.DTO.UserDetailsUpdate;
import com.djeno.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping("/update-user-details")
    public ResponseEntity<SimpleMessage> updateUserDetails(@RequestBody UserDetailsUpdate userDetailsUpdate) {
        userService.updateUserDetails(userDetailsUpdate);

        return ResponseEntity.ok(new SimpleMessage("Данные пользователя успешно обновлены"));
    }

    // метод для смены username

    // метод для смены email
}
