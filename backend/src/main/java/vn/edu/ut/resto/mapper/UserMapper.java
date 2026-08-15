package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.CreateStaffRequest;
import vn.edu.ut.resto.dto.request.UpdateStaffRequest;
import vn.edu.ut.resto.dto.response.UserResponse;
import vn.edu.ut.resto.model.User;
import vn.edu.ut.resto.security.services.UserDetailsImpl;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    // =========================
    // SIGNUP REQUEST -> USER
    // =========================

    public User toEntity(CreateStaffRequest request) {

        if (request == null) {
            return null;
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setFullName(request.getFullName());

        return user;
    }


    // =========================
    // UPDATE REQUEST -> USER
    // =========================

    public void updateEntity(
            UpdateStaffRequest request,
            User user
    ) {

        if (request == null || user == null) {
            return;
        }

        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
    }


    // =========================
    // USER -> USER RESPONSE
    // =========================

    public UserResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        List<String> roles = user.getRoles()
                .stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getPhone(),
                roles
        );
    }


    // =========================
    // USER DETAILS -> RESPONSE
    // =========================

    public UserResponse toResponse(UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return null;
        }

        List<String> roles = userDetails
                .getAuthorities()
                .stream()
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