package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.*;

import vn.edu.ut.resto.model.enums.EDiscountType;

import java.math.BigDecimal;

import java.time.LocalDateTime;


public class PromotionRequest {


    @NotBlank(
            message = "Mã giảm giá không được để trống."
    )
    @Size(max = 50)
    private String code;


    @NotBlank(
            message = "Tên chương trình không được để trống."
    )
    @Size(max = 150)
    private String name;


    @Size(max = 500)
    private String description;


    @NotNull
    private EDiscountType discountType;


    @NotNull
    @DecimalMin(
            value = "0.01"
    )
    private BigDecimal discountValue;


    @DecimalMin(
            value = "0.00"
    )
    private BigDecimal minOrderAmount;


    @DecimalMin(
            value = "0.01"
    )
    private BigDecimal maxDiscountAmount;


    @NotNull
    private LocalDateTime startAt;


    @NotNull
    private LocalDateTime endAt;


    @Min(1)
    private Integer usageLimit;


    private Boolean active;


    public PromotionRequest() {
    }


    public String getCode() {
        return code;
    }


    public void setCode(String code) {
        this.code = code;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public EDiscountType getDiscountType() {
        return discountType;
    }


    public void setDiscountType(
            EDiscountType discountType
    ) {
        this.discountType = discountType;
    }


    public BigDecimal getDiscountValue() {
        return discountValue;
    }


    public void setDiscountValue(
            BigDecimal discountValue
    ) {
        this.discountValue = discountValue;
    }


    public BigDecimal getMinOrderAmount() {
        return minOrderAmount;
    }


    public void setMinOrderAmount(
            BigDecimal minOrderAmount
    ) {
        this.minOrderAmount = minOrderAmount;
    }


    public BigDecimal getMaxDiscountAmount() {
        return maxDiscountAmount;
    }


    public void setMaxDiscountAmount(
            BigDecimal maxDiscountAmount
    ) {
        this.maxDiscountAmount =
                maxDiscountAmount;
    }


    public LocalDateTime getStartAt() {
        return startAt;
    }


    public void setStartAt(
            LocalDateTime startAt
    ) {
        this.startAt = startAt;
    }


    public LocalDateTime getEndAt() {
        return endAt;
    }


    public void setEndAt(
            LocalDateTime endAt
    ) {
        this.endAt = endAt;
    }


    public Integer getUsageLimit() {
        return usageLimit;
    }


    public void setUsageLimit(
            Integer usageLimit
    ) {
        this.usageLimit = usageLimit;
    }


    public Boolean getActive() {
        return active;
    }


    public void setActive(Boolean active) {
        this.active = active;
    }
}