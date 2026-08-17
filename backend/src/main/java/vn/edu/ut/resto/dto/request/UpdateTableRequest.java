package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import vn.edu.ut.resto.model.enums.ETableStatus;

public class UpdateTableRequest {

    @NotBlank(message = "Số bàn không được để trống")
    @Size(max = 20, message = "Số bàn không được vượt quá 20 ký tự")
    private String tableNumber;

    @NotNull(message = "Trạng thái bàn không được để trống")
    private ETableStatus status;

    private String qrUrl;

    @NotNull(message = "Khu vực không được để trống")
    private Long areaId;

    public UpdateTableRequest() {
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public ETableStatus getStatus() {
        return status;
    }

    public void setStatus(ETableStatus status) {
        this.status = status;
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