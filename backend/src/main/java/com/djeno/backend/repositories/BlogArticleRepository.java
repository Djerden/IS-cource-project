package com.djeno.backend.repositories;

import com.djeno.backend.models.models.BlogArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogArticleRepository extends JpaRepository<BlogArticle, Long> {

    Page<BlogArticle> findAllByOrderByCreatedAtDesc(Pageable pageable);

}
