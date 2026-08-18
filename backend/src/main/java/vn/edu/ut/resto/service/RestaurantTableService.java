package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.RestaurantTableRequest;
import vn.edu.ut.resto.model.RestaurantTable;

import java.util.List;

public interface RestaurantTableService {

    RestaurantTable createTable(RestaurantTableRequest request);

    RestaurantTable updateTable(
            Long id,
            RestaurantTableRequest request
    );

    RestaurantTable getTableById(Long id);

    List<RestaurantTable> getAllTables();

    void deleteTable(Long id);

    RestaurantTable restoreTable(Long id);

    RestaurantTable maintenanceTable(Long id);
}