package vn.edu.ut.resto.dto.response;

import vn.edu.ut.resto.model.enums.EOrderStatus;
import vn.edu.ut.resto.model.enums.EOrderType;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;

    private LocalDateTime createdAt;

    private EOrderType orderType;

    private EOrderStatus status;

    private String note;

    private Double totalPrice;


    private Long tableId;

    private String tableNumber;


    private Long staffId;

    private String staffName;

    private ShippingDetailResponse shippingDetail;


    private List<OrderItemResponse> items;


    public OrderResponse() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    public EOrderType getOrderType() {
        return orderType;
    }

    public void setOrderType(
            EOrderType orderType
    ) {
        this.orderType = orderType;
    }


    public EOrderStatus getStatus() {
        return status;
    }

    public void setStatus(
            EOrderStatus status
    ) {
        this.status = status;
    }


    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }


    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(
            Double totalPrice
    ) {
        this.totalPrice = totalPrice;
    }


    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }


    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(
            String tableNumber
    ) {
        this.tableNumber = tableNumber;
    }


    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }


    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(
            String staffName
    ) {
        this.staffName = staffName;
    }

    public ShippingDetailResponse getShippingDetail() {
        return shippingDetail;
    }

    public void setShippingDetail(ShippingDetailResponse shippingDetail) {
        this.shippingDetail = shippingDetail;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(
            List<OrderItemResponse> items
    ) {
        this.items = items;
    }
}