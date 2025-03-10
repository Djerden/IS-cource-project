package com.djeno.backend.models.DTO.project;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TopUpProjectBalanceRequest {
    private Long projectId;
    private BigDecimal amount;
}
