package vn.edu.ut.resto.controller;

import vn.edu.ut.resto.dto.request.LoginRequest;
import vn.edu.ut.resto.dto.request.SignupRequest;
import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.JwtResponse;
import vn.edu.ut.resto.dto.response.UserResponse;
import vn.edu.ut.resto.exception.DuplicateException;
import vn.edu.ut.resto.mapper.UserMapper;
import vn.edu.ut.resto.model.User;
import vn.edu.ut.resto.security.jwt.JwtUtils;
import vn.edu.ut.resto.security.services.UserDetailsImpl;
import vn.edu.ut.resto.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    IUserService userService;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserMapper userMapper;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        // 1. Kiểm tra trùng lặp và ném Exception (GlobalExceptionHandler sẽ tự bắt)
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            throw new DuplicateException("Lỗi: Tên đăng nhập đã tồn tại!");
        }

        if (userService.existsByPhone(signUpRequest.getPhone())) {
            throw new DuplicateException("Lỗi: Số điện thoại đã được sử dụng!");
        }

        // 2. Lưu User mới
        User newUser = userService.registerUser(signUpRequest);

        java.util.List<String> roleNames = newUser.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(java.util.stream.Collectors.toList());

        // 3. Truyền biến roleNames vào thay cho chữ 'null'
        UserResponse responseData = new UserResponse(newUser.getId(), newUser.getUsername(), newUser.getPhone(), roleNames);

        // 4. Bọc lại bằng ApiResponse theo style của bạn bè
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(201, "Đăng ký nhân viên thành công!", responseData)
        );
    }

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
        JwtResponse jwtResponse = new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getPhone(), userResponse.getRoles());

        // 5. Trả về ApiResponse chuẩn chỉnh
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Đăng nhập thành công!", jwtResponse)
        );
    }
}