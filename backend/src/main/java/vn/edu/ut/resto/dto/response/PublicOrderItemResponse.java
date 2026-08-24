package vn.edu.ut.resto.dto.response;

public class PublicOrderItemResponse {

    private String productName;

    private Double price;

    private Integer quantity;

    private String note;

    private String status;

    private Double lineTotal;


    public PublicOrderItemResponse() {
    }


    public PublicOrderItemResponse(
            String productName,
            Double price,
            Integer quantity,
            String note,
            String status,
            Double lineTotal
    ) {
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.note = note;
        this.status = status;
        this.lineTotal = lineTotal;
    }


    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
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

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public Double getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(Double lineTotal) {
        this.lineTotal = lineTotal;
    }
}