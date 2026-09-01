package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CashPaymentRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.OrderResponse;

import vn.edu.ut.resto.dto.response.PaymentReceiptResponse;
import vn.edu.ut.resto.mapper.OrderMapper;

import vn.edu.ut.resto.model.Order;

import vn.edu.ut.resto.model.enums.EOrderType;

import vn.edu.ut.resto.service.CashierService;

import java.util.List;


@RestController
@RequestMapping("/api/cashier/orders")
@PreAuthorize(
        "hasAnyRole('CASHIER', 'ADMIN')"
)
public class CashierController {


    @Autowired
    private CashierService cashierService;


    @Autowired
    private OrderMapper orderMapper;


    // ==================================================
    // CREATE ORDER
    //
    // DINE_IN
    // TAKE_AWAY
    // DELIVERY
    // ==================================================

    @PostMapping
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    createOrder(
            @Valid
            @RequestBody
            CreateOrderRequest request
    ) {

        Order order =
                cashierService
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
    //
    // DINE_IN
    // ==================================================

    @GetMapping(
            "/table/{tableId}/active"
    )
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    getActiveOrderByTable(
            @PathVariable
            Long tableId
    ) {

        Order order =
                cashierService
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
                        "Lấy đơn hiện tại của bàn thành công!",
                        response
                )
        );
    }


    // ==================================================
    // ADD ITEMS
    //
    // DINE_IN
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
                cashierService
                        .addItems(
                                orderId,
                                request
                        );


        OrderResponse response =
                orderMapper
                        .toResponse(
                                order
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Gọi thêm món thành công!",
                        response
                )
        );
    }


    // ==================================================
    // ACTIVE TAKE AWAY / DELIVERY
    // ==================================================

    @GetMapping(
            "/type/{orderType}/active"
    )
    public ResponseEntity<
            ApiResponse<List<OrderResponse>>
            >
    getActiveOrdersByType(
            @PathVariable
            EOrderType orderType
    ) {

        List<OrderResponse> responses =
                cashierService
                        .getActiveOrdersByType(
                                orderType
                        )
                        .stream()
                        .map(
                                orderMapper::toResponse
                        )
                        .toList();


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy danh sách đơn đang hoạt động thành công!",
                        responses
                )
        );
    }


    // ==================================================
    // SERVE ITEM
    //
    // DINE_IN
    // TAKE_AWAY
    // DELIVERY
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
                cashierService
                        .serveItem(
                                orderItemId
                        );


        OrderResponse response =
                orderMapper
                        .toResponse(
                                order
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Đã xác nhận giao món!",
                        response
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
                cashierService
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
                        "Đơn hàng đã chuyển sang chờ thanh toán!",
                        response
                )
        );
    }


    @PostMapping("/{orderId}/payments/cash")
    public ResponseEntity<ApiResponse<PaymentReceiptResponse>> payCash(
            @PathVariable
            Long orderId,

            @Valid
            @RequestBody
            CashPaymentRequest request
    ) {

        PaymentReceiptResponse response =
                cashierService
                        .payCash(
                                orderId,
                                request
                        );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        new ApiResponse<>(
                                201,
                                "Thanh toán tiền mặt thành công!",
                                response
                        )
                );
    }
}