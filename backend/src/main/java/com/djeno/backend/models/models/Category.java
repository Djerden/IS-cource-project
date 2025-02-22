package com.djeno.backend.models.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_category_id", nullable = true)
    private Category parentCategory;
}
