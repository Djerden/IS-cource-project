package com.djeno.backend.services;

import com.djeno.backend.models.models.Message;
import com.djeno.backend.models.models.Project;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.MessageRepository;
import com.djeno.backend.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final ProjectRepository projectRepository;

    public Message saveMessage(Long projectId, String content) {
        // Получаем текущего пользователя
        User sender = userService.getCurrentUser();

        // Получаем проект по ID
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        // Создаем новое сообщение
        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setProject(project);
        message.setCreatedAt(LocalDateTime.now());

        // Сохраняем сообщение в базе данных
        return messageRepository.save(message);
    }
}