package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.CreateTableRequest;
import vn.edu.ut.resto.dto.request.UpdateTableRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.TableResponse;

import vn.edu.ut.resto.mapper.RestaurantTableMapper;

import vn.edu.ut.resto.model.RestaurantTable;

import vn.edu.ut.resto.service.RestaurantTableService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tables")
@PreAuthorize("hasRole('ADMIN')")
public class RestaurantTableController {

    @Autowired
    private RestaurantTableService tableService;

    @Autowired
    private RestaurantTableMapper tableMapper;


    // =========================
    // GET ALL TABLE
    // =========================

    @GetMapping
    public ResponseEntity<ApiResponse<List<TableResponse>>>
    getAllTables() {

        List<TableResponse> tables =
                tableService
                        .getAllTables()
                        .stream()
                        .map(tableMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy danh sách bàn thành công!",
                        tables
                )
        );
    }


    // =========================
    // GET TABLE BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableResponse>>
    getTableById(
            @PathVariable Long id
    ) {

        RestaurantTable table =
                tableService.getTableById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy thông tin bàn thành công!",
                        tableMapper.toResponse(table)
                )
        );
    }


    // =========================
    // CREATE TABLE
    // =========================

    @PostMapping
    public ResponseEntity<ApiResponse<TableResponse>>
    createTable(
            @Valid
            @RequestBody CreateTableRequest request
    ) {

        RestaurantTable table =
                tableService.createTable(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                201,
                                "Thêm bàn thành công!",
                                tableMapper.toResponse(table)
                        )
                );
    }


    // =========================
    // UPDATE TABLE
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TableResponse>>
    updateTable(
            @PathVariable Long id,

            @Valid
            @RequestBody UpdateTableRequest request
    ) {

        RestaurantTable table =
                tableService.updateTable(
                        id,
                        request
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật bàn thành công!",
                        tableMapper.toResponse(table)
                )
        );
    }


    // =========================
    // DELETE TABLE
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>
    deleteTable(
            @PathVariable Long id
    ) {

        tableService.deleteTable(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Xóa bàn thành công!",
                        null
                )
        );
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<TableResponse>> restoreTable(
            @PathVariable Long id
    ) {

        RestaurantTable table =
                tableService.restoreTable(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Khôi phục bàn thành công!",
                        tableMapper.toResponse(table)
                )
        );
    }

    @PatchMapping("/{id}/maintenance")
    public ResponseEntity<ApiResponse<TableResponse>> maintenanceTable(
            @PathVariable Long id
    ) {

        RestaurantTable table =
                tableService.maintenanceTable(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Tạm dừng bàn thành công!",
                        tableMapper.toResponse(table)
                )
        );
    }
}