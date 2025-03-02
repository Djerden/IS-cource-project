package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.DTO.blog.BlogArticleCreateDTO;
import com.djeno.backend.models.DTO.blog.BlogArticleDetailDTO;
import com.djeno.backend.models.DTO.blog.BlogArticleSummaryDTO;
import com.djeno.backend.models.models.BlogArticle;
import com.djeno.backend.models.models.User;
import com.djeno.backend.services.BlogService;
import com.djeno.backend.services.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/blog")
@RestController
public class BlogController {
    private final BlogService blogService;
    private final MinioService minioService;

    @GetMapping("/articles")
    public ResponseEntity<Page<BlogArticleSummaryDTO>> getAllArticles(
            @RequestParam(defaultValue = "0") int page, // Номер страницы (начинается с 0)
            @RequestParam(defaultValue = "10") int size // Количество элементов на странице
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BlogArticleSummaryDTO> articles = blogService.getAllArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<BlogArticleDetailDTO> getArticleById(@PathVariable Long id) {
        BlogArticleDetailDTO article = blogService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    @PostMapping("/article")
    public ResponseEntity<SimpleMessage> createArticle(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String body,
            @RequestParam(required = false) MultipartFile pictureFile) {
        BlogArticleCreateDTO article = new BlogArticleCreateDTO();
        article.setTitle(title);
        article.setDescription(description);
        article.setBody(body);
        article.setPictureFile(pictureFile);

        BlogArticle newArticle = blogService.createArticle(article);
        return ResponseEntity.ok(new SimpleMessage("Article with title: " + newArticle.getTitle() + " created"));
    }

    @PutMapping("/articles/{id}")
    public ResponseEntity<SimpleMessage> updateArticle(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String body) {
        blogService.updateArticle(id, title, description, body);
        return ResponseEntity.ok(new SimpleMessage("Статья успешно обновлена"));
    }
}
