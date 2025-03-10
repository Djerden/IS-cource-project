package com.djeno.backend.models.DTO.project;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProjectApplicationRequest {
    private Long projectId;
    private BigDecimal price;
    private LocalDateTime deadline;
    private String message;
}
