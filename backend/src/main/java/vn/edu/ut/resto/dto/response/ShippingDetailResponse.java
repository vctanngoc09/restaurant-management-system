package vn.edu.ut.resto.dto.response;

public class ShippingDetailResponse {

    private Long id;

    private String customerName;

    private String customerPhone;

    private String address;

    private Double distance;

    private Integer estimatedTime;


    public ShippingDetailResponse() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(
            String customerName
    ) {
        this.customerName = customerName;
    }


    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(
            String customerPhone
    ) {
        this.customerPhone = customerPhone;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(
            String address
    ) {
        this.address = address;
    }


    public Double getDistance() {
        return distance;
    }

    public void setDistance(
            Double distance
    ) {
        this.distance = distance;
    }


    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(
            Integer estimatedTime
    ) {
        this.estimatedTime = estimatedTime;
    }
}