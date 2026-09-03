package vn.edu.ut.resto.dto.response;

import vn.edu.ut.resto.model.enums.EPaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VietQrPaymentStatusResponse {
    private Long paymentId;
    private Long orderId;
    private Long payosOrderCode;
    private EPaymentStatus paymentStatus;
    private BigDecimal amount;
    private LocalDateTime paidAt;
    private LocalDateTime expiresAt;
    private String failureReason;

    public VietQrPaymentStatusResponse(Long paymentId, Long orderId, Long payosOrderCode,
                                       EPaymentStatus paymentStatus, BigDecimal amount,
                                       LocalDateTime paidAt, LocalDateTime expiresAt, String failureReason) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.payosOrderCode = payosOrderCode;
        this.paymentStatus = paymentStatus;
        this.amount = amount;
        this.paidAt = paidAt;
        this.expiresAt = expiresAt;
        this.failureReason = failureReason;
    }

    public Long getPaymentId() { return paymentId; }
    public Long getOrderId() { return orderId; }
    public Long getPayosOrderCode() { return payosOrderCode; }
    public EPaymentStatus getPaymentStatus() { return paymentStatus; }
    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public String getFailureReason() { return failureReason; }
}
