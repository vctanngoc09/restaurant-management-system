import { createContext, useState } from "react";

import authService from "../services/authService";
import AuthStorage from "../services/AuthStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Khi F5 trang, lấy lại user đã lưu
  const [user, setUser] = useState(() => {
    const token = AuthStorage.getToken();
    const savedUser = AuthStorage.getUser();

    if (!token || !savedUser) {
      AuthStorage.removeAuth();
      return null;
    }

    return savedUser;
  });

  // ==============================
  // LOGIN
  // ==============================
  const login = async ({ username, password, rememberMe = true }) => {
    const response = await authService.login({
      username,
      password,
    });

    /*
      Response backend của bạn:

      {
        status: 200,
        message: "...",
        data: {
          token: "...",
          type: "Bearer",
          user: {...}
        }
      }
    */

    const token = response?.data?.token;
    const loggedInUser = response?.data?.user;

    if (!token || !loggedInUser) {
      throw new Error("Dữ liệu đăng nhập backend trả về không hợp lệ.");
    }

    // Lưu vào localStorage/sessionStorage
    AuthStorage.setAuth(token, loggedInUser, rememberMe);

    // Cập nhật React state
    setUser(loggedInUser);

    return {
      user: loggedInUser,
      token,
      message: response.message,
    };
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    AuthStorage.removeAuth();
    setUser(null);
  };

  const roles = user?.roles || [];

  const isAuthenticated = !!user && !!AuthStorage.getToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
