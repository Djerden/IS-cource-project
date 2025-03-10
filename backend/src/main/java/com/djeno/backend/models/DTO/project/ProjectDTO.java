package com.djeno.backend.models.DTO.project;

import com.djeno.backend.models.enums.ProjectStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProjectDTO {
    private Long id;
    private String categoryName;
    private String title;
    private String description;
    private BigDecimal budget;
    private LocalDateTime deadline;
    private ProjectStatus status;
    private String freelancerUsername;
    private String ownerUsername;
    private BigDecimal balance;
    private LocalDateTime createdAt;
}
