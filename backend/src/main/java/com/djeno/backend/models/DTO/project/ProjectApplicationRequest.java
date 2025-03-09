package com.djeno.backend.models.DTO.project;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProjectApplicationRequest {
    private Long projectId; // ID проекта
    private BigDecimal price; // Цена
    private LocalDateTime deadline; // Дедлайн
    private String message; // Сообщение
}
