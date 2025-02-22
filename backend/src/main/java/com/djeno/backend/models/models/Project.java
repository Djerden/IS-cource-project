package com.djeno.backend.models.models;

import com.djeno.backend.models.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String title;

    private String description;

    private BigDecimal budget;

    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @ManyToOne
    @JoinColumn(name = "freelancer_id")
    private User freelancer;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private BigDecimal balance;

}