package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.RestaurantSettingRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.RestaurantSettingResponse;

import vn.edu.ut.resto.mapper.RestaurantSettingMapper;

import vn.edu.ut.resto.model.RestaurantSetting;

import vn.edu.ut.resto.service.RestaurantSettingService;


@RestController
@RequestMapping("/api/restaurant-settings")
public class RestaurantSettingController {

    @Autowired
    private RestaurantSettingService restaurantSettingService;

    @Autowired
    private RestaurantSettingMapper restaurantSettingMapper;


    @GetMapping
    public ResponseEntity<ApiResponse<RestaurantSettingResponse>>
    getCurrentSetting() {

        RestaurantSetting setting =
                restaurantSettingService.getCurrentSetting();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy thông tin nhà hàng thành công!",
                        restaurantSettingMapper.toResponse(setting)
                )
        );
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantSettingResponse>>
    createSetting(
            @Valid
            @RequestBody RestaurantSettingRequest request
    ) {

        RestaurantSetting setting =
                restaurantSettingService.createSetting(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                201,
                                "Tạo thông tin nhà hàng thành công!",
                                restaurantSettingMapper.toResponse(setting)
                        )
                );
    }


    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantSettingResponse>>
    updateSetting(
            @Valid
            @RequestBody RestaurantSettingRequest request
    ) {

        RestaurantSetting setting =
                restaurantSettingService.updateSetting(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật thông tin nhà hàng thành công!",
                        restaurantSettingMapper.toResponse(setting)
                )
        );
    }
}