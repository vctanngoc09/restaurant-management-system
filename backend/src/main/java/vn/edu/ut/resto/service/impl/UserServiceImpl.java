package vn.edu.ut.resto.service.impl;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.ut.resto.dto.request.CreateStaffRequest;
import vn.edu.ut.resto.dto.request.UpdateStaffRequest;
import vn.edu.ut.resto.exception.DuplicateException;
import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;
import vn.edu.ut.resto.mapper.UserMapper;
import vn.edu.ut.resto.model.Role;
import vn.edu.ut.resto.model.User;
import vn.edu.ut.resto.model.enums.ERole;
import vn.edu.ut.resto.model.enums.EUserStatus;
import vn.edu.ut.resto.repository.RoleRepository;
import vn.edu.ut.resto.repository.UserRepository;
import vn.edu.ut.resto.service.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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

    private static final Long DEFAULT_ADMIN_ID = 1L;

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
    public void deactivateStaff(Long id) {

        if (DEFAULT_ADMIN_ID.equals(id)) {
            throw new InvalidOperationException(
                    "Không thể vô hiệu hóa tài khoản quản trị mặc định."
            );
        }

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy nhân viên có ID: " + id
                        )
                );
        if (user.getStatus() == EUserStatus.INACTIVE) {
            throw new InvalidOperationException(
                    "Tài khoản này đã bị vô hiệu hóa."
            );
        }

        user.setStatus(EUserStatus.INACTIVE);

        userRepository.save(user);
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


        if (DEFAULT_ADMIN_ID.equals(id)) {

            boolean hasAdminRole = request
                    .getRoles()
                    .stream()
                    .anyMatch(role ->
                            role.equalsIgnoreCase("admin")
                    );

            if (!hasAdminRole) {
                throw new InvalidOperationException(
                        "Tài khoản quản trị mặc định phải giữ quyền ADMIN."
                );
            }
        }

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
    @Transactional(readOnly = true)
    public Page<User> getAllStaff(
            int page,
            int size
    ) {

        // =========================
        // VALIDATE PAGINATION
        // =========================

        if (page < 0) {
            throw new InvalidOperationException(
                    "Số trang không được nhỏ hơn 0."
            );
        }

        if (size <= 0 || size > 50) {
            throw new InvalidOperationException(
                    "Số lượng nhân viên mỗi trang phải từ 1 đến 50."
            );
        }


        // =========================
        // CREATE PAGEABLE
        // =========================

        Pageable pageable =
                PageRequest.of(page, size);


        // =========================
        // STEP 1
        // GET IDS ONLY
        // =========================

        Page<Long> idPage =
                userRepository.findUserIds(
                        pageable
                );


        if (idPage.isEmpty()) {

            return new PageImpl<>(
                    List.of(),
                    pageable,
                    idPage.getTotalElements()
            );
        }


        List<Long> ids =
                idPage.getContent();


        // =========================
        // STEP 2
        // FETCH FULL USER + ROLE
        // =========================

        List<User> users =
                userRepository
                        .findUsersByIdsWithRoles(ids);


        // =========================
        // PRESERVE ORDER
        // =========================

        Map<Long, User> userMap =
                users.stream()
                        .collect(
                                Collectors.toMap(
                                        User::getId,
                                        Function.identity()
                                )
                        );


        List<User> orderedUsers =
                ids.stream()
                        .map(userMap::get)
                        .filter(user -> user != null)
                        .toList();


        // =========================
        // BUILD PAGE
        // =========================

        return new PageImpl<>(
                orderedUsers,
                pageable,
                idPage.getTotalElements()
        );
    }

    @Override
    public User restoreStaff(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy nhân viên có ID: " + id
                        )
                );

        user.setStatus(EUserStatus.ACTIVE);

        return userRepository.save(user);
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