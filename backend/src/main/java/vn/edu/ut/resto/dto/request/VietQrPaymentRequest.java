package vn.edu.ut.resto.dto.request;

public class VietQrPaymentRequest {
    private String promotionCode;

    public VietQrPaymentRequest() {}

    public String getPromotionCode() {
        return promotionCode;
    }

    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }
}
