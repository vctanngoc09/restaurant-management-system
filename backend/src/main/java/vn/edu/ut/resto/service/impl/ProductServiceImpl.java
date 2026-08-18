package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.dto.request.ProductRequest;

import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.mapper.ProductMapper;

import vn.edu.ut.resto.model.Category;
import vn.edu.ut.resto.model.Product;

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

    @Override
    public List<Product> getAllProducts() {

        return productRepository.findAll();
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