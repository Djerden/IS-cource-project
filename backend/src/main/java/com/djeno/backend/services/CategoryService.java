package com.djeno.backend.services;

import com.djeno.backend.models.models.Category;
import com.djeno.backend.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Метод для создания категории
     *
     * @param name Имя новой категории
     * @param parentId ID родительской категории (null, если не нужен)
     * @param parentName Имя родительской категории (null, если не нужен)
     * @return Возвращает созданную категорию
     */
    public Category createCategory(String name, Long parentId, String parentName) {
        // проверка на уникальность
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Категория с таким именем уже существует");
        }

        Category parentCategory = null;

        if (parentId != null) {
            parentCategory = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Родительская категория с таким id не найдена"));
        } else if (parentName != null) {
            parentCategory = categoryRepository.findByName(parentName)
                    .orElseThrow(() -> new RuntimeException("Родительская категория с таким именем не найдена"));
        }

        Category category = new Category();
        category.setName(name);
        category.setParentCategory(parentCategory);

        return categoryRepository.save(category);
    }
}
