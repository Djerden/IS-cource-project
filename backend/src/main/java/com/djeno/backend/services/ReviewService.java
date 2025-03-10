package com.djeno.backend.services;

import com.djeno.backend.models.models.Project;
import com.djeno.backend.models.models.Review;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.ProjectRepository;
import com.djeno.backend.repositories.ReviewRepository;
import com.djeno.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final UserService userService;

//    // Добавление нового отзыва
//    public Review addReview(Long projectId, String revieweeUsername, Integer rating, String comment) {
//        User currentUser = userService.getCurrentUser();
//
//        User revieweeUser = userService.getByUsername(revieweeUsername);
//
//        Project project = projectRepository.findById(projectId)
//                .orElseThrow(() -> new RuntimeException("Проект не найден"));
//
//        Review review = new Review();
//        review.setProject(project); //
//        review.setReviewer(currentUser);
//        review.setReviewee(revieweeUser);
//        review.setRating(rating);
//        review.setComment(comment);
//        review.setCreatedAt(LocalDateTime.now());
//
//        // Сохраняем отзыв в базе данных
//        Review savedReview = reviewRepository.save(review);
//
//        // Обновляем рейтинг пользователя
//        updateUserRating(revieweeUser);
//
//        return savedReview;
//    }

    // Обновление рейтинга пользователя
//    private void updateUserRating(User user) {
//        // Получаем все отзывы для данного пользователя
//        List<Review> reviews = reviewRepository.findByRevieweeId(user.getId());
//
//        // Рассчитываем средний рейтинг
//        BigDecimal totalRating = BigDecimal.ZERO;
//        for (Review review : reviews) {
//            totalRating = totalRating.add(BigDecimal.valueOf(review.getRating()));
//        }
//
//        BigDecimal averageRating = totalRating.divide(BigDecimal.valueOf(reviews.size()), RoundingMode.HALF_UP);
//
//        // Обновляем рейтинг пользователя
//        User user = userRepository.getUserById(userId);
//        user.setRating(averageRating);
//        userRepository.saveUser(user); // Сохраняем пользователя с обновленным рейтингом
//    }
//
//    // Получение всех отзывов для проекта
//    public List<Review> getReviewsByProjectId(Long projectId) {
//        Project project = projectRepository.findById(projectId)
//                .orElseThrow(() -> new RuntimeException("Проект не найден"));
//        return reviewRepository.findByProject(project);
//    }
}
