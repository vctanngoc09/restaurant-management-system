import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChefHat,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Smartphone,
  Soup,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../../hooks/useAuth";
import { ROLES } from "../../../constants/roles";

import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, roles, logout } = useAuth();

  const [timeStr, setTimeStr] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // =============================
  // CLOCK
  // =============================
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTimeStr(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // =============================
  // ROLE NAVIGATION
  // =============================
  const roleNavigation = useMemo(
    () => [
      {
        role: ROLES.CASHIER,
        label: "Thu Ngân",
        path: "/cashier",
        icon: CreditCard,
      },
      {
        role: ROLES.CHEF,
        label: "Bếp (KDS)",
        path: "/chef",
        icon: ChefHat,
      },
      {
        role: ROLES.WAITER,
        label: "Phục Vụ (POS)",
        path: "/waiter",
        icon: Smartphone,
      },
      {
        role: ROLES.ADMIN,
        label: "Admin Quản Lý",
        path: "/admin",
        icon: LayoutDashboard,
      },
    ],
    [],
  );

  /*
   * Chỉ hiển thị các khu vực mà tài khoản
   * hiện tại thực sự có quyền.
   */
  const availableNavigation = roleNavigation.filter((item) =>
    roles.includes(item.role),
  );

  // =============================
  // USER INFORMATION
  // =============================
  const displayName = user?.fullName || user?.username || "Nhân viên";

  const avatarLetter = displayName.trim().charAt(0).toUpperCase();

  // =============================
  // LOGOUT
  // =============================
  const handleLogout = () => {
    logout();

    setShowProfileMenu(false);

    toast.success("Đăng xuất thành công!");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className={styles.header}>
      {/* ================= LEFT ================= */}
      <div className={styles.leftSection}>
        {/* BRAND */}
        <button
          className={styles.brand}
          onClick={() => navigate("/")}
          type="button"
        >
          <div className={styles.logo}>
            <Soup size={21} />
          </div>

          <span className={styles.brandName}>Hủ Tiếu</span>

          <span className={styles.brandBadge}>RESTO POS</span>
        </button>

        {/* ROLE NAVIGATION */}
        <nav className={styles.roleNavigation}>
          {availableNavigation.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <button
                key={item.role}
                type="button"
                className={`${styles.roleButton} ${
                  active ? styles.roleButtonActive : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={16} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ================= RIGHT ================= */}
      <div className={styles.rightSection}>
        {/* SOUND */}
        <button
          type="button"
          className={styles.iconButton}
          title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          onClick={() => setSoundEnabled((prev) => !prev)}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* NOTIFICATION */}
        <button
          type="button"
          className={`${styles.iconButton} ${styles.notificationButton}`}
        >
          <Bell size={18} />

          <span className={styles.notificationDot} />
        </button>

        {/* CLOCK */}
        <div className={styles.clock}>{timeStr}</div>

        {/* PROFILE */}
        <div className={styles.profileWrapper}>
          <button
            type="button"
            className={styles.profileButton}
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            <div className={styles.avatar}>{avatarLetter}</div>

            <span className={styles.profileName}>NV: {displayName}</span>

            <ChevronDown
              size={14}
              className={showProfileMenu ? styles.chevronOpen : ""}
            />
          </button>

          {/* PROFILE DROPDOWN */}
          {showProfileMenu && (
            <div className={styles.profileMenu}>
              <div className={styles.profileInfo}>
                <strong>{displayName}</strong>

                <span>@{user?.username || "staff"}</span>
              </div>

              <div className={styles.roleInfo}>
                <span>Vai trò</span>

                <div className={styles.roleBadges}>
                  {roles.map((role) => (
                    <span key={role} className={styles.roleBadge}>
                      {role.replace("ROLE_", "")}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.menuDivider} />

              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <LogOut size={16} />

                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
