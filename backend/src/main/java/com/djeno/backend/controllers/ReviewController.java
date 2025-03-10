package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.models.Review;
import com.djeno.backend.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/review")
@RestController
public class ReviewController {

    private final ReviewService reviewService;

//    // Метод для создания отзыва
//    @PostMapping("/add")
//    public ResponseEntity<SimpleMessage> addReview(
//            @RequestParam Long projectId,
//            @RequestParam String revieweeUsername,
//            @RequestParam Integer rating,
//            @RequestParam String comment) {
//        try {
//            // Создаем новый отзыв
//            Review review = reviewService.addReview(projectId, revieweeUsername, rating, comment);
//            return ResponseEntity.ok(new SimpleMessage("Отзыв создан")); // Возвращаем созданный отзыв
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Обработка ошибок
//        }
//    }
//
//    // Метод для получения отзывов по projectId
//    @GetMapping("/project/{projectId}")
//    public ResponseEntity<List<Review>> getReviewsByProjectId(@PathVariable Long projectId) {
//        List<Review> reviews = reviewService.getReviewsByProjectId(projectId);
//        if (reviews.isEmpty()) {
//            return ResponseEntity.noContent().build(); // Если отзывов нет
//        }
//        return ResponseEntity.ok(reviews);
//    }
}
