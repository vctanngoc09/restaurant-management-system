package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.dto.request.ProductRequest;

import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.mapper.ProductMapper;

import vn.edu.ut.resto.model.Category;
import vn.edu.ut.resto.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import vn.edu.ut.resto.repository.CategoryRepository;
import vn.edu.ut.resto.repository.ProductRepository;

import vn.edu.ut.resto.service.ProductService;

import java.util.List;

@Service
public class ProductServiceImpl
        implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductMapper productMapper;


    // =========================
    // CREATE PRODUCT
    // =========================

    @Override
    public Product createProduct(
            ProductRequest request
    ) {

        // Find Category
        Category category =
                categoryRepository
                        .findById(request.getCategoryId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy danh mục có ID: "
                                                + request.getCategoryId()
                                )
                        );


        // DTO -> Entity
        Product product =
                productMapper.toEntity(request);


        // Set Relationship
        product.setCategory(category);


        // Save
        return productRepository.save(product);
    }


    // =========================
    // GET ALL PRODUCTS
    // =========================

    // =========================
// GET ALL PRODUCTS
// PAGINATION + FILTER
// =========================

    @Override
    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(
            int page,
            int size,
            String keyword,
            Long categoryId,
            Boolean isAvailable
    ) {

        // =========================
        // VALIDATE
        // =========================

        if (page < 0) {

            throw new InvalidOperationException(
                    "Số trang không được nhỏ hơn 0."
            );
        }


        if (size <= 0 || size > 50) {

            throw new InvalidOperationException(
                    "Số lượng sản phẩm mỗi trang phải từ 1 đến 50."
            );
        }


        // =========================
        // NORMALIZE KEYWORD
        // =========================

        if (keyword == null) {
            keyword = "";
        } else {
            keyword = keyword.trim();
        }


        // =========================
        // CREATE PAGEABLE
        // =========================

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );


        // =========================
        // STEP 1
        // ONLY GET IDS
        // =========================

        Page<Long> idPage =
                productRepository.findProductIds(
                        keyword,
                        categoryId,
                        isAvailable,
                        pageable
                );


        // Không có dữ liệu
        if (idPage.isEmpty()) {

            return new PageImpl<>(
                    List.of(),
                    pageable,
                    idPage.getTotalElements()
            );
        }


        List<Long> ids =
                idPage.getContent();


        // =========================
        // STEP 2
        // FETCH PRODUCT + CATEGORY
        // =========================

        List<Product> products =
                productRepository
                        .findProductsByIdsWithCategory(
                                ids
                        );


        // =========================
        // PRESERVE ORDER
        // =========================

        Map<Long, Product> productMap =
                products.stream()
                        .collect(
                                Collectors.toMap(
                                        Product::getId,
                                        Function.identity()
                                )
                        );


        List<Product> orderedProducts =
                ids.stream()
                        .map(productMap::get)
                        .filter(product -> product != null)
                        .toList();


        // =========================
        // BUILD PAGE
        // =========================

        return new PageImpl<>(
                orderedProducts,
                pageable,
                idPage.getTotalElements()
        );
    }


    // =========================
    // GET PRODUCT BY ID
    // =========================

    @Override
    public Product getProductById(Long id) {

        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy sản phẩm có ID: "
                                        + id
                        )
                );
    }


    // =========================
    // UPDATE PRODUCT
    // =========================

    @Override
    public Product updateProduct(
            Long id,
            ProductRequest request
    ) {

        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy sản phẩm có ID: "
                                                + id
                                )
                        );


        Category category =
                categoryRepository
                        .findById(request.getCategoryId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy danh mục có ID: "
                                                + request.getCategoryId()
                                )
                        );


        // Update normal fields
        productMapper.updateEntity(
                request,
                product
        );


        // Update category
        product.setCategory(category);


        return productRepository.save(product);
    }


    // =========================
    // SOFT DELETE PRODUCT
    // =========================

    @Override
    public void deleteProduct(Long id) {

        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy sản phẩm có ID: "
                                                + id
                                )
                        );


        if (!product.getIsAvailable()) {

            throw new InvalidOperationException(
                    "Sản phẩm này đã ngừng bán."
            );
        }


        product.setIsAvailable(false);

        productRepository.save(product);
    }


    // =========================
    // RESTORE PRODUCT
    // =========================

    @Override
    public Product restoreProduct(Long id) {

        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy sản phẩm có ID: "
                                                + id
                                )
                        );


        if (product.getIsAvailable()) {

            throw new InvalidOperationException(
                    "Sản phẩm này hiện đang được bán."
            );
        }


        product.setIsAvailable(true);

        return productRepository.save(product);
    }
}