package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.CategoryRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.CategoryResponse;

import vn.edu.ut.resto.mapper.CategoryMapper;

import vn.edu.ut.resto.model.Category;

import vn.edu.ut.resto.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@PreAuthorize("hasRole('ADMIN')")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryMapper categoryMapper;


    // =========================
    // GET ALL CATEGORY
    // =========================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<CategoryResponse>>
            > getAllCategories() {

        List<CategoryResponse> categories =
                categoryService
                        .getAllCategories()
                        .stream()
                        .map(categoryMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy danh sách danh mục thành công!",
                        categories
                )
        );
    }


    // =========================
    // GET CATEGORY BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>>
    getCategoryById(
            @PathVariable Long id
    ) {

        Category category =
                categoryService.getCategoryById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy thông tin danh mục thành công!",
                        categoryMapper.toResponse(category)
                )
        );
    }


    // =========================
    // CREATE CATEGORY
    // =========================

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>>
    createCategory(
            @Valid
            @RequestBody CategoryRequest request
    ) {

        Category category =
                categoryService.createCategory(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                201,
                                "Thêm danh mục thành công!",
                                categoryMapper.toResponse(category)
                        )
                );
    }


    // =========================
    // UPDATE CATEGORY
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>>
    updateCategory(
            @PathVariable Long id,

            @Valid
            @RequestBody CategoryRequest request
    ) {

        Category category =
                categoryService.updateCategory(
                        id,
                        request
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật danh mục thành công!",
                        categoryMapper.toResponse(category)
                )
        );
    }


    // =========================
    // DELETE CATEGORY
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>
    deleteCategory(
            @PathVariable Long id
    ) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Xóa danh mục thành công!",
                        null
                )
        );
    }
}