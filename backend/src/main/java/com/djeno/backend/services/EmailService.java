package com.djeno.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Метод для отправки кода на email пользователя для подтверждения, что почтовый ящик принадлежит ему
     *
     * @param toEmail
     * @param verificationCode
     */
    public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("apelcin228@mail.ru");
        message.setTo(toEmail);
        message.setSubject("Подтверждение email. ProTalent");
        message.setText("Ваш код подтверждения email: " + verificationCode);
        mailSender.send(message);
    }

    /**
     * Метод для отправки одноразового кода для входа в аккаунт (двухфакторная авторизация)
     *
     * @param toEmail
     * @param verificationCode
     */
    public void sendVerificationCodeForLogin(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("apelcin228@mail.ru");
        message.setTo(toEmail);
        message.setSubject("Код двухфакторной авторизации. ProTalent");
        message.setText("Введите этот код для входа: " + verificationCode);
        mailSender.send(message);
    }

    public String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6); // 6-ти значный код
    }
}
