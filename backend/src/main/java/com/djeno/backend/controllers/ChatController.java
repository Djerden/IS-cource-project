package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.message.MessageRequest;
import com.djeno.backend.models.models.Message;
import com.djeno.backend.services.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // /app/chat
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message sendMessage(MessageRequest request) {
        return chatService.saveMessage(request.getProjectId(), request.getContent());
    }
}
