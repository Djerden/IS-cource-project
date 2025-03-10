package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.*;
import com.djeno.backend.models.models.User;
import com.djeno.backend.services.AuthenticationService;
import com.djeno.backend.services.EmailService;
import com.djeno.backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Аутентификация")
public class AuthController {
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final EmailService emailService;

    @Operation(summary = "Регистрация пользователя")
    @PostMapping("/sign-up")
    public JwtAuthenticationResponse signUp(@RequestBody @Valid SignUpRequest request) {
        return authenticationService.signUp(request);
    }

    @Operation(summary = "Авторизация пользователя")
    @PostMapping("/sign-in")
    public JwtAuthenticationResponse signIn(@RequestBody @Valid SignInRequest request) {
        return authenticationService.signIn(request);
    }

    /**
     * Запрос на отправку кода подтверждения на email пользователя.
     */
    @Operation(summary = "Запрос на отправку кода для подтверждения email")
    @GetMapping("/send-email-verification-code")
    public ResponseEntity<SimpleMessage> sendEmailVerificationCode() {
        User user = userService.getCurrentUser();

        String verificationCode = emailService.generateVerificationCode();
        String email = user.getEmail();

        emailService.sendVerificationEmail(email, verificationCode);

        user.setVerificationCode(verificationCode);
        user.setEmailVerificationTime(LocalDateTime.now());
        userService.save(user);

        return ResponseEntity.ok(new SimpleMessage("Код для подтверждения отправлен на почту"));
    }

    /**
     * Запрос на проверку кода подтверждения email.
     */
    @Operation(summary = "Проверка кода для подтверждения email")
    @PostMapping("/verify-email")
    public ResponseEntity<SimpleMessage> verifyEmail(@RequestBody VerificationCode verificationCode) {
        User user = userService.getCurrentUser();

        if (!user.getVerificationCode().equals(verificationCode.getCode())) {
            return ResponseEntity.badRequest().body(new SimpleMessage("Неверный код подтверждения"));
        }

        if (user.getEmailVerificationTime().plusMinutes(15).isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new SimpleMessage("Срок действия кода истек"));
        }

        user.setIsEmailVerified(true);
        user.setVerificationCode(null); // Очищаем код
        user.setEmailVerificationTime(null); // Очищаем время действия кода
        userService.save(user);

        return ResponseEntity.ok(new SimpleMessage("Email успешно подтвержден"));
    }
}


