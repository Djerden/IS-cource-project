package com.djeno.backend.models.DTO.message;

import lombok.Data;

@Data
public class MessageRequest {
    private Long projectId;
    private String content;
}
