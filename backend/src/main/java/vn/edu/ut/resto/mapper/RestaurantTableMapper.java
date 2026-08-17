package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.CreateTableRequest;
import vn.edu.ut.resto.dto.request.UpdateTableRequest;
import vn.edu.ut.resto.dto.response.TableResponse;
import vn.edu.ut.resto.model.RestaurantTable;
import vn.edu.ut.resto.model.enums.ETableStatus;

@Component
public class RestaurantTableMapper {

    // CREATE REQUEST -> ENTITY
    public RestaurantTable toEntity(CreateTableRequest request) {

        if (request == null) {
            return null;
        }

        RestaurantTable table = new RestaurantTable();

        table.setTableNumber(request.getTableNumber());
        table.setQrUrl(request.getQrUrl());

        if (request.getStatus() == null) {
            table.setStatus(ETableStatus.AVAILABLE);
        } else {
            table.setStatus(request.getStatus());
        }

        return table;
    }


    // UPDATE REQUEST -> EXISTING ENTITY
    public void updateEntity(
            UpdateTableRequest request,
            RestaurantTable table
    ) {

        if (request == null || table == null) {
            return;
        }

        table.setTableNumber(request.getTableNumber());
        table.setStatus(request.getStatus());
        table.setQrUrl(request.getQrUrl());
    }


    // ENTITY -> RESPONSE
    public TableResponse toResponse(RestaurantTable table) {

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
                table.getQrUrl(),
                areaId,
                areaName
        );
    }
}