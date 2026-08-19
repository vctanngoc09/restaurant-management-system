package vn.edu.ut.resto.service;

import org.springframework.data.domain.Page;
import vn.edu.ut.resto.dto.request.CreateStaffRequest;
import vn.edu.ut.resto.dto.request.UpdateStaffRequest;
import vn.edu.ut.resto.model.User;

import java.util.List;

public interface UserService {
    User registerUser(CreateStaffRequest signUpRequest);
    boolean existsByUsername(String username);
    boolean existsByPhone(String phone);
    Page<User> getAllStaff(
            int page,
            int size
    );

    User getStaffById(Long id);

    User updateStaff(Long id, UpdateStaffRequest request);

    void deactivateStaff(Long id);

    User restoreStaff(Long id);
}
