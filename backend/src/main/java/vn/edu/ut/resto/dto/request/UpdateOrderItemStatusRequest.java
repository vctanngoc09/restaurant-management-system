package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.NotNull;

import vn.edu.ut.resto.model.enums.EOrderItemStatus;


public class UpdateOrderItemStatusRequest {

    @NotNull(
            message = "Trạng thái món không được để trống."
    )
    private EOrderItemStatus status;


    public UpdateOrderItemStatusRequest() {
    }


    public EOrderItemStatus getStatus() {
        return status;
    }


    public void setStatus(
            EOrderItemStatus status
    ) {
        this.status = status;
    }
}