package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.ProductRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.PageResponse;
import vn.edu.ut.resto.dto.response.ProductResponse;

import vn.edu.ut.resto.mapper.ProductMapper;

import vn.edu.ut.resto.model.Product;

import vn.edu.ut.resto.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductMapper productMapper;


    // =========================
    // GET ALL PRODUCTS
    // =========================

    // =========================
// GET ALL PRODUCTS
// PAGINATION + FILTER
// =========================

    @GetMapping
    public ResponseEntity<
            ApiResponse<PageResponse<ProductResponse>>
            > getAllProducts(

            @RequestParam(
                    defaultValue = "0"
            ) int page,

            @RequestParam(
                    defaultValue = "8"
            ) int size,

            @RequestParam(
                    required = false
            ) String keyword,

            @RequestParam(
                    required = false
            ) Long categoryId,

            @RequestParam(
                    required = false
            ) Boolean isAvailable

    ) {

        Page<ProductResponse> productPage =
                productService
                        .getAllProducts(
                                page,
                                size,
                                keyword,
                                categoryId,
                                isAvailable
                        )
                        .map(productMapper::toResponse);


        PageResponse<ProductResponse> response =
                PageResponse.from(productPage);


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy danh sách sản phẩm thành công!",
                        response
                )
        );
    }


    // =========================
    // GET PRODUCT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>>
    getProductById(
            @PathVariable Long id
    ) {

        Product product =
                productService.getProductById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy thông tin sản phẩm thành công!",
                        productMapper.toResponse(product)
                )
        );
    }


    // =========================
    // CREATE PRODUCT
    // =========================

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>>
    createProduct(
            @Valid
            @RequestBody ProductRequest request
    ) {

        Product product =
                productService.createProduct(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                201,
                                "Thêm sản phẩm thành công!",
                                productMapper.toResponse(product)
                        )
                );
    }


    // =========================
    // UPDATE PRODUCT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>>
    updateProduct(
            @PathVariable Long id,

            @Valid
            @RequestBody ProductRequest request
    ) {

        Product product =
                productService.updateProduct(
                        id,
                        request
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật sản phẩm thành công!",
                        productMapper.toResponse(product)
                )
        );
    }


    // =========================
    // SOFT DELETE PRODUCT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>
    deleteProduct(
            @PathVariable Long id
    ) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Ngừng bán sản phẩm thành công!",
                        null
                )
        );
    }


    // =========================
    // RESTORE PRODUCT
    // =========================

    @PatchMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<ProductResponse>>
    restoreProduct(
            @PathVariable Long id
    ) {

        Product product =
                productService.restoreProduct(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Mở bán lại sản phẩm thành công!",
                        productMapper.toResponse(product)
                )
        );
    }
}