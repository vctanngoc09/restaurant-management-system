package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.dto.request.CreateTableRequest;
import vn.edu.ut.resto.dto.request.UpdateTableRequest;

import vn.edu.ut.resto.exception.DuplicateException;
import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.mapper.RestaurantTableMapper;

import vn.edu.ut.resto.model.Area;
import vn.edu.ut.resto.model.RestaurantTable;

import vn.edu.ut.resto.model.enums.ETableStatus;
import vn.edu.ut.resto.repository.AreaRepository;
import vn.edu.ut.resto.repository.RestaurantTableRepository;

import vn.edu.ut.resto.service.RestaurantTableService;

import java.util.List;

@Service
public class RestaurantTableServiceImpl
        implements RestaurantTableService {

    @Autowired
    private RestaurantTableRepository tableRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private RestaurantTableMapper tableMapper;


    // =========================
    // CREATE TABLE
    // =========================

    @Override
    public RestaurantTable createTable(
            CreateTableRequest request
    ) {

        // Check duplicate table number
        if (tableRepository.existsByTableNumber(
                request.getTableNumber()
        )) {

            throw new DuplicateException(
                    "Số bàn đã tồn tại!"
            );
        }


        // Find area
        Area area = areaRepository
                .findById(request.getAreaId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy khu vực có ID: "
                                        + request.getAreaId()
                        )
                );


        // DTO -> ENTITY
        RestaurantTable table =
                tableMapper.toEntity(request);


        // Set relationship
        table.setArea(area);


        // Save database
        return tableRepository.save(table);
    }


    // =========================
    // GET ALL TABLE
    // =========================

    @Override
    public List<RestaurantTable> getAllTables() {

        return tableRepository.findAll();
    }


    // =========================
    // GET TABLE BY ID
    // =========================

    @Override
    public RestaurantTable getTableById(Long id) {

        return tableRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy bàn có ID: " + id
                        )
                );
    }


    // =========================
    // UPDATE TABLE
    // =========================

    @Override
    public RestaurantTable updateTable(
            Long id,
            UpdateTableRequest request
    ) {

        // Find table
        RestaurantTable table =
                tableRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy bàn có ID: "
                                                + id
                                )
                        );


        // Check duplicate table number
        if (
                tableRepository
                        .existsByTableNumberAndIdNot(
                                request.getTableNumber(),
                                id
                        )
        ) {

            throw new DuplicateException(
                    "Số bàn đã tồn tại!"
            );
        }


        // Find area
        Area area = areaRepository
                .findById(request.getAreaId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy khu vực có ID: "
                                        + request.getAreaId()
                        )
                );


        // Update normal fields
        tableMapper.updateEntity(
                request,
                table
        );


        // Update relationship
        table.setArea(area);


        // Save
        return tableRepository.save(table);
    }


    // =========================
    // DELETE TABLE
    // =========================

    @Override
    public void deleteTable(Long id) {

        RestaurantTable table = tableRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy bàn có ID: " + id
                        )
                );

        if (table.getStatus() == ETableStatus.INACTIVE) {
            throw new InvalidOperationException(
                    "Bàn này đã ngừng hoạt động."
            );
        }

        table.setStatus(ETableStatus.INACTIVE);

        tableRepository.save(table);
    }

    @Override
    public RestaurantTable restoreTable(Long id) {

        RestaurantTable table = tableRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy bàn có ID: " + id
                        )
                );

        if (table.getStatus() != ETableStatus.INACTIVE) {
            throw new InvalidOperationException(
                    "Bàn này hiện vẫn đang hoạt động."
            );
        }

        table.setStatus(ETableStatus.AVAILABLE);

        return tableRepository.save(table);
    }

    @Override
    public RestaurantTable maintenanceTable(Long id) {

        RestaurantTable table = tableRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy bàn có ID: " + id
                        )
                );

        table.setStatus(ETableStatus.MAINTENANCE);

        return tableRepository.save(table);
    }
}