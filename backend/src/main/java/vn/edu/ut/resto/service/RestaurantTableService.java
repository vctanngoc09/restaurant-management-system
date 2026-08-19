package vn.edu.ut.resto.service;

import org.springframework.data.domain.Page;
import vn.edu.ut.resto.dto.request.RestaurantTableRequest;
import vn.edu.ut.resto.model.RestaurantTable;
import vn.edu.ut.resto.model.enums.ETableStatus;

import java.util.List;

public interface RestaurantTableService {

    RestaurantTable createTable(RestaurantTableRequest request);

    RestaurantTable updateTable(
            Long id,
            RestaurantTableRequest request
    );

    RestaurantTable getTableById(Long id);

    Page<RestaurantTable> getAllTables(
            int page,
            int size,
            String keyword,
            Long areaId,
            ETableStatus status
    );

    void deleteTable(Long id);

    RestaurantTable restoreTable(Long id);

    RestaurantTable maintenanceTable(Long id);
}