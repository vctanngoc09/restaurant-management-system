package vn.edu.ut.resto.dto.response;


public class ProductResponse {

    private Long id;

    private String name;

    private Double price;

    private String status;

    private String urlImg;

    private Long categoryId;

    private String categoryName;


    public ProductResponse() {
    }


    public ProductResponse(
            Long id,
            String name,
            Double price,
            String status,
            String urlImg,
            Long categoryId,
            String categoryName
    ) {

        this.id = id;

        this.name = name;

        this.price = price;

        this.status = status;

        this.urlImg = urlImg;

        this.categoryId = categoryId;

        this.categoryName = categoryName;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public Double getPrice() {
        return price;
    }


    public void setPrice(Double price) {
        this.price = price;
    }


    public String getStatus() {
        return status;
    }


    public void setStatus(String status) {
        this.status = status;
    }


    public String getUrlImg() {
        return urlImg;
    }


    public void setUrlImg(String urlImg) {
        this.urlImg = urlImg;
    }


    public Long getCategoryId() {
        return categoryId;
    }


    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }


    public String getCategoryName() {
        return categoryName;
    }


    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}