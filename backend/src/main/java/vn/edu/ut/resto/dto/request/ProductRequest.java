package vn.edu.ut.resto.dto.request;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;


public class ProductRequest {


    @NotBlank(
            message = "Tên sản phẩm không được để trống"
    )
    @Size(
            max = 150,
            message = "Tên sản phẩm không được vượt quá 150 ký tự"
    )
    private String name;


    @NotNull(
            message = "Giá sản phẩm không được để trống"
    )
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Giá sản phẩm phải lớn hơn 0"
    )
    private Double price;


    @NotNull(
            message = "Danh mục không được để trống"
    )
    private Long categoryId;

    private MultipartFile image;

    private Boolean removeImage;

    public ProductRequest() {
    }


    public String getName() {
        return name;
    }


    public void setName(
            String name
    ) {
        this.name = name;
    }


    public Double getPrice() {
        return price;
    }


    public void setPrice(
            Double price
    ) {
        this.price = price;
    }


    public Long getCategoryId() {
        return categoryId;
    }


    public void setCategoryId(
            Long categoryId
    ) {
        this.categoryId = categoryId;
    }


    public MultipartFile getImage() {
        return image;
    }


    public void setImage(
            MultipartFile image
    ) {
        this.image = image;
    }


    public Boolean getRemoveImage() {
        return removeImage;
    }


    public void setRemoveImage(
            Boolean removeImage
    ) {
        this.removeImage = removeImage;
    }
}