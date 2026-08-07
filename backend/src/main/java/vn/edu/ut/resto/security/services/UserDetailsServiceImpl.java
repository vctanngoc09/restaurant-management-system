package vn.edu.ut.resto.security.services;

import vn.edu.ut.resto.model.User;
import vn.edu.ut.resto.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // Dùng final, không cần @Autowired vì Spring tự động hiểu khi có 1 Constructor
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Lỗi: Không tìm thấy nhân viên với tài khoản: " + username));

        return UserDetailsImpl.build(user);
    }
}