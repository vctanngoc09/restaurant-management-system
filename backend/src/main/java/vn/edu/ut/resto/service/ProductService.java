package vn.edu.ut.resto.service;

import org.springframework.data.domain.Page;
import vn.edu.ut.resto.dto.request.ProductRequest;
import vn.edu.ut.resto.model.Product;
import vn.edu.ut.resto.model.enums.EProductStatus;

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
            EProductStatus status
    );

    List<Product> getMenuProducts();

    Product getProductById(Long id);

    Product updateProduct(
            Long id,
            ProductRequest request
    );

    void deleteProduct(Long id);

    Product restoreProduct(Long id);

    Product toggleAvailability(Long id);
}