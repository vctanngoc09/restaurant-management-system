package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.edu.ut.resto.model.Product;

import java.util.List;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    boolean existsByCategoryId(Long categoryId);

    List<Product> findAllByIsAvailableTrue();

    List<Product> findAllByCategoryId(Long categoryId);

    List<Product> findAllByCategoryIdAndIsAvailableTrue(
            Long categoryId
    );
}