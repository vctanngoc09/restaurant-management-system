package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.ut.resto.dto.request.CreateStaffRequest;
import vn.edu.ut.resto.dto.request.UpdateStaffRequest;
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
import java.util.List;
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
    public User registerUser(CreateStaffRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateException(
                    "Tên đăng nhập đã tồn tại!"
            );
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateException(
                    "Số điện thoại đã được sử dụng!"
            );
        }

        User user = userMapper.toEntity(request);

        user.setPassword(
                encoder.encode(request.getPassword())
        );

        user.setRoles(
                resolveRoles(request.getRoles())
        );

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

    @Override
    public void deleteStaff(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy nhân viên có ID: " + id
                        )
                );

        userRepository.delete(user);
    }

    @Override
    public User updateStaff(
            Long id,
            UpdateStaffRequest request
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy nhân viên có ID: " + id
                        )
                );


        // =========================
        // CHECK USERNAME
        // =========================

        if (userRepository.existsByUsernameAndIdNot(
                request.getUsername(),
                id
        )) {

            throw new DuplicateException(
                    "Tên đăng nhập đã tồn tại!"
            );
        }


        // =========================
        // CHECK PHONE
        // =========================

        if (userRepository.existsByPhoneAndIdNot(
                request.getPhone(),
                id
        )) {

            throw new DuplicateException(
                    "Số điện thoại đã được sử dụng!"
            );
        }


        // =========================
        // UPDATE BASIC INFORMATION
        // =========================

        userMapper.updateEntity(request, user);


        // =========================
        // UPDATE PASSWORD
        // =========================

        if (
                request.getPassword() != null &&
                        !request.getPassword().isBlank()
        ) {

            user.setPassword(
                    encoder.encode(request.getPassword())
            );
        }


        // =========================
        // UPDATE ROLE
        // =========================

        user.setRoles(
                resolveRoles(request.getRoles())
        );


        return userRepository.save(user);
    }

    @Override
    public User getStaffById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy nhân viên có ID: " + id
                        )
                );
    }

    @Override
    public List<User> getAllStaff() {
        return userRepository.findAll();
    }

    private Set<Role> resolveRoles(Set<String> strRoles) {

        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {

            Role waiterRole = roleRepository
                    .findByName(ERole.ROLE_WAITER)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Không tìm thấy quyền WAITER."
                            )
                    );

            roles.add(waiterRole);

            return roles;
        }

        strRoles.forEach(role -> {

            switch (role.toLowerCase()) {

                case "admin":
                    roles.add(
                            roleRepository
                                    .findByName(ERole.ROLE_ADMIN)
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Không tìm thấy quyền ADMIN."
                                            )
                                    )
                    );
                    break;

                case "cashier":
                    roles.add(
                            roleRepository
                                    .findByName(ERole.ROLE_CASHIER)
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Không tìm thấy quyền CASHIER."
                                            )
                                    )
                    );
                    break;

                case "chef":
                    roles.add(
                            roleRepository
                                    .findByName(ERole.ROLE_CHEF)
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Không tìm thấy quyền CHEF."
                                            )
                                    )
                    );
                    break;

                case "waiter":
                    roles.add(
                            roleRepository
                                    .findByName(ERole.ROLE_WAITER)
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Không tìm thấy quyền WAITER."
                                            )
                                    )
                    );
                    break;

                default:
                    throw new IllegalArgumentException(
                            "Vai trò không hợp lệ: " + role
                    );
            }
        });

        return roles;
    }
}