package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.ProductRequest;
import vn.edu.ut.resto.model.Product;

import java.util.List;

public interface ProductService {

    Product createProduct(
            ProductRequest request
    );

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product updateProduct(
            Long id,
            ProductRequest request
    );

    void deleteProduct(Long id);

    Product restoreProduct(Long id);
}