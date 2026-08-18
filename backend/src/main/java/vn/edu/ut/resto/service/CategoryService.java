package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.CategoryRequest;
import vn.edu.ut.resto.model.Category;

import java.util.List;

public interface CategoryService {

    Category createCategory(
            CategoryRequest request
    );

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category updateCategory(
            Long id,
            CategoryRequest request
    );

    void deleteCategory(Long id);
}