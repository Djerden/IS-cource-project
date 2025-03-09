package com.djeno.backend.controllers;


import com.djeno.backend.models.DTO.user.UserProfileInfoPublic;
import com.djeno.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/info")
@RestController
public class InfoController {

    private final UserService userService;

    //метод для получения данных о пользователе по username
    @GetMapping("/user/{username}")
    public ResponseEntity<UserProfileInfoPublic> getUserProfileInfo(@PathVariable String username) {
        UserProfileInfoPublic userProfileInfo = userService.getPublicProfileInfoByUsername(username);
        return ResponseEntity.ok(userProfileInfo);
    }
}
