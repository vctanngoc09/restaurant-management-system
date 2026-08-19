package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.dto.request.RestaurantTableRequest;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
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
            RestaurantTableRequest request
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

    // GET ALL TABLE
    // PAGINATION + FILTER
    // =========================

    @Override
    @Transactional(readOnly = true)
    public Page<RestaurantTable> getAllTables(
            int page,
            int size,
            String keyword,
            Long areaId,
            ETableStatus status
    ) {

        // =========================
        // VALIDATE
        // =========================

        if (page < 0) {
            throw new InvalidOperationException(
                    "Số trang không được nhỏ hơn 0."
            );
        }

        if (size <= 0 || size > 50) {
            throw new InvalidOperationException(
                    "Số lượng bàn mỗi trang phải từ 1 đến 50."
            );
        }


        // =========================
        // NORMALIZE KEYWORD
        // PostgreSQL: không truyền null
        // =========================

        if (keyword == null) {
            keyword = "";
        } else {
            keyword = keyword.trim();
        }


        // =========================
        // PAGEABLE
        // =========================

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );


        // =========================
        // STEP 1
        // GET TABLE IDS
        // =========================

        Page<Long> idPage =
                tableRepository.findTableIds(
                        keyword,
                        areaId,
                        status,
                        pageable
                );


        // Không có dữ liệu
        if (idPage.isEmpty()) {

            return new PageImpl<>(
                    List.of(),
                    pageable,
                    idPage.getTotalElements()
            );
        }


        List<Long> ids =
                idPage.getContent();


        // =========================
        // STEP 2
        // GET TABLE + AREA
        // =========================

        List<RestaurantTable> tables =
                tableRepository
                        .findTablesByIdsWithArea(ids);


        // =========================
        // PRESERVE ORDER
        // =========================

        Map<Long, RestaurantTable> tableMap =
                tables.stream()
                        .collect(
                                Collectors.toMap(
                                        RestaurantTable::getId,
                                        Function.identity()
                                )
                        );


        List<RestaurantTable> orderedTables =
                ids.stream()
                        .map(tableMap::get)
                        .filter(table -> table != null)
                        .toList();


        // =========================
        // BUILD PAGE
        // =========================

        return new PageImpl<>(
                orderedTables,
                pageable,
                idPage.getTotalElements()
        );
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
            RestaurantTableRequest request
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
        if (table.getStatus() == ETableStatus.MAINTENANCE) {
            throw new InvalidOperationException(
                    "Bàn này đã tạm dừng hoạt động."
            );
        }

        table.setStatus(ETableStatus.MAINTENANCE);

        return tableRepository.save(table);
    }
}