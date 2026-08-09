package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;
import vn.edu.ut.resto.dto.request.SignupRequest;
import vn.edu.ut.resto.dto.response.UserResponse;
import vn.edu.ut.resto.model.User;
import vn.edu.ut.resto.security.services.UserDetailsImpl;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public User toEntity(SignupRequest request) {
        if (request == null) return null;

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setFullName(request.getFullName());
        return user;
    }

    public UserResponse toResponse(UserDetailsImpl userDetails) {
        if (userDetails == null) return null;

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new UserResponse(
                userDetails.getId(),
                userDetails.getFullName(),
                userDetails.getUsername(),
                userDetails.getPhone(),
                roles
        );
    }
}