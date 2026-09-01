package vn.edu.ut.resto.dto.response;

import vn.edu.ut.resto.model.enums.EOrderType;
import vn.edu.ut.resto.model.enums.EPaymentMethod;
import vn.edu.ut.resto.model.enums.EPaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PaymentReceiptResponse {

    // ==================================================
    // RECEIPT
    // ==================================================

    private final Long paymentId;

    private final String receiptCode;


    // ==================================================
    // ORDER
    // ==================================================

    private final Long orderId;

    private final EOrderType orderType;

    private final String tableNumber;


    // ==================================================
    // CASHIER
    // ==================================================

    private final String cashierName;


    // ==================================================
    // PAYMENT
    // ==================================================

    private final LocalDateTime paidAt;

    private final EPaymentMethod paymentMethod;

    private final EPaymentStatus paymentStatus;


    // ==================================================
    // RESTAURANT
    // ==================================================

    private final ReceiptRestaurantResponse restaurant;


    // ==================================================
    // ITEMS
    // ==================================================

    private final List<PaymentReceiptItemResponse> items;


    // ==================================================
    // MONEY
    // ==================================================

    private final BigDecimal subtotal;

    private final String promotionCode;

    private final BigDecimal discountAmount;

    private final BigDecimal vatRate;

    private final BigDecimal vatAmount;

    private final BigDecimal totalAmount;

    private final BigDecimal cashReceived;

    private final BigDecimal changeAmount;


    public PaymentReceiptResponse(
            Long paymentId,
            String receiptCode,
            Long orderId,
            EOrderType orderType,
            String tableNumber,
            String cashierName,
            LocalDateTime paidAt,
            EPaymentMethod paymentMethod,
            EPaymentStatus paymentStatus,
            ReceiptRestaurantResponse restaurant,
            List<PaymentReceiptItemResponse> items,
            BigDecimal subtotal,
            String promotionCode,
            BigDecimal discountAmount,
            BigDecimal vatRate,
            BigDecimal vatAmount,
            BigDecimal totalAmount,
            BigDecimal cashReceived,
            BigDecimal changeAmount
    ) {
        this.paymentId = paymentId;
        this.receiptCode = receiptCode;
        this.orderId = orderId;
        this.orderType = orderType;
        this.tableNumber = tableNumber;
        this.cashierName = cashierName;
        this.paidAt = paidAt;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.restaurant = restaurant;
        this.items = items;
        this.subtotal = subtotal;
        this.promotionCode = promotionCode;
        this.discountAmount = discountAmount;
        this.vatRate = vatRate;
        this.vatAmount = vatAmount;
        this.totalAmount = totalAmount;
        this.cashReceived = cashReceived;
        this.changeAmount = changeAmount;
    }


    public Long getPaymentId() {
        return paymentId;
    }

    public String getReceiptCode() {
        return receiptCode;
    }

    public Long getOrderId() {
        return orderId;
    }

    public EOrderType getOrderType() {
        return orderType;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public String getCashierName() {
        return cashierName;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public EPaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public EPaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public ReceiptRestaurantResponse getRestaurant() {
        return restaurant;
    }

    public List<PaymentReceiptItemResponse> getItems() {
        return items;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public String getPromotionCode() {
        return promotionCode;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public BigDecimal getVatRate() {
        return vatRate;
    }

    public BigDecimal getVatAmount() {
        return vatAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getCashReceived() {
        return cashReceived;
    }

    public BigDecimal getChangeAmount() {
        return changeAmount;
    }
}