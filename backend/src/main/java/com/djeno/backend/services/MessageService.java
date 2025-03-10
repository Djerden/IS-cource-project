package com.djeno.backend.services;

import com.djeno.backend.models.DTO.message.MessageDTO;
import com.djeno.backend.models.models.Message;
import com.djeno.backend.repositories.MessageRepository;
import com.djeno.backend.repositories.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public MessageService(MessageRepository messageRepository, ProjectRepository projectRepository, UserService userService) {
        this.messageRepository = messageRepository;
        this.projectRepository = projectRepository;
        this.userService = userService;

    }

    public List<Message> getMessagesByProjectId(Long projectId) {
        return messageRepository.findAllByProjectId(projectId);
    }

    public Message save(MessageDTO messageDTO) {
        Message message = new Message();
        message.setContent(messageDTO.content());
        message.setCreatedAt(LocalDateTime.now());
        message.setProject(projectRepository.findById(messageDTO.projectId()).orElseThrow());
        message.setSender(userService.getByUsername(messageDTO.sender()));
        return messageRepository.save(message);
    }
}
