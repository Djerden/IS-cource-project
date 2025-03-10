package com.djeno.backend.controllers;

import com.djeno.backend.models.models.Category;
import com.djeno.backend.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/category")
@RestController
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<Category> getCategories(@RequestParam(value = "parentId", required = false) Long parentId) {
        if (parentId == null) {
            return categoryService.getCategoriesByParentCategoryNull();
        } else {
            return categoryService.getSubCategoriesByParentId(parentId);
        }
    }

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }
}
