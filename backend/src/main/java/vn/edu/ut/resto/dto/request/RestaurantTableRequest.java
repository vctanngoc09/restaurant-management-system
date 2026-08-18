package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RestaurantTableRequest {

    @NotBlank(message = "Số bàn không được để trống")
    @Size(max = 20, message = "Số bàn không được vượt quá 20 ký tự")
    private String tableNumber;

    private String qrUrl;

    @NotNull(message = "Khu vực không được để trống")
    private Long areaId;

    public RestaurantTableRequest() {
    }

    public RestaurantTableRequest(
            String tableNumber,
            String qrUrl,
            Long areaId
    ) {
        this.tableNumber = tableNumber;
        this.qrUrl = qrUrl;
        this.areaId = areaId;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public String getQrUrl() {
        return qrUrl;
    }

    public void setQrUrl(String qrUrl) {
        this.qrUrl = qrUrl;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }
}