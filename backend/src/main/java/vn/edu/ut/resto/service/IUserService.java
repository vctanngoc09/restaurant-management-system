package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.SignupRequest;
import vn.edu.ut.resto.model.User;

public interface IUserService {
    User registerUser(SignupRequest signUpRequest);
    boolean existsByUsername(String username);
    boolean existsByPhone(String phone);
}
