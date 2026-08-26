package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;
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

import vn.edu.ut.resto.model.enums.EProductStatus;
import vn.edu.ut.resto.repository.CategoryRepository;
import vn.edu.ut.resto.repository.ProductRepository;

import vn.edu.ut.resto.service.CloudinaryService;
import vn.edu.ut.resto.service.ProductService;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CloudinaryService cloudinaryService;


    // =========================
    // CREATE PRODUCT
    // =========================

    @Override
    @Transactional
    public Product createProduct(
            ProductRequest request
    ) {

        // =========================
        // CATEGORY
        // =========================

        Category category =
                categoryRepository
                        .findById(
                                request.getCategoryId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy danh mục có ID: "
                                                + request.getCategoryId()
                                )
                        );


        // =========================
        // DTO -> ENTITY
        // =========================

        Product product =
                productMapper.toEntity(
                        request
                );


        product.setCategory(
                category
        );


        /*
         * Save lần đầu để PostgreSQL
         * sinh Product ID.
         *
         * Ví dụ:
         *
         * id = 15
         */
        Product savedProduct =
                productRepository.save(
                        product
                );


        // =========================
        // IMAGE
        // =========================

        MultipartFile image =
                request.getImage();


        if (
                image != null
                        &&
                        !image.isEmpty()
        ) {

            /*
             * Cloudinary:
             *
             * resto/products/product_15
             */
            String imageUrl =
                    cloudinaryService
                            .uploadProductImage(
                                    savedProduct.getId(),
                                    image
                            );


            savedProduct.setUrlImg(
                    imageUrl
            );
        }


        // =========================
        // SAVE FINAL PRODUCT
        // =========================

        return productRepository.save(
                savedProduct
        );
    }


    @Override
    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(
            int page,
            int size,
            String keyword,
            Long categoryId,
            EProductStatus status
    ) {

        // =========================
        // VALIDATE
        // =========================

        if (page < 0) {

            throw new InvalidOperationException(
                    "Số trang không được nhỏ hơn 0."
            );
        }


        if (
                size <= 0 ||
                        size > 50
        ) {

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

            keyword =
                    keyword.trim();
        }


        // =========================
        // PAGEABLE
        // =========================

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );


        // =========================
        // STEP 1
        // GET IDS
        // =========================

        Page<Long> idPage =
                productRepository
                        .findProductIds(
                                keyword,
                                categoryId,
                                status,
                                pageable
                        );


        // =========================
        // EMPTY
        // =========================

        if (idPage.isEmpty()) {

            return new PageImpl<>(
                    List.of(),
                    pageable,
                    idPage
                            .getTotalElements()
            );
        }


        List<Long> ids =
                idPage.getContent();


        // =========================
        // STEP 2
        // PRODUCT + CATEGORY
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
                products
                        .stream()
                        .collect(
                                Collectors.toMap(
                                        Product::getId,
                                        Function.identity()
                                )
                        );


        List<Product> orderedProducts =
                ids
                        .stream()

                        .map(
                                productMap::get
                        )

                        .filter(
                                product ->
                                        product != null
                        )

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

    @Override
    @Transactional(readOnly = true)
    public List<Product> getMenuProducts() {

        return productRepository
                .findMenuProducts(
                        EProductStatus.INACTIVE
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
    @Transactional
    public Product updateProduct(
            Long id,
            ProductRequest request
    ) {

        // =========================
        // PRODUCT
        // =========================

        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy sản phẩm có ID: "
                                                + id
                                )
                        );


        // =========================
        // CATEGORY
        // =========================

        Category category =
                categoryRepository
                        .findById(
                                request.getCategoryId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy danh mục có ID: "
                                                + request.getCategoryId()
                                )
                        );


        // =========================
        // NORMAL FIELDS
        // =========================

        productMapper.updateEntity(
                request,
                product
        );


        product.setCategory(
                category
        );


        // =========================
        // IMAGE LOGIC
        // =========================

        MultipartFile newImage =
                request.getImage();


        boolean removeImage =
                Boolean.TRUE.equals(
                        request.getRemoveImage()
                );


        /*
         * Không cho vừa upload ảnh mới
         * vừa yêu cầu xóa ảnh.
         */
        if (
                removeImage
                        &&
                        newImage != null
                        &&
                        !newImage.isEmpty()
        ) {

            throw new InvalidOperationException(
                    "Không thể vừa cập nhật ảnh mới vừa yêu cầu xóa ảnh."
            );
        }


        // =========================
        // CASE 1:
        // UPLOAD / REPLACE IMAGE
        // =========================

        if (
                newImage != null
                        &&
                        !newImage.isEmpty()
        ) {

            String imageUrl =
                    cloudinaryService
                            .uploadProductImage(
                                    product.getId(),
                                    newImage
                            );


            product.setUrlImg(
                    imageUrl
            );
        }


        // =========================
        // CASE 2:
        // REMOVE CURRENT IMAGE
        // =========================

        else if (removeImage) {

            if (
                    product.getUrlImg() != null
                            &&
                            !product.getUrlImg().isBlank()
            ) {

                cloudinaryService
                        .deleteProductImage(
                                product.getId()
                        );


                product.setUrlImg(
                        null
                );
            }
        }


        // =========================
        // CASE 3:
        //
        // Không gửi image
        // removeImage = false
        //
        // → GIỮ NGUYÊN ẢNH CŨ
        // =========================


        return productRepository.save(
                product
        );
    }


    // =========================
    // SOFT DELETE PRODUCT
    // =========================

    @Override
    public void deleteProduct(
            Long id
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


        if (
                product.getStatus()
                        == EProductStatus.INACTIVE
        ) {

            throw new InvalidOperationException(
                    "Sản phẩm này đã ngừng bán."
            );
        }


        product.setStatus(
                EProductStatus.INACTIVE
        );


        productRepository.save(
                product
        );
    }


    // =========================
    // RESTORE PRODUCT
    // =========================

    @Override
    public Product restoreProduct(
            Long id
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


        if (
                product.getStatus()
                        != EProductStatus.INACTIVE
        ) {

            throw new InvalidOperationException(
                    "Sản phẩm này chưa ở trạng thái ngừng bán."
            );
        }


        product.setStatus(
                EProductStatus.AVAILABLE
        );


        return productRepository.save(
                product
        );
    }
    @Override
    public Product toggleAvailability(
            Long id
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


        // =========================
        // INACTIVE
        // =========================

        if (
                product.getStatus()
                        == EProductStatus.INACTIVE
        ) {

            throw new InvalidOperationException(
                    "Không thể thay đổi trạng thái món đã ngừng bán."
            );
        }


        // =========================
        // AVAILABLE -> OUT OF STOCK
        // =========================

        if (
                product.getStatus()
                        == EProductStatus.AVAILABLE
        ) {

            product.setStatus(
                    EProductStatus.OUT_OF_STOCK
            );
        }


        // =========================
        // OUT OF STOCK -> AVAILABLE
        // =========================

        else if (
                product.getStatus()
                        == EProductStatus.OUT_OF_STOCK
        ) {

            product.setStatus(
                    EProductStatus.AVAILABLE
            );
        }


        return productRepository.save(
                product
        );
    }
}