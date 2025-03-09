package com.djeno.backend.models.DTO.user;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserHeaderinfo {
    private String username;
    private String role;
    private BigDecimal balance;
    private byte[] profilePicture;
    private String pictureMimeType; // MIME-тип

}
