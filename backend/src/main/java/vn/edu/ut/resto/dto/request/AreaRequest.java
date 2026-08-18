package vn.edu.ut.resto.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AreaRequest {

    @NotBlank(message = "Tên khu vực không được để trống")
    @Size(max = 100, message = "Tên khu vực không được vượt quá 100 ký tự")
    private String name;

    public AreaRequest() {
    }

    public AreaRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}