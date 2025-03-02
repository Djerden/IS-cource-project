package com.djeno.backend.models.DTO.user;

import com.djeno.backend.models.enums.Role;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileInfo {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String surname;
    private String middleName;
    private Role role;
    private String description;
    private LocalDateTime createdAt;
    private BigDecimal rating;
    private Boolean isEmailVerified;
    private Boolean twoFactorEnabled;
    private Boolean isBanned;
    private String banReason;
    private byte[] profilePicture;
    private String pictureMimeType; // MIME-тип
}
