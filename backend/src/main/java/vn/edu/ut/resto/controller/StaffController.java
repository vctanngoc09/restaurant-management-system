package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.CreateStaffRequest;
import vn.edu.ut.resto.dto.request.UpdateStaffRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.UserResponse;

import vn.edu.ut.resto.mapper.UserMapper;

import vn.edu.ut.resto.model.User;

import vn.edu.ut.resto.service.UserService;

import java.util.List;


@RestController
@RequestMapping("/api/admin/staff")
@CrossOrigin(origins = "*", maxAge = 3600)

@PreAuthorize("hasRole('ADMIN')")
public class StaffController {


    @Autowired
    private UserService userService;


    @Autowired
    private UserMapper userMapper;


    // =========================
    // GET ALL STAFF
    // =========================

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllStaff() {

        List<UserResponse> staff = userService
                .getAllStaff()
                .stream()
                .map(userMapper::toResponse)
                .toList();


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy danh sách nhân viên thành công!",
                        staff
                )
        );
    }


    // =========================
    // GET STAFF BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getStaffById(
            @PathVariable Long id
    ) {

        User user = userService.getStaffById(id);


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy thông tin nhân viên thành công!",
                        userMapper.toResponse(user)
                )
        );
    }


    // =========================
    // CREATE STAFF
    // =========================

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createStaff(
            @Valid @RequestBody CreateStaffRequest request
    ) {

        User user = userService.registerUser(request);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                201,
                                "Thêm nhân viên thành công!",
                                userMapper.toResponse(user)
                        )
                );
    }


    // =========================
    // UPDATE STAFF
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStaffRequest request
    ) {

        User user = userService.updateStaff(
                id,
                request
        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật nhân viên thành công!",
                        userMapper.toResponse(user)
                )
        );
    }


    // =========================
    // DELETE STAFF
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(
            @PathVariable Long id
    ) {

        userService.deactivateStaff(id);


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Vô hiệu hóa nhân viên thành công!",
                        null
                )
        );
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<UserResponse>> restoreStaff(
            @PathVariable Long id
    ) {

        User user = userService.restoreStaff(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Khôi phục nhân viên thành công!",
                        userMapper.toResponse(user)
                )
        );
    }
}