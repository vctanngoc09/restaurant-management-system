package vn.edu.ut.resto.dto.response;

import java.util.List;

public class UserResponse {

    private Long id;
    private String fullName;
    private String username;
    private String phone;
    private String status;
    private List<String> roles;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullName, String username, String phone, String status, List<String> roles) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.phone = phone;
        this.status = status;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}