package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.ut.resto.dto.request.SignupRequest;
import vn.edu.ut.resto.exception.DuplicateException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;
import vn.edu.ut.resto.mapper.UserMapper;
import vn.edu.ut.resto.model.Role;
import vn.edu.ut.resto.model.User;
import vn.edu.ut.resto.model.enums.ERole;
import vn.edu.ut.resto.repository.RoleRepository;
import vn.edu.ut.resto.repository.UserRepository;
import vn.edu.ut.resto.service.UserService;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UserMapper userMapper;

    @Override
    public User registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new DuplicateException("Lỗi: Tên đăng nhập đã tồn tại!");
        }

        if (userRepository.existsByPhone(signUpRequest.getPhone())) {
            throw new DuplicateException("Lỗi: Số điện thoại đã được sử dụng!");
        }

        User user = userMapper.toEntity(signUpRequest);
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        // Lấy danh sách Role dạng String từ Request
        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        // Nếu Frontend không truyền Role, mặc định là Phục vụ (WAITER)
        if (strRoles == null || strRoles.isEmpty()) {
            Role waiterRole = roleRepository.findByName(ERole.ROLE_WAITER)
                    .orElseThrow(() -> new ResourceNotFoundException("Lỗi: Không tìm thấy quyền WAITER trong DB."));
            roles.add(waiterRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new ResourceNotFoundException("Lỗi: Không tìm thấy quyền ADMIN."));
                        roles.add(adminRole);
                        break;
                    case "chef":
                        Role chefRole = roleRepository.findByName(ERole.ROLE_CHEF)
                                .orElseThrow(() -> new ResourceNotFoundException("Lỗi: Không tìm thấy quyền CHEF."));
                        roles.add(chefRole);
                        break;
                    case "cashier":
                        Role cashierRole = roleRepository.findByName(ERole.ROLE_CASHIER)
                                .orElseThrow(() -> new ResourceNotFoundException("Lỗi: Không tìm thấy quyền CASHIER."));
                        roles.add(cashierRole);
                        break;
                    case "waiter":
                    default:
                        Role waiterRole = roleRepository.findByName(ERole.ROLE_WAITER)
                                .orElseThrow(() -> new ResourceNotFoundException("Lỗi: Không tìm thấy quyền WAITER."));
                        roles.add(waiterRole);
                }
            });
        }

        user.setRoles(roles);
        return userRepository.save(user);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }
}