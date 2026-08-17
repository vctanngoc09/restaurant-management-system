package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.CreateTableRequest;
import vn.edu.ut.resto.dto.request.UpdateTableRequest;
import vn.edu.ut.resto.model.RestaurantTable;

import java.util.List;

public interface RestaurantTableService {

    RestaurantTable createTable(CreateTableRequest request);

    RestaurantTable updateTable(
            Long id,
            UpdateTableRequest request
    );

    RestaurantTable getTableById(Long id);

    List<RestaurantTable> getAllTables();

    void deleteTable(Long id);

    RestaurantTable restoreTable(Long id);

    RestaurantTable maintenanceTable(Long id);
}