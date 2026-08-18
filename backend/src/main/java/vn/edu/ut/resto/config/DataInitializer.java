package vn.edu.ut.resto.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.edu.ut.resto.model.Role;
import vn.edu.ut.resto.model.User;
import vn.edu.ut.resto.model.enums.ERole;
import vn.edu.ut.resto.repository.RoleRepository;
import vn.edu.ut.resto.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository,
                                      UserRepository userRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {

            // 1. Tự động quét và thêm tất cả các Role có trong Enum nếu chưa tồn tại
            for (ERole eRole : ERole.values()) {
                if (roleRepository.findByName(eRole).isEmpty()) {
                    Role role = new Role();
                    role.setName(eRole);
                    roleRepository.save(role);
                    System.out.println("Đã khởi tạo quyền vào CSDL: " + eRole.name());
                }
            }

            // 2. Tạo tài khoản Chủ nhà hàng (Admin) mặc định nếu chưa có
            if (!userRepository.existsByUsername("admin")) {

                // Tìm quyền ADMIN vừa được tạo ở bước trên
                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy quyền ADMIN"));

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                // Tạo mới tài khoản Admin với mật khẩu mặc định là 123456
                User admin = new User(
                        "admin",
                        passwordEncoder.encode("123456"),
                        "Quản lý nhà hàng",
                        "0999999993" // Số điện thoại giả định
                );
                admin.setRoles(roles);

                userRepository.save(admin);
                System.out.println("Đã tạo tài khoản Admin mặc định: Username: admin | Password: 123456");
            }
        };
    }
}