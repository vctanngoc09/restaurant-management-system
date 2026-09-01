package vn.edu.ut.resto.model;

import jakarta.persistence.*;

import vn.edu.ut.resto.model.enums.EPaymentMethod;
import vn.edu.ut.resto.model.enums.EPaymentStatus;

import java.math.BigDecimal;

import java.time.LocalDateTime;


@Entity
@Table(
        name = "payments",
        indexes = {
                @Index(
                        name = "idx_payment_order",
                        columnList = "order_id"
                ),

                @Index(
                        name = "idx_payment_status",
                        columnList = "payment_status"
                )
        }
)
public class Payment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==================================================
    // ORDER
    //
    // KHÔNG sửa Order.
    // Relation cũ giữ nguyên.
    // ==================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "order_id",
            nullable = false
    )
    private Order order;


    // ==================================================
    // MONEY SNAPSHOT
    //
    // subtotal lấy từ:
    //
    // order.getTotalPrice()
    // ==================================================

    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal subtotal;


    // ==================================================
    // PROMOTION
    // ==================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "promotion_id"
    )
    private Promotion promotion;


    // Snapshot mã.
    //
    // Sau này Promotion đổi
    // Payment cũ vẫn giữ code cũ.
    @Column(length = 50)
    private String promotionCode;


    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal discountAmount =
            BigDecimal.ZERO;


    // ==================================================
    // VAT SNAPSHOT
    //
    // Lấy từ RestaurantSetting
    // tại thời điểm thanh toán.
    // ==================================================

    @Column(
            nullable = false,
            precision = 5,
            scale = 2
    )
    private BigDecimal vatRate =
            BigDecimal.ZERO;


    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal vatAmount =
            BigDecimal.ZERO;


    // ==================================================
    // FINAL AMOUNT
    //
    // subtotal
    // - discountAmount
    // + vatAmount
    // ==================================================

    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal amount;


    // ==================================================
    // PAYMENT METHOD
    //
    // CASH
    // VIETQR
    // ==================================================

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    private EPaymentMethod paymentMethod;


    // ==================================================
    // STATUS
    // ==================================================

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    private EPaymentStatus paymentStatus =
            EPaymentStatus.PENDING;


    // ==================================================
    // CASH
    // ==================================================

    @Column(
            precision = 15,
            scale = 2
    )
    private BigDecimal cashReceived;


    @Column(
            precision = 15,
            scale = 2
    )
    private BigDecimal changeAmount;


    // ==================================================
    // PAYOS / VIETQR
    //
    // Các field dưới chỉ sử dụng
    // khi paymentMethod = VIETQR.
    // ==================================================

    @Column(unique = true)
    private Long payosOrderCode;


    @Column(
            length = 100,
            unique = true
    )
    private String payosPaymentLinkId;


    @Column(length = 1000)
    private String checkoutUrl;


    /*
     * QR payload / QR content
     * PayOS trả về.
     *
     * Đây không phải image base64.
     */
    @Column(columnDefinition = "TEXT")
    private String qrCode;


    // ==================================================
    // TRANSACTION RESULT
    //
    // PayOS webhook thành công
    // có thể lưu reference vào đây.
    // ==================================================

    @Column(
            length = 100,
            unique = true
    )
    private String transactionId;


    @Column(length = 100)
    private String reference;


    @Column(length = 50)
    private String bankCode;


    // ==================================================
    // ERROR
    // ==================================================

    @Column(length = 500)
    private String failureReason;


    // ==================================================
    // TIME
    // ==================================================

    @Column(
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;


    private LocalDateTime paidAt;


    // QR có thể hết hạn.
    private LocalDateTime expiresAt;

    @Column(nullable = false, length = 100)
    private String cashierName;


    public Payment() {
    }


    // ==================================================
    // PRE PERSIST
    // ==================================================

    @PrePersist
    protected void onCreate() {

        createdAt =
                LocalDateTime.now();


        if (
                paymentStatus == null
        ) {

            paymentStatus =
                    EPaymentStatus.PENDING;
        }


        if (
                discountAmount == null
        ) {

            discountAmount =
                    BigDecimal.ZERO;
        }


        if (
                vatRate == null
        ) {

            vatRate =
                    BigDecimal.ZERO;
        }


        if (
                vatAmount == null
        ) {

            vatAmount =
                    BigDecimal.ZERO;
        }
    }


    // ==================================================
    // GETTER / SETTER
    // ==================================================

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Order getOrder() {
        return order;
    }


    public void setOrder(Order order) {
        this.order = order;
    }


    public BigDecimal getSubtotal() {
        return subtotal;
    }


    public void setSubtotal(
            BigDecimal subtotal
    ) {
        this.subtotal = subtotal;
    }


    public Promotion getPromotion() {
        return promotion;
    }


    public void setPromotion(
            Promotion promotion
    ) {
        this.promotion = promotion;
    }


    public String getPromotionCode() {
        return promotionCode;
    }


    public void setPromotionCode(
            String promotionCode
    ) {
        this.promotionCode = promotionCode;
    }


    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }


    public void setDiscountAmount(
            BigDecimal discountAmount
    ) {
        this.discountAmount = discountAmount;
    }


    public BigDecimal getVatRate() {
        return vatRate;
    }


    public void setVatRate(
            BigDecimal vatRate
    ) {
        this.vatRate = vatRate;
    }


    public BigDecimal getVatAmount() {
        return vatAmount;
    }


    public void setVatAmount(
            BigDecimal vatAmount
    ) {
        this.vatAmount = vatAmount;
    }


    public BigDecimal getAmount() {
        return amount;
    }


    public void setAmount(
            BigDecimal amount
    ) {
        this.amount = amount;
    }


    public EPaymentMethod getPaymentMethod() {
        return paymentMethod;
    }


    public void setPaymentMethod(
            EPaymentMethod paymentMethod
    ) {
        this.paymentMethod = paymentMethod;
    }


    public EPaymentStatus getPaymentStatus() {
        return paymentStatus;
    }


    public void setPaymentStatus(
            EPaymentStatus paymentStatus
    ) {
        this.paymentStatus = paymentStatus;
    }


    public BigDecimal getCashReceived() {
        return cashReceived;
    }


    public void setCashReceived(
            BigDecimal cashReceived
    ) {
        this.cashReceived = cashReceived;
    }


    public BigDecimal getChangeAmount() {
        return changeAmount;
    }


    public void setChangeAmount(
            BigDecimal changeAmount
    ) {
        this.changeAmount = changeAmount;
    }


    public Long getPayosOrderCode() {
        return payosOrderCode;
    }


    public void setPayosOrderCode(
            Long payosOrderCode
    ) {
        this.payosOrderCode = payosOrderCode;
    }


    public String getPayosPaymentLinkId() {
        return payosPaymentLinkId;
    }


    public void setPayosPaymentLinkId(
            String payosPaymentLinkId
    ) {
        this.payosPaymentLinkId =
                payosPaymentLinkId;
    }


    public String getCheckoutUrl() {
        return checkoutUrl;
    }


    public void setCheckoutUrl(
            String checkoutUrl
    ) {
        this.checkoutUrl = checkoutUrl;
    }


    public String getQrCode() {
        return qrCode;
    }


    public void setQrCode(
            String qrCode
    ) {
        this.qrCode = qrCode;
    }


    public String getTransactionId() {
        return transactionId;
    }


    public void setTransactionId(
            String transactionId
    ) {
        this.transactionId = transactionId;
    }


    public String getReference() {
        return reference;
    }


    public void setReference(
            String reference
    ) {
        this.reference = reference;
    }


    public String getBankCode() {
        return bankCode;
    }


    public void setBankCode(
            String bankCode
    ) {
        this.bankCode = bankCode;
    }


    public String getFailureReason() {
        return failureReason;
    }


    public void setFailureReason(
            String failureReason
    ) {
        this.failureReason = failureReason;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getPaidAt() {
        return paidAt;
    }


    public void setPaidAt(
            LocalDateTime paidAt
    ) {
        this.paidAt = paidAt;
    }


    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }


    public void setExpiresAt(
            LocalDateTime expiresAt
    ) {
        this.expiresAt = expiresAt;
    }

    public String getCashierName() {
        return cashierName;
    }

    public void setCashierName(String cashierName) {
        this.cashierName = cashierName;
    }
}