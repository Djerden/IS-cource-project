package com.djeno.backend.models.DTO.message;

import java.time.LocalDateTime;

public record MessageDTO (
        Long projectId,
        String sender,
        String content,
        LocalDateTime date)
{}