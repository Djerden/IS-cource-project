package com.djeno.backend.models.DTO.user;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Currency;

@Data
public class Money {
    private BigDecimal currency;
}
