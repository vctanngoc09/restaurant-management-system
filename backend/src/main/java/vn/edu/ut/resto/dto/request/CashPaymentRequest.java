package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class CashPaymentRequest {

    @Size(
            max = 50,
            message = "Mã giảm giá không được vượt quá 50 ký tự."
    )
    private String promotionCode;


    @NotNull(
            message = "Số tiền khách đưa không được để trống."
    )
    @DecimalMin(
            value = "0.00",
            inclusive = false,
            message = "Số tiền khách đưa phải lớn hơn 0."
    )
    private BigDecimal cashReceived;


    public CashPaymentRequest() {
    }


    public CashPaymentRequest(
            String promotionCode,
            BigDecimal cashReceived
    ) {
        this.promotionCode = promotionCode;
        this.cashReceived = cashReceived;
    }


    public String getPromotionCode() {
        return promotionCode;
    }


    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }


    public BigDecimal getCashReceived() {
        return cashReceived;
    }


    public void setCashReceived(BigDecimal cashReceived) {
        this.cashReceived = cashReceived;
    }
}