package vn.edu.ut.resto.exception;

import vn.edu.ut.resto.dto.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // [Giữ nguyên] Bắt lỗi khi đăng ký trùng dữ liệu[cite: 37]
    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(400, ex.getMessage(), LocalDateTime.now()));
    }

    // [Giữ nguyên] Bắt lỗi sai mật khẩu hoặc sai tài khoản từ Spring Security[cite: 37]
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(401, "Tài khoản hoặc mật khẩu không chính xác!", LocalDateTime.now()));
    }

    // [MỚI] Bắt lỗi Not Found (Không tìm thấy dữ liệu)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(404, ex.getMessage(), LocalDateTime.now()));
    }

    // [MỚI] Bắt lỗi Validation (Null, rỗng, sai định dạng, vượt biên)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Lấy tất cả các tin nhắn lỗi (message) từ file DTO gộp lại thành 1 chuỗi
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        String errorMessage = String.join(", ", errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(400, errorMessage, LocalDateTime.now()));
    }

    // [Giữ nguyên] Bắt các lỗi vặt khác chưa lường trước[cite: 37]
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ex.printStackTrace(); // In ra console để dev dễ debug
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(500, "Lỗi hệ thống nội bộ", LocalDateTime.now()));
    }

    // Bắt lỗi không đủ thẩm quyền theo logic nghiệp vụ
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN) // Hoặc UNAUTHORIZED tùy logic của bạn
                .body(new ErrorResponse(403, ex.getMessage(), LocalDateTime.now()));
    }
}