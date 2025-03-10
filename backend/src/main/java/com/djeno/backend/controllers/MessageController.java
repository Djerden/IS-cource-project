package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.message.MessageDTO;
import com.djeno.backend.models.models.Message;
import com.djeno.backend.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public MessageController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<List<Message>> getMessagesByProjectId(@PathVariable Long projectId) {
        List<Message> messages = messageService.getMessagesByProjectId(projectId);
        return ResponseEntity.ok(messages);
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageDTO messageDTO) {
        Message savedMessage = messageService.save(messageDTO);

        MessageDTO responseDTO = new MessageDTO(
                savedMessage.getProject().getId(),
                savedMessage.getSender().getUsername(),
                savedMessage.getContent(),
                savedMessage.getCreatedAt()
        );

        messagingTemplate.convertAndSend("/topic/project/" + messageDTO.projectId(), responseDTO);
    }
}
