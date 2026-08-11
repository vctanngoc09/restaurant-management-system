import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyRound, Lock, Soup, User } from "lucide-react";

import useAuth from "../../../../hooks/useAuth";
import authService from "../../../../services/authService";

import styles from "./LoginForm.module.css";

function LoginForm() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    const username = employeeId.trim();

    if (!username || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      // 1. Context gọi Backend + lưu AuthStorage
      const result = await login({
        username,
        password,
        rememberMe,
      });

      console.log("LOGIN USER:", result.user);

      // 2. Xác định trang theo role
      const redirectPath = authService.getHomeRedirectPath(result.user.roles);

      // 3. Không có role hợp lệ
      if (redirectPath === "/login") {
        logout();

        setErrorMsg("Tài khoản chưa được cấp quyền truy cập.");

        return;
      }

      // 4. Success
      toast.success(result.message || "Đăng nhập thành công!");

      // 5. Redirect
      navigate(redirectPath, {
        replace: true, 
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Tên đăng nhập hoặc mật khẩu không chính xác.";

      setErrorMsg(message);

      toast.error("Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();

    alert("Vui lòng liên hệ Admin để khôi phục mật khẩu.");
  };

  return (
    <div className={styles.wrapper}>
      {/* Chỉ xuất hiện khi mobile */}
      <div className={styles.mobileBrand}>
        <div className={styles.mobileLogo}>
          <Soup size={25} />
        </div>

        <div>
          <strong>Hủ Tiếu RESTO</strong>
          <span>POS & Quản lý Nhà Hàng</span>
        </div>
      </div>

      <header className={styles.header}>
        <h2>Đăng Nhập Nhân Viên</h2>

        <p>
          Vui lòng nhập mã nhân viên hoặc tên đăng nhập để truy cập hệ thống.
        </p>
      </header>

      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="employeeId">Mã Nhân Viên / Tên Đăng Nhập</label>

          <div className={styles.inputWrapper}>
            <User size={17} />

            <input
              id="employeeId"
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Nhập mã nhân viên hoặc tên đăng nhập"
              autoComplete="username"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Mã PIN / Mật Khẩu</label>

          <div className={styles.inputWrapper}>
            <KeyRound size={17} />

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mã PIN hoặc mật khẩu"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className={styles.options}>
          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <span>Ghi nhớ đăng nhập</span>
          </label>

          <a href="#forgot" onClick={handleForgotPassword}>
            Quên mã PIN?
          </a>
        </div>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={loading}
        >
          <Lock size={17} />

          {loading ? "Đang đăng nhập..." : "Đăng Nhập Vào Ca"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
