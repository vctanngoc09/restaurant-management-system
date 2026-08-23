package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class OrderItemRequest {

    @NotNull(
            message = "Sản phẩm không được để trống."
    )
    private Long productId;


    @NotNull(
            message = "Số lượng không được để trống."
    )
    @Min(
            value = 1,
            message = "Số lượng món phải lớn hơn 0."
    )
    private Integer quantity;


    @Size(
            max = 255,
            message = "Ghi chú món không được vượt quá 255 ký tự."
    )
    private String note;


    public OrderItemRequest() {
    }


    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}