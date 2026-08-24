package vn.edu.ut.resto.dto.response;

import java.util.List;

public class PublicTableOrderResponse {

    private String tableNumber;

    private String areaName;

    private String tableStatus;

    private boolean hasActiveOrder;

    private String message;

    private Double totalPrice;

    private List<PublicOrderItemResponse> items;


    public PublicTableOrderResponse() {
    }


    public PublicTableOrderResponse(
            String tableNumber,
            String areaName,
            String tableStatus,
            boolean hasActiveOrder,
            String message,
            Double totalPrice,
            List<PublicOrderItemResponse> items
    ) {
        this.tableNumber = tableNumber;
        this.areaName = areaName;
        this.tableStatus = tableStatus;
        this.hasActiveOrder = hasActiveOrder;
        this.message = message;
        this.totalPrice = totalPrice;
        this.items = items;
    }


    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }


    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }


    public String getTableStatus() {
        return tableStatus;
    }

    public void setTableStatus(String tableStatus) {
        this.tableStatus = tableStatus;
    }


    public boolean isHasActiveOrder() {
        return hasActiveOrder;
    }

    public void setHasActiveOrder(boolean hasActiveOrder) {
        this.hasActiveOrder = hasActiveOrder;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }


    public List<PublicOrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<PublicOrderItemResponse> items) {
        this.items = items;
    }
}