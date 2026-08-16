package vn.edu.ut.resto.dto.response;

import java.util.List;

public class JwtResponse {
    private String token;
    private String type = "Bearer";

    // Sử dụng object UserResponse lồng vào bên trong
    private UserResponse user;

    public JwtResponse() {}

    public JwtResponse(String token, UserResponse user) {
        this.token = token;
        this.type = "Bearer";
        this.user = user;
    }

    // --- Getters và Setters ---
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}