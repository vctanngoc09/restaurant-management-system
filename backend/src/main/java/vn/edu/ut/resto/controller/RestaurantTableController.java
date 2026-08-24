package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.RestaurantTableRequest;
import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.PageResponse;
import vn.edu.ut.resto.dto.response.TableResponse;

import vn.edu.ut.resto.mapper.RestaurantTableMapper;

import vn.edu.ut.resto.model.RestaurantTable;

import vn.edu.ut.resto.model.enums.ETableStatus;
import vn.edu.ut.resto.service.QrCodeService;
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

    @Autowired
    private QrCodeService qrCodeService;

    
    // GET ALL TABLE
    // PAGINATION + FILTER
    // =========================

    @GetMapping
    public ResponseEntity<
            ApiResponse<PageResponse<TableResponse>>
            > getAllTables(

            @RequestParam(
                    defaultValue = "0"
            ) int page,

            @RequestParam(
                    defaultValue = "8"
            ) int size,

            @RequestParam(
                    required = false
            ) String keyword,

            @RequestParam(
                    required = false
            ) Long areaId,

            @RequestParam(
                    required = false
            ) ETableStatus status

    ) {

        Page<TableResponse> tablePage =
                tableService
                        .getAllTables(
                                page,
                                size,
                                keyword,
                                areaId,
                                status
                        )
                        .map(tableMapper::toResponse);


        PageResponse<TableResponse> response =
                PageResponse.from(tablePage);


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy danh sách bàn thành công!",
                        response
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
            @RequestBody RestaurantTableRequest request
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
            @RequestBody RestaurantTableRequest request
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

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getTableQrCode(
            @PathVariable Long id
    ) {

        RestaurantTable table =
                tableService.getTableById(id);

        byte[] qrImage =
                qrCodeService.generateTableQrCode(
                        table.getQrToken(),
                        300,
                        300
                );


        return ResponseEntity.ok()
                .header(
                        "Content-Type",
                        "image/png"
                )
                .body(qrImage);
    }

}