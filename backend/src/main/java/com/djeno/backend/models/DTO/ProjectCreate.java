package com.djeno.backend.models.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ProjectCreate {
    private Long categoryId;
    private String title;
    private String description;
    private BigDecimal budget;
    private LocalDateTime deadline;
}
