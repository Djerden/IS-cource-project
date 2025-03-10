package com.djeno.backend.repositories;

import com.djeno.backend.models.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParentCategoryIsNull();

    List<Category> findByParentCategoryId(Long parentCategoryId);

    Optional<Category> findById(Long id);

    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT c FROM Category c")
    List<Category> findAllCategories();
}
