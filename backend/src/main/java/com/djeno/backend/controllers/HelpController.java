package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.help.HelpArticleForListDTO;
import com.djeno.backend.models.models.HelpArticle;
import com.djeno.backend.services.HelpArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RequiredArgsConstructor
@RequestMapping("/help")
@RestController
public class HelpController {

    private final HelpArticleService helpArticleService;

    @GetMapping("/articles")
    public ResponseEntity<List<HelpArticleForListDTO>> getArticleList() {
        List<HelpArticleForListDTO> articles = helpArticleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<HelpArticle> getArticle(@PathVariable Long id) {
        HelpArticle article = helpArticleService.getArticleById(id);
        if (article != null) {
            return ResponseEntity.ok(article);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create-article")
    public ResponseEntity<HelpArticle> createArticle(@RequestBody HelpArticle helpArticle) {
        HelpArticle createdArticle = helpArticleService.createArticle(helpArticle);
        return new ResponseEntity<>(createdArticle, HttpStatus.CREATED);
    }
}
