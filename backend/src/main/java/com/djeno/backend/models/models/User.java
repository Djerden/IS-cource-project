package com.djeno.backend.models.models;

import com.djeno.backend.models.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="users", indexes = @Index(name = "idx_email", columnList = "email"))
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String name;

    @Column
    private String surname;

    @Column
    private String middleName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column
    private String description;

    @Column
    private String profilePictureUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private BigDecimal rating;

    @Column(nullable = false)
    private BigDecimal balance;

    // Поля для верификации email
    @Column(nullable = false)
    private Boolean isEmailVerified = false;

    @Column
    private String verificationCode;

    @Column
    private LocalDateTime emailVerificationTime;

    // Поля для двухфакторной авторизации
    @Column(nullable = false)
    private Boolean twoFactorEnabled = false;

    // Поля для бана
    @Column(nullable = false)
    private Boolean isBanned = false;

    @Column
    private String banReason;

    @PrePersist
    public void onPrePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (balance == null) {
            balance = BigDecimal.ZERO;
        }
        if (rating == null) {
            rating = BigDecimal.ZERO;
        }
        if (isEmailVerified == null) {
            isEmailVerified = false;
        }
        if (twoFactorEnabled == null) {
            twoFactorEnabled = false;
        }
        if (isBanned == null) {
            isBanned = false;
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
