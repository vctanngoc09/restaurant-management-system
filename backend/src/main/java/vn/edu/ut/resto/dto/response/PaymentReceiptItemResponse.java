package vn.edu.ut.resto.dto.response;

import java.math.BigDecimal;

public class PaymentReceiptItemResponse {

    private final Long productId;

    private final String productName;

    private final BigDecimal unitPrice;

    private final Integer quantity;

    private final BigDecimal lineTotal;


    public PaymentReceiptItemResponse(
            Long productId,
            String productName,
            BigDecimal unitPrice,
            Integer quantity,
            BigDecimal lineTotal
    ) {
        this.productId = productId;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.lineTotal = lineTotal;
    }


    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }
}