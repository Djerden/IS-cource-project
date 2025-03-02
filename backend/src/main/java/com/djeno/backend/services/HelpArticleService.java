package com.djeno.backend.services;

import com.djeno.backend.models.DTO.help.HelpArticleForListDTO;
import com.djeno.backend.models.models.HelpArticle;
import com.djeno.backend.repositories.HelpArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class HelpArticleService {

    private final HelpArticleRepository helpArticleRepository;

    public List<HelpArticleForListDTO> getAllArticles() {
        List<HelpArticle> helpArticles = helpArticleRepository.findAll();
        List<HelpArticleForListDTO> result = new ArrayList<>();

        for (HelpArticle article : helpArticles) {
            HelpArticleForListDTO dto = HelpArticleForListDTO.builder()
                    .id(article.getId())
                    .title(article.getTitle())
                    .shortDescription(article.getShortDescription())
                    .build();

            result.add(dto);
        }

        return result;
    }

    public HelpArticle getArticleById(Long id) {
        return helpArticleRepository.findById(id).orElse(null);
    }

    public HelpArticle createArticle(HelpArticle helpArticle) {
        return helpArticleRepository.save(helpArticle);
    }
}
