package com.djeno.backend.models.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "skills")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
