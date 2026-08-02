package vn.edu.ut.resto.dto.request;

import java.util.Set;

public class SignupRequest {
    private String fullName;
    private String username;
    private String password;
    private String phone;
    private Set<String> roles;

    public SignupRequest() {
    }

    public SignupRequest(String fullName, String username, String password, String phone, Set<String> roles) {
        this.fullName = fullName;
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.roles = roles;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}