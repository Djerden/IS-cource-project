package com.djeno.backend.models.DTO.blog;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BlogArticleDetailDTO {
    private Long id;
    private String title;
    private String description;
    private String body;
    private String authorUsername;
    private LocalDateTime createdAt;
    private byte[] picture;
    private String pictureMimeType; // MIME-тип
}