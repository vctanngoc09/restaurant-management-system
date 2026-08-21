package vn.edu.ut.resto.repository;


import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import vn.edu.ut.resto.model.Product;

import vn.edu.ut.resto.model.enums.EProductStatus;

import java.util.List;


@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {


    boolean existsByCategoryId(
            Long categoryId
    );


    // =========================
    // PAGINATION - STEP 1
    // ONLY GET PRODUCT IDS
    // =========================

    @Query(
            value = """

                SELECT p.id

                FROM Product p

                WHERE LOWER(p.name)
                      LIKE LOWER(
                          CONCAT(
                              '%',
                              :keyword,
                              '%'
                          )
                      )

                AND (
                    :categoryId IS NULL
                    OR p.category.id = :categoryId
                )

                AND (
                    :status IS NULL
                    OR p.status = :status
                )

                ORDER BY p.id DESC

                """,

            countQuery = """

                SELECT COUNT(p.id)

                FROM Product p

                WHERE LOWER(p.name)
                      LIKE LOWER(
                          CONCAT(
                              '%',
                              :keyword,
                              '%'
                          )
                      )

                AND (
                    :categoryId IS NULL
                    OR p.category.id = :categoryId
                )

                AND (
                    :status IS NULL
                    OR p.status = :status
                )

                """
    )
    Page<Long> findProductIds(

            @Param("keyword")
            String keyword,

            @Param("categoryId")
            Long categoryId,

            @Param("status")
            EProductStatus status,

            Pageable pageable
    );


    // =========================
    // PAGINATION - STEP 2
    // GET PRODUCT + CATEGORY
    // =========================

    @Query("""

        SELECT p

        FROM Product p

        LEFT JOIN FETCH p.category

        WHERE p.id IN :ids

        """)
    List<Product> findProductsByIdsWithCategory(

            @Param("ids")
            List<Long> ids
    );
}