package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.PromotionRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.PromotionResponse;

import vn.edu.ut.resto.mapper.PromotionMapper;

import vn.edu.ut.resto.model.Promotion;

import vn.edu.ut.resto.service.PromotionService;

import java.util.List;


@RestController
@RequestMapping("/api/admin/promotions")
@PreAuthorize("hasRole('ADMIN')")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private PromotionMapper promotionMapper;


    @PostMapping
    public ResponseEntity<ApiResponse<PromotionResponse>>
    create(
            @Valid
            @RequestBody PromotionRequest request
    ) {

        Promotion promotion =
                promotionService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                201,
                                "Tạo chương trình giảm giá thành công!",
                                promotionMapper.toResponse(promotion)
                        )
                );
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<PromotionResponse>>>
    getAll() {

        List<PromotionResponse> responses =
                promotionService
                        .getAll()
                        .stream()
                        .map(promotionMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy danh sách chương trình giảm giá thành công!",
                        responses
                )
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PromotionResponse>>
    getById(
            @PathVariable Long id
    ) {

        Promotion promotion =
                promotionService.getById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy chương trình giảm giá thành công!",
                        promotionMapper.toResponse(promotion)
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PromotionResponse>>
    update(
            @PathVariable Long id,

            @Valid
            @RequestBody PromotionRequest request
    ) {

        Promotion promotion =
                promotionService.update(
                        id,
                        request
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật chương trình giảm giá thành công!",
                        promotionMapper.toResponse(promotion)
                )
        );
    }


    @PatchMapping("/{id}/active")
    public ResponseEntity<ApiResponse<PromotionResponse>>
    setActive(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {

        Promotion promotion =
                promotionService.setActive(
                        id,
                        active
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        active
                                ? "Đã kích hoạt chương trình giảm giá!"
                                : "Đã tắt chương trình giảm giá!",
                        promotionMapper.toResponse(promotion)
                )
        );
    }
}