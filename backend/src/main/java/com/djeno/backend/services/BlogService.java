package com.djeno.backend.services;

import com.djeno.backend.exceptions.ArticleNotFoundException;
import com.djeno.backend.models.DTO.blog.BlogArticleCreateDTO;
import com.djeno.backend.models.DTO.blog.BlogArticleDetailDTO;
import com.djeno.backend.models.DTO.blog.BlogArticleSummaryDTO;
import com.djeno.backend.models.models.BlogArticle;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.BlogArticleRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BlogService {

    private final BlogArticleRepository blogArticleRepository;
    private final MinioService minioService;
    private final UserService userService;

    public Page<BlogArticleSummaryDTO> getAllArticles(Pageable pageable) {
        Tika tika = new Tika(); // Для определения MIME-типа
        return blogArticleRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(article -> {
                    byte[] picture = null;
                    String pictureMimeType = null;

                    if (article.getPictureUrl() != null) {
                        try (InputStream inputStream = minioService.downloadFile(article.getPictureUrl(), MinioService.ARTICLES_BUCKET)) {
                            picture = inputStream.readAllBytes();
                            pictureMimeType = tika.detect(picture); // Определяем MIME-тип
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to download picture", e);
                        }
                    }

                    return new BlogArticleSummaryDTO(
                            article.getId(),
                            article.getTitle(),
                            article.getDescription(),
                            picture, // Байтовый массив изображения
                            pictureMimeType // MIME-тип изображения
                    );
                });
    }

    public BlogArticleDetailDTO getArticleById(Long id) {
        BlogArticle article = blogArticleRepository.findById(id)
                .orElseThrow(() -> new ArticleNotFoundException("Article not found"));

        byte[] picture = null;
        String pictureMimeType = null; // MIME-тип изображения

        if (article.getPictureUrl() != null) {
            try (InputStream inputStream = minioService.downloadFile(article.getPictureUrl(), MinioService.ARTICLES_BUCKET)) {
                picture = inputStream.readAllBytes();

                // Определяем MIME-тип изображения
                Tika tika = new Tika();
                pictureMimeType = tika.detect(picture);
            } catch (IOException e) {
                throw new RuntimeException("Failed to download picture", e);
            }
        }

        return new BlogArticleDetailDTO(
                article.getId(),
                article.getTitle(),
                article.getDescription(),
                article.getBody(),
                article.getAuthor().getUsername(),
                article.getCreatedAt(),
                picture,
                pictureMimeType); // Передаем MIME-тип
    }

    public BlogArticle createArticle(BlogArticleCreateDTO article) {
        String pictureUrl = null;
        if (article.getPictureFile() != null && !article.getPictureFile().isEmpty()) {
            pictureUrl = minioService.uploadFile(article.getPictureFile(), MinioService.ARTICLES_BUCKET);
        }

        BlogArticle newArticle = new BlogArticle();
        newArticle.setTitle(article.getTitle());
        newArticle.setDescription(article.getDescription());
        newArticle.setBody(article.getBody());
        newArticle.setAuthor(userService.getCurrentUser());
        newArticle.setPictureUrl(pictureUrl);

        return blogArticleRepository.save(newArticle);
    }

    public void updateArticle(Long id, String title, String description, String body) {
        BlogArticle article = blogArticleRepository.findById(id)
                .orElseThrow(() -> new ArticleNotFoundException("Статья не найдена"));

        // Обновляем поля, если они переданы
        if (title != null) {
            article.setTitle(title);
        }
        if (description != null) {
            article.setDescription(description);
        }
        if (body != null) {
            article.setBody(body);
        }

        blogArticleRepository.save(article);
    }
}
