package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.AreaRequest;
import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.AreaResponse;

import vn.edu.ut.resto.mapper.AreaMapper;

import vn.edu.ut.resto.model.Area;

import vn.edu.ut.resto.service.AreaService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/areas")
@PreAuthorize("hasRole('ADMIN')")
public class AreaController {

    @Autowired
    private AreaService areaService;

    @Autowired
    private AreaMapper areaMapper;


    // =========================
    // GET ALL AREA
    // =========================

    @GetMapping
    public ResponseEntity<ApiResponse<List<AreaResponse>>>
    getAllAreas() {

        List<AreaResponse> areas =
                areaService
                        .getAllAreas()
                        .stream()
                        .map(areaMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy danh sách khu vực thành công!",
                        areas
                )
        );
    }


    // =========================
    // GET AREA BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AreaResponse>>
    getAreaById(
            @PathVariable Long id
    ) {

        Area area =
                areaService.getAreaById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy thông tin khu vực thành công!",
                        areaMapper.toResponse(area)
                )
        );
    }


    // =========================
    // CREATE AREA
    // =========================

    @PostMapping
    public ResponseEntity<ApiResponse<AreaResponse>>
    createArea(
            @Valid
            @RequestBody AreaRequest request
    ) {

        Area area =
                areaService.createArea(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                201,
                                "Thêm khu vực thành công!",
                                areaMapper.toResponse(area)
                        )
                );
    }


    // =========================
    // UPDATE AREA
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AreaResponse>>
    updateArea(
            @PathVariable Long id,

            @Valid
            @RequestBody AreaRequest request
    ) {

        Area area =
                areaService.updateArea(
                        id,
                        request
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật khu vực thành công!",
                        areaMapper.toResponse(area)
                )
        );
    }


    // =========================
    // DELETE AREA
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>
    deleteArea(
            @PathVariable Long id
    ) {

        areaService.deleteArea(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Xóa khu vực thành công!",
                        null
                )
        );
    }
}