package vn.edu.ut.resto.service;

import org.springframework.data.domain.Page;
import vn.edu.ut.resto.dto.request.ProductRequest;
import vn.edu.ut.resto.model.Product;

import java.util.List;

public interface ProductService {

    Product createProduct(
            ProductRequest request
    );

    Page<Product> getAllProducts(
            int page,
            int size,
            String keyword,
            Long categoryId,
            Boolean isAvailable
    );

    Product getProductById(Long id);

    Product updateProduct(
            Long id,
            ProductRequest request
    );

    void deleteProduct(Long id);

    Product restoreProduct(Long id);
}