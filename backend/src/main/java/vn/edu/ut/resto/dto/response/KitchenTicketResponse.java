package vn.edu.ut.resto.dto.response;

import vn.edu.ut.resto.model.enums.EKitchenTicketStatus;
import vn.edu.ut.resto.model.enums.EOrderType;

import java.time.LocalDateTime;
import java.util.List;


public class KitchenTicketResponse {


    private Long id;

    private Long orderId;

    private Integer batchNumber;

    private EKitchenTicketStatus status;


    private LocalDateTime firedAt;

    private LocalDateTime startedAt;

    private LocalDateTime readyAt;

    private LocalDateTime doneAt;


    private EOrderType orderType;


    private Long tableId;

    private String tableNumber;


    private Long staffId;

    private String staffName;


    private List<OrderItemResponse> items;


    public KitchenTicketResponse() {
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Long getOrderId() {
        return orderId;
    }


    public void setOrderId(
            Long orderId
    ) {
        this.orderId = orderId;
    }


    public Integer getBatchNumber() {
        return batchNumber;
    }


    public void setBatchNumber(
            Integer batchNumber
    ) {
        this.batchNumber = batchNumber;
    }


    public EKitchenTicketStatus getStatus() {
        return status;
    }


    public void setStatus(
            EKitchenTicketStatus status
    ) {
        this.status = status;
    }


    public LocalDateTime getFiredAt() {
        return firedAt;
    }


    public void setFiredAt(
            LocalDateTime firedAt
    ) {
        this.firedAt = firedAt;
    }


    public LocalDateTime getStartedAt() {
        return startedAt;
    }


    public void setStartedAt(
            LocalDateTime startedAt
    ) {
        this.startedAt = startedAt;
    }


    public LocalDateTime getReadyAt() {
        return readyAt;
    }


    public void setReadyAt(
            LocalDateTime readyAt
    ) {
        this.readyAt = readyAt;
    }


    public LocalDateTime getDoneAt() {
        return doneAt;
    }


    public void setDoneAt(
            LocalDateTime doneAt
    ) {
        this.doneAt = doneAt;
    }


    public EOrderType getOrderType() {
        return orderType;
    }


    public void setOrderType(
            EOrderType orderType
    ) {
        this.orderType = orderType;
    }


    public Long getTableId() {
        return tableId;
    }


    public void setTableId(
            Long tableId
    ) {
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


    public void setStaffId(
            Long staffId
    ) {
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


    public List<OrderItemResponse> getItems() {
        return items;
    }


    public void setItems(
            List<OrderItemResponse> items
    ) {
        this.items = items;
    }
}