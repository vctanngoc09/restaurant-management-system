package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import vn.edu.ut.resto.dto.request.ProductRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.PageResponse;
import vn.edu.ut.resto.dto.response.ProductResponse;

import vn.edu.ut.resto.mapper.ProductMapper;

import vn.edu.ut.resto.model.Product;

import vn.edu.ut.resto.model.enums.EProductStatus;
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
            )
            EProductStatus status

    ) {

        Page<ProductResponse> productPage =
                productService
                        .getAllProducts(
                                page,
                                size,
                                keyword,
                                categoryId,
                                status
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

    @PostMapping(
            consumes =
                    MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<
            ApiResponse<ProductResponse>
            >
    createProduct(

            @Valid
            @ModelAttribute
            ProductRequest request
    ) {

        Product product =
                productService
                        .createProduct(
                                request
                        );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        new ApiResponse<>(
                                201,
                                "Thêm sản phẩm thành công!",
                                productMapper.toResponse(
                                        product
                                )
                        )
                );
    }


    // =========================
    // UPDATE PRODUCT
    // =========================

    @PutMapping(
            value = "/{id}",
            consumes =
                    MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<
            ApiResponse<ProductResponse>
            >
    updateProduct(

            @PathVariable
            Long id,

            @Valid
            @ModelAttribute
            ProductRequest request
    ) {

        Product product =
                productService
                        .updateProduct(
                                id,
                                request
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật sản phẩm thành công!",
                        productMapper.toResponse(
                                product
                        )
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

    // =========================
    // TOGGLE AVAILABILITY
    // AVAILABLE <-> OUT_OF_STOCK
    // =========================

    @PatchMapping("/{id}/availability")
    public ResponseEntity<
            ApiResponse<ProductResponse>
            >
    toggleAvailability(
            @PathVariable Long id
    ) {

        Product product =
                productService
                        .toggleAvailability(
                                id
                        );


        String message;


        if (
                product.getStatus()
                        == EProductStatus.AVAILABLE
        ) {

            message =
                    "Sản phẩm đã sẵn sàng để bán.";

        } else {

            message =
                    "Sản phẩm đã chuyển sang trạng thái hết món.";
        }


        return ResponseEntity.ok(

                new ApiResponse<>(

                        200,

                        message,

                        productMapper
                                .toResponse(
                                        product
                                )
                )
        );
    }
}