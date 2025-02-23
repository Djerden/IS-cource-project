package com.djeno.backend.models.DTO;

import com.djeno.backend.models.enums.Role;
import jakarta.persistence.Column;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserListDTO {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String surname;
    private String middleName;
    private Role role;
    private LocalDateTime createdAt;
    private BigDecimal rating;
    private boolean isBanned;
    private String banReason;
}
