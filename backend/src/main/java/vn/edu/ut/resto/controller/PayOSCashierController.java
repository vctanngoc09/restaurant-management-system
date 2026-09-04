package vn.edu.ut.resto.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.resto.dto.request.VietQrPaymentRequest;
import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.VietQrPaymentResponse;
import vn.edu.ut.resto.dto.response.VietQrPaymentStatusResponse;
import vn.edu.ut.resto.service.impl.PayOSPaymentService;

@RestController
@RequestMapping("/api/cashier/orders")
@PreAuthorize("hasAnyRole('CASHIER', 'ADMIN')")
public class PayOSCashierController {
    private final PayOSPaymentService payOSPaymentService;

    public PayOSCashierController(PayOSPaymentService payOSPaymentService) {
        this.payOSPaymentService = payOSPaymentService;
    }

    @PostMapping("/{orderId}/payments/vietqr")
    public ResponseEntity<ApiResponse<VietQrPaymentResponse>> createVietQr(
            @PathVariable Long orderId,
            @RequestBody(required = false) VietQrPaymentRequest request) {
        VietQrPaymentResponse response = payOSPaymentService.createVietQr(
                orderId, request != null ? request : new VietQrPaymentRequest());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(201, "Tạo mã VietQR thành công!", response));
    }

    @GetMapping("/{orderId}/payments/vietqr/status")
    public ResponseEntity<ApiResponse<VietQrPaymentStatusResponse>> getVietQrStatus(
            @PathVariable Long orderId) {
        VietQrPaymentStatusResponse response = payOSPaymentService.getVietQrStatus(orderId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Lấy trạng thái VietQR thành công!", response));
    }
}
