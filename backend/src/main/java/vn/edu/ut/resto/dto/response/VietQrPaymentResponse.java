package vn.edu.ut.resto.dto.response;

import vn.edu.ut.resto.model.enums.EPaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VietQrPaymentResponse {
    private Long paymentId;
    private Long orderId;
    private Long payosOrderCode;
    private String paymentLinkId;
    private BigDecimal amount;
    private EPaymentStatus paymentStatus;
    private String checkoutUrl;
    private String qrCode;
    private LocalDateTime expiresAt;
    private String failureReason;

    public VietQrPaymentResponse(Long paymentId, Long orderId, Long payosOrderCode,
                                 String paymentLinkId, BigDecimal amount,
                                 EPaymentStatus paymentStatus, String checkoutUrl,
                                 String qrCode, LocalDateTime expiresAt, String failureReason) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.payosOrderCode = payosOrderCode;
        this.paymentLinkId = paymentLinkId;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.checkoutUrl = checkoutUrl;
        this.qrCode = qrCode;
        this.expiresAt = expiresAt;
        this.failureReason = failureReason;
    }

    public Long getPaymentId() { return paymentId; }
    public Long getOrderId() { return orderId; }
    public Long getPayosOrderCode() { return payosOrderCode; }
    public String getPaymentLinkId() { return paymentLinkId; }
    public BigDecimal getAmount() { return amount; }
    public EPaymentStatus getPaymentStatus() { return paymentStatus; }
    public String getCheckoutUrl() { return checkoutUrl; }
    public String getQrCode() { return qrCode; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public String getFailureReason() { return failureReason; }
}
