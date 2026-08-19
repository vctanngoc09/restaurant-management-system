package vn.edu.ut.resto.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import vn.edu.ut.resto.model.RestaurantTable;
import vn.edu.ut.resto.model.enums.ETableStatus;

import java.util.List;

@Repository
public interface RestaurantTableRepository
        extends JpaRepository<RestaurantTable, Long> {

    boolean existsByTableNumber(String tableNumber);

    boolean existsByTableNumberAndIdNot(
            String tableNumber,
            Long id
    );

    boolean existsByAreaId(Long areaId);


    // =========================
    // PAGINATION - STEP 1
    // GET IDS ONLY
    // =========================

    @Query(
            value = """
                    SELECT t.id
                    FROM RestaurantTable t
                    WHERE LOWER(t.tableNumber)
                          LIKE LOWER(CONCAT('%', :keyword, '%'))
                    AND (
                        :areaId IS NULL
                        OR t.area.id = :areaId
                    )
                    AND (
                        :status IS NULL
                        OR t.status = :status
                    )
                    ORDER BY t.id DESC
                    """,

            countQuery = """
                    SELECT COUNT(t.id)
                    FROM RestaurantTable t
                    WHERE LOWER(t.tableNumber)
                          LIKE LOWER(CONCAT('%', :keyword, '%'))
                    AND (
                        :areaId IS NULL
                        OR t.area.id = :areaId
                    )
                    AND (
                        :status IS NULL
                        OR t.status = :status
                    )
                    """
    )
    Page<Long> findTableIds(
            @Param("keyword") String keyword,
            @Param("areaId") Long areaId,
            @Param("status") ETableStatus status,
            Pageable pageable
    );


    // =========================
    // PAGINATION - STEP 2
    // GET TABLE + AREA
    // =========================

    @Query("""
            SELECT t
            FROM RestaurantTable t
            LEFT JOIN FETCH t.area
            WHERE t.id IN :ids
            """)
    List<RestaurantTable> findTablesByIdsWithArea(
            @Param("ids") List<Long> ids
    );
}