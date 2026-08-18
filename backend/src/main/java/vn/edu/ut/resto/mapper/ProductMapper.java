package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.ProductRequest;
import vn.edu.ut.resto.dto.response.ProductResponse;

import vn.edu.ut.resto.model.Product;

@Component
public class ProductMapper {


    // =========================
    // REQUEST -> ENTITY
    // =========================

    public Product toEntity(
            ProductRequest request
    ) {

        if (request == null) {
            return null;
        }

        Product product = new Product();

        product.setName(
                request.getName()
        );

        product.setPrice(
                request.getPrice()
        );

        product.setUrlImg(
                request.getUrlImg()
        );

        product.setIsAvailable(true);

        return product;
    }


    // =========================
    // UPDATE ENTITY
    // =========================

    public void updateEntity(
            ProductRequest request,
            Product product
    ) {

        if (request == null || product == null) {
            return;
        }

        product.setName(
                request.getName()
        );

        product.setPrice(
                request.getPrice()
        );

        product.setUrlImg(
                request.getUrlImg()
        );
    }


    // =========================
    // ENTITY -> RESPONSE
    // =========================

    public ProductResponse toResponse(
            Product product
    ) {

        if (product == null) {
            return null;
        }

        Long categoryId = null;
        String categoryName = null;

        if (product.getCategory() != null) {

            categoryId =
                    product.getCategory().getId();

            categoryName =
                    product.getCategory().getName();
        }

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getIsAvailable(),
                product.getUrlImg(),
                categoryId,
                categoryName
        );
    }
}