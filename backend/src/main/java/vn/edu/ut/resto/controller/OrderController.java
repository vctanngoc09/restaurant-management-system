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

import vn.edu.ut.resto.service.OrderService;


@RestController
@RequestMapping("/api/orders")
public class OrderController {


    @Autowired
    private OrderService orderService;


    @Autowired
    private OrderMapper orderMapper;


    // ==================================================
    // CREATE ORDER
    // ==================================================

    @PostMapping
    @PreAuthorize(
            "hasAnyRole('WAITER', 'CASHIER', 'ADMIN')"
    )
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    createOrder(
            @Valid
            @RequestBody
            CreateOrderRequest request
    ) {

        Order order =
                orderService
                        .createOrder(
                                request
                        );


        OrderResponse response =
                orderMapper
                        .toResponse(
                                order
                        );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        new ApiResponse<>(
                                201,
                                "Tạo đơn hàng thành công!",
                                response
                        )
                );
    }


    // ==================================================
    // GET ACTIVE ORDER BY TABLE
    // ==================================================

    @GetMapping(
            "/table/{tableId}/active"
    )
    @PreAuthorize(
            "hasAnyRole('WAITER', 'CASHIER', 'ADMIN')"
    )
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    getActiveOrderByTable(
            @PathVariable
            Long tableId
    ) {

        Order order =
                orderService
                        .getActiveOrderByTable(
                                tableId
                        );


        OrderResponse response =
                orderMapper
                        .toResponse(
                                order
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy đơn hàng hiện tại của bàn thành công!",
                        response
                )
        );
    }


    // ==================================================
    // ADD ITEMS TO ACTIVE ORDER
    // GỌI THÊM MÓN
    // ==================================================

    @PostMapping("/{orderId}/items")
    @PreAuthorize("hasAnyRole('WAITER', 'CASHIER', 'ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>>
    addItemsToOrder(@PathVariable Long orderId,
            @Valid
            @RequestBody
            AddOrderItemsRequest request
    ) {

        Order order = orderService.addItemsToOrder(orderId, request);

        OrderResponse response = orderMapper.toResponse(order);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Gọi thêm món thành công!",
                        response
                )
        );
    }
}