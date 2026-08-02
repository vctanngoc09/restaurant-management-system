package vn.edu.ut.resto.dto.response;

import java.util.List;

public class UserResponse {

    private Long id;
    private String username;
    private String phone;
    private List<String> roles;

    // Constructor mặc định
    public UserResponse() {
    }

    // Constructor đầy đủ tham số
    public UserResponse(Long id, String username, String phone, List<String> roles) {
        this.id = id;
        this.username = username;
        this.phone = phone;
        this.roles = roles;
    }

    // --- Getters và Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}