package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class ShippingDetailRequest {

    @NotBlank(
            message = "Tên khách hàng không được để trống."
    )
    @Size(
            max = 100,
            message = "Tên khách hàng không được vượt quá 100 ký tự."
    )
    private String customerName;


    @NotBlank(
            message = "Số điện thoại khách hàng không được để trống."
    )
    @Pattern(
            regexp = "^(0|84|\\+84)(3|5|7|8|9)[0-9]{8}$",
            message = "Số điện thoại không đúng định dạng."
    )
    private String customerPhone;


    @NotBlank(
            message = "Địa chỉ giao hàng không được để trống."
    )
    @Size(
            max = 255,
            message = "Địa chỉ giao hàng không được vượt quá 255 ký tự."
    )
    private String address;

    @PositiveOrZero(
            message = "Khoảng cách không được nhỏ hơn 0."
    )
    private Double distance;


    /*
     * Phút dự kiến giao.
     * Có thể null.
     */
    @PositiveOrZero(
            message = "Thời gian giao dự kiến không được nhỏ hơn 0."
    )
    private Integer estimatedTime;


    public ShippingDetailRequest() {
    }


    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(
            String customerName
    ) {
        this.customerName = customerName;
    }


    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(
            String customerPhone
    ) {
        this.customerPhone = customerPhone;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(
            String address
    ) {
        this.address = address;
    }


    public Double getDistance() {
        return distance;
    }

    public void setDistance(
            Double distance
    ) {
        this.distance = distance;
    }


    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(
            Integer estimatedTime
    ) {
        this.estimatedTime = estimatedTime;
    }
}