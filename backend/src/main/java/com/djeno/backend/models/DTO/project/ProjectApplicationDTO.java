package com.djeno.backend.models.DTO.project;

import com.djeno.backend.models.enums.ApplicationStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProjectApplicationDTO {
    private Long id;
    private Long projectId;
    private String freelancerUsername; // Имя пользователя фрилансера
    private LocalDateTime createdAt;
    private ApplicationStatus status;
    private String message;
    private BigDecimal price;
    private LocalDateTime deadline;
}
