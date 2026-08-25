package vn.edu.ut.resto.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class AddOrderItemsRequest {

    @NotEmpty(
            message = "Danh sách món gọi thêm không được để trống."
    )
    @Valid
    private List<OrderItemRequest> items;


    public AddOrderItemsRequest() {
    }


    public AddOrderItemsRequest(
            List<OrderItemRequest> items
    ) {
        this.items = items;
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