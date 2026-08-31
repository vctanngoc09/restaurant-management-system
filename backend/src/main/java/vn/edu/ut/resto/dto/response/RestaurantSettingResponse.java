package vn.edu.ut.resto.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RestaurantSettingResponse {

    private Long id;
    private String name;
    private String phone;
    private String address;
    private String taxCode;
    private BigDecimal vatRate;
    private String logoUrl;
    private String currency;
    private LocalDateTime updatedAt;


    public RestaurantSettingResponse() {
    }


    public RestaurantSettingResponse(
            Long id,
            String name,
            String phone,
            String address,
            String taxCode,
            BigDecimal vatRate,
            String logoUrl,
            String currency,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.taxCode = taxCode;
        this.vatRate = vatRate;
        this.logoUrl = logoUrl;
        this.currency = currency;
        this.updatedAt = updatedAt;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public BigDecimal getVatRate() {
        return vatRate;
    }

    public void setVatRate(BigDecimal vatRate) {
        this.vatRate = vatRate;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}