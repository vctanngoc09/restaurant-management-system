package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.dto.request.CategoryRequest;

import vn.edu.ut.resto.exception.DuplicateException;
import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.mapper.CategoryMapper;

import vn.edu.ut.resto.model.Category;

import vn.edu.ut.resto.repository.CategoryRepository;
import vn.edu.ut.resto.repository.ProductRepository;

import vn.edu.ut.resto.service.CategoryService;

import java.util.List;

@Service
public class CategoryServiceImpl
        implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryMapper categoryMapper;


    // =========================
    // CREATE CATEGORY
    // =========================

    @Override
    public Category createCategory(
            CategoryRequest request
    ) {

        if (
                categoryRepository.existsByName(
                        request.getName()
                )
        ) {

            throw new DuplicateException(
                    "Tên danh mục đã tồn tại!"
            );
        }

        Category category =
                categoryMapper.toEntity(request);

        return categoryRepository.save(category);
    }


    // =========================
    // GET ALL CATEGORY
    // =========================

    @Override
    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }


    // =========================
    // GET CATEGORY BY ID
    // =========================

    @Override
    public Category getCategoryById(Long id) {

        return categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy danh mục có ID: "
                                        + id
                        )
                );
    }


    // =========================
    // UPDATE CATEGORY
    // =========================

    @Override
    public Category updateCategory(
            Long id,
            CategoryRequest request
    ) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy danh mục có ID: "
                                        + id
                        )
                );


        if (
                categoryRepository.existsByNameAndIdNot(
                        request.getName(),
                        id
                )
        ) {

            throw new DuplicateException(
                    "Tên danh mục đã tồn tại!"
            );
        }


        categoryMapper.updateEntity(
                request,
                category
        );


        return categoryRepository.save(category);
    }


    // =========================
    // DELETE CATEGORY
    // =========================

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy danh mục có ID: "
                                        + id
                        )
                );


        if (
                productRepository.existsByCategoryId(id)
        ) {

            throw new InvalidOperationException(
                    "Không thể xóa danh mục vì vẫn còn sản phẩm thuộc danh mục này."
            );
        }


        categoryRepository.delete(category);
    }
}