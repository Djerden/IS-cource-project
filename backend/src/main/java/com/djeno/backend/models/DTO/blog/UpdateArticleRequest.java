package com.djeno.backend.models.DTO.blog;

import lombok.Data;

@Data
public class UpdateArticleRequest {
    private String title;
    private String description;
    private String body;
}