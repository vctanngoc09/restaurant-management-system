package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 150, message = "Tên sản phẩm không được vượt quá 150 ký tự")
    private String name;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Giá sản phẩm phải lớn hơn 0"
    )
    private Double price;

    private String urlImg;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    public ProductRequest() {
    }

    public ProductRequest(
            String name,
            Double price,
            String urlImg,
            Long categoryId
    ) {
        this.name = name;
        this.price = price;
        this.urlImg = urlImg;
        this.categoryId = categoryId;
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
}