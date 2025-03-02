package com.djeno.backend.models.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="help_articles")
public class HelpArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String shortDescription;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;
}
