package com.djeno.backend.models.models;

import com.djeno.backend.models.enums.DisputeStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "disputes")
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "initiator_id")
    private User initiator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeStatus status;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    private LocalDateTime resolvedAt;

    @PrePersist
    public void onPrePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

}
