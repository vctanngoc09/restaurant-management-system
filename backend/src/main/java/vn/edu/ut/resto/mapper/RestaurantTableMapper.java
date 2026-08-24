package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.RestaurantTableRequest;
import vn.edu.ut.resto.dto.response.TableResponse;
import vn.edu.ut.resto.model.RestaurantTable;
import vn.edu.ut.resto.model.enums.ETableStatus;

@Component
public class RestaurantTableMapper {

    public RestaurantTable toEntity(
            RestaurantTableRequest request
    ) {

        if (request == null) {
            return null;
        }

        RestaurantTable table =
                new RestaurantTable();

        table.setTableNumber(
                request.getTableNumber()
        );

        return table;
    }


    public void updateEntity(
            RestaurantTableRequest request,
            RestaurantTable table
    ) {

        if (request == null || table == null) {
            return;
        }

        table.setTableNumber(
                request.getTableNumber()
        );
    }


    public TableResponse toResponse(
            RestaurantTable table
    ) {

        if (table == null) {
            return null;
        }

        Long areaId = null;
        String areaName = null;

        if (table.getArea() != null) {
            areaId = table.getArea().getId();
            areaName = table.getArea().getName();
        }

        return new TableResponse(
                table.getId(),
                table.getTableNumber(),
                table.getStatus() != null
                        ? table.getStatus().name()
                        : null,
                table.getQrToken(),
                areaId,
                areaName
        );
    }
}