package vn.edu.ut.resto.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import vn.edu.ut.resto.model.enums.EOrderType;

import java.util.List;

public class CreateOrderRequest {

    @NotNull(message = "Loại đơn hàng không được để trống.")
    private EOrderType orderType;

    private Long tableId;


    @Size(max = 500, message = "Ghi chú đơn hàng không được vượt quá 500 ký tự.")
    private String note;


    @NotEmpty(message = "Đơn hàng phải có ít nhất một món.")
    @Valid
    private List<OrderItemRequest> items;


    public CreateOrderRequest() {
    }


    public EOrderType getOrderType() {
        return orderType;
    }

    public void setOrderType(EOrderType orderType) {
        this.orderType = orderType;
    }


    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }


    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }


    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(
            List<OrderItemRequest> items
    ) {
        this.items = items;
    }
}