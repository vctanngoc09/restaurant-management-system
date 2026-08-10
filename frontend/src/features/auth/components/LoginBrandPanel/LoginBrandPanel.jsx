import { ShieldCheck, Soup } from "lucide-react";

import styles from "./LoginBrandPanel.module.css";

function LoginBrandPanel() {
  return (
    <aside className={styles.panel}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.content}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Soup size={28} />
          </div>

          <div>
            <h1>Hủ Tiếu RESTO</h1>
            <p>Hệ thống Quản lý & POS Nhà Hàng</p>
          </div>
        </div>

        <div className={styles.featured}>
          <span>MÓN ĂN NỔI BẬT</span>

          <h2>Hủ Tiếu Nam Vang Gia Truyền</h2>

          <p>
            Nước lèo ngọt thanh từ xương ống, tôm tươi, trứng cút & tóp mỡ giòn
            rụm.
          </p>
        </div>

        <div className={styles.security}>
          <ShieldCheck size={18} />

          <span>Bảo mật vai trò & đồng bộ hóa thời gian thực</span>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>Phiên bản POS v2.4.0</span>
        <span>Hủ Tiếu Nam Vang & Mỹ Tho</span>
      </footer>
    </aside>
  );
}

export default LoginBrandPanel;