package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.resto.model.RestaurantTable;

@Repository
public interface RestaurantTableRepository
        extends JpaRepository<RestaurantTable, Long> {

    boolean existsByTableNumber(String tableNumber);

    boolean existsByTableNumberAndIdNot(
            String tableNumber,
            Long id
    );
}