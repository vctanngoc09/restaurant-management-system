package vn.edu.ut.resto.dto.response;

import vn.edu.ut.resto.model.enums.EOrderItemStatus;

public class OrderItemResponse {

    private Long id;

    private Long productId;

    private String productName;

    private Double price;

    private Integer quantity;

    private String note;

    private EOrderItemStatus status;

    private Double lineTotal;


    public OrderItemResponse() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }


    public String getProductName() {
        return productName;
    }

    public void setProductName(
            String productName
    ) {
        this.productName = productName;
    }


    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(
            Integer quantity
    ) {
        this.quantity = quantity;
    }


    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }


    public EOrderItemStatus getStatus() {
        return status;
    }

    public void setStatus(
            EOrderItemStatus status
    ) {
        this.status = status;
    }


    public Double getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(
            Double lineTotal
    ) {
        this.lineTotal = lineTotal;
    }
}