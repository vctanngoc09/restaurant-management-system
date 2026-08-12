import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";

import { ADMIN_NAVIGATION } from "../../../../constants/adminNavigation";

import styles from "./AdminSidebar.module.css";

function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div>
        {/* =========================
            SIDEBAR HEADER
        ========================= */}
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLabel}>Trang Quản Lý (Admin)</span>

          <h2>HỦ TIẾU RESTO</h2>
        </div>

        {/* =========================
            NAVIGATION
        ========================= */}
        <nav className={styles.navigation}>
          {ADMIN_NAVIGATION.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                }
              >
                <Icon size={18} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* =========================
          SYSTEM CONFIG
      ========================= */}
      <div className={styles.sidebarFooter}>
        <div className={styles.systemInfo}>
          <Settings size={18} />

          <div>
            <strong>Cấu hình Hệ Thống</strong>

            <span>Thuế VAT 8% • VietQR Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;