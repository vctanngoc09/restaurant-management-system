package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.CategoryRequest;
import vn.edu.ut.resto.dto.response.CategoryResponse;
import vn.edu.ut.resto.model.Category;

@Component
public class CategoryMapper {

    // =========================
    // REQUEST -> ENTITY
    // =========================

    public Category toEntity(CategoryRequest request) {

        if (request == null) {
            return null;
        }

        Category category = new Category();

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return category;
    }


    // =========================
    // UPDATE ENTITY
    // =========================

    public void updateEntity(
            CategoryRequest request,
            Category category
    ) {

        if (request == null || category == null) {
            return;
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
    }


    // =========================
    // ENTITY -> RESPONSE
    // =========================

    public CategoryResponse toResponse(
            Category category
    ) {

        if (category == null) {
            return null;
        }

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }
}