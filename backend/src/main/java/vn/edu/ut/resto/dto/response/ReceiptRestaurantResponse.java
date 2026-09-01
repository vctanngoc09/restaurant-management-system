package vn.edu.ut.resto.dto.response;

public class ReceiptRestaurantResponse {

    private final String name;
    private final String phone;
    private final String address;
    private final String taxCode;
    private final String logoUrl;
    private final String currency;


    public ReceiptRestaurantResponse(
            String name,
            String phone,
            String address,
            String taxCode,
            String logoUrl,
            String currency
    ) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.taxCode = taxCode;
        this.logoUrl = logoUrl;
        this.currency = currency;
    }


    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public String getCurrency() {
        return currency;
    }
}