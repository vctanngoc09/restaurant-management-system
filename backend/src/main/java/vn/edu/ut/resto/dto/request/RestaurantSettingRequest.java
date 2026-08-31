package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class RestaurantSettingRequest {

    @NotBlank(message = "Tên nhà hàng không được để trống.")
    @Size(max = 150, message = "Tên nhà hàng không được vượt quá 150 ký tự.")
    private String name;

    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự.")
    private String phone;

    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự.")
    private String address;

    @Size(max = 30, message = "Mã số thuế không được vượt quá 30 ký tự.")
    private String taxCode;

    @NotNull(message = "Thuế VAT không được để trống.")
    @DecimalMin(value = "0.00", message = "VAT không được nhỏ hơn 0%.")
    @DecimalMax(value = "100.00", message = "VAT không được lớn hơn 100%.")
    private BigDecimal vatRate;

    @Size(max = 500, message = "URL logo không được vượt quá 500 ký tự.")
    private String logoUrl;


    public RestaurantSettingRequest() {
    }


    public RestaurantSettingRequest(
            String name,
            String phone,
            String address,
            String taxCode,
            BigDecimal vatRate,
            String logoUrl
    ) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.taxCode = taxCode;
        this.vatRate = vatRate;
        this.logoUrl = logoUrl;
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
}