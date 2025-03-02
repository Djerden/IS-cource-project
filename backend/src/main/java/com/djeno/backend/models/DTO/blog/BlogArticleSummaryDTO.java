package com.djeno.backend.models.DTO.blog;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BlogArticleSummaryDTO {
    private Long id;
    private String title;
    private String description;
    private byte[] picture;
    private String pictureMimeType; // MIME-тип
}