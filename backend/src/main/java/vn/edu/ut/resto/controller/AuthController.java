package vn.edu.ut.resto.controller;

import vn.edu.ut.resto.dto.request.LoginRequest;
import vn.edu.ut.resto.dto.request.CreateStaffRequest;
import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.JwtResponse;
import vn.edu.ut.resto.dto.response.UserResponse;
import vn.edu.ut.resto.mapper.UserMapper;
import vn.edu.ut.resto.model.User;
import vn.edu.ut.resto.security.jwt.JwtUtils;
import vn.edu.ut.resto.security.services.UserDetailsImpl;
import vn.edu.ut.resto.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // 1. Spring Security tự động xác thực
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Tạo Token
        String jwt = jwtUtils.generateJwtToken(authentication);

        // 3. Lấy thông tin user
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        UserResponse userResponse = userMapper.toResponse(userDetails);

        // 4. Đóng gói JWT
        JwtResponse jwtResponse = new JwtResponse(jwt, userResponse);

        // 5. Trả về ApiResponse chuẩn chỉnh
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Đăng nhập thành công!", jwtResponse)
        );
    }
}