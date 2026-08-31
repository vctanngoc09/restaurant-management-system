package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.OrderResponse;

import vn.edu.ut.resto.mapper.OrderMapper;

import vn.edu.ut.resto.model.Order;

import vn.edu.ut.resto.service.WaiterService;


@RestController
@RequestMapping("/api/waiter/orders")
@PreAuthorize(
        "hasAnyRole('WAITER', 'ADMIN')"
)
public class WaiterController {


    @Autowired
    private WaiterService waiterService;


    @Autowired
    private OrderMapper orderMapper;


    // ==================================================
    // CREATE DINE IN
    // ==================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    createDineInOrder(
            @Valid
            @RequestBody
            CreateOrderRequest request
    ) {

        Order order =
                waiterService
                        .createDineInOrder(
                                request
                        );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        new ApiResponse<>(
                                201,
                                "Tạo đơn tại bàn thành công!",
                                orderMapper.toResponse(
                                        order
                                )
                        )
                );
    }


    // ==================================================
    // ACTIVE ORDER BY TABLE
    // ==================================================

    @GetMapping(
            "/table/{tableId}/active"
    )
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    getActiveOrder(
            @PathVariable
            Long tableId
    ) {

        Order order =
                waiterService
                        .getActiveOrderByTable(
                                tableId
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy đơn hiện tại của bàn thành công!",
                        orderMapper.toResponse(
                                order
                        )
                )
        );
    }


    // ==================================================
    // ADD ITEMS
    // ==================================================

    @PostMapping(
            "/{orderId}/items"
    )
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    addItems(
            @PathVariable
            Long orderId,

            @Valid
            @RequestBody
            AddOrderItemsRequest request
    ) {

        Order order =
                waiterService
                        .addItems(
                                orderId,
                                request
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Gọi thêm món thành công!",
                        orderMapper.toResponse(
                                order
                        )
                )
        );
    }


    // ==================================================
    // SERVE
    // ==================================================

    @PatchMapping(
            "/items/{orderItemId}/serve"
    )
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    serveItem(
            @PathVariable
            Long orderItemId
    ) {

        Order order =
                waiterService
                        .serveItem(
                                orderItemId
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Đã xác nhận phục vụ món!",
                        orderMapper.toResponse(
                                order
                        )
                )
        );
    }

    @PatchMapping(
            "/{orderId}/request-payment"
    )
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    requestPayment(
            @PathVariable
            Long orderId
    ) {

        Order order =
                waiterService
                        .requestPayment(
                                orderId
                        );


        OrderResponse response =
                orderMapper
                        .toResponse(
                                order
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Đã gửi yêu cầu thanh toán!",
                        response
                )
        );
    }
}