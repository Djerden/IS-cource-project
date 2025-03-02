package com.djeno.backend.models.DTO.blog;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class BlogArticleCreateDTO {

    private String title;
    private String description;
    private String body;
    private MultipartFile pictureFile;
}
