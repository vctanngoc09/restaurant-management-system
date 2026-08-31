import { Save } from "lucide-react";

import styles from "./RestaurantSettingPanel.module.css";

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN");
}

function RestaurantSettingPanel({
  setting,
  form,
  loading,
  saving,
  onChange,
  onSubmit,
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>CẤU HÌNH</span>

          <h2>Thông Tin Nhà Hàng</h2>

          <p>
            Thông tin này được sử dụng trên hóa đơn và để tính thuế VAT khi
            thanh toán.
          </p>
        </div>

        <div className={setting ? styles.configured : styles.pending}>
          {setting ? "Đã cấu hình" : "Chưa cấu hình"}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Đang tải thông tin nhà hàng...</div>
      ) : (
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>
                Tên nhà hàng
                <b>*</b>
              </span>

              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Hủ Tiếu RESTO"
              />
            </label>

            <label className={styles.field}>
              <span>Số điện thoại</span>

              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="0909 123 456"
              />
            </label>

            <label className={styles.field}>
              <span>Mã số thuế</span>

              <input
                name="taxCode"
                value={form.taxCode}
                onChange={onChange}
                placeholder="0312345678"
              />
            </label>

            <label className={styles.field}>
              <span>
                Thuế VAT (%)
                <b>*</b>
              </span>

              <div className={styles.inputSuffix}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  name="vatRate"
                  value={form.vatRate}
                  onChange={onChange}
                />

                <span>%</span>
              </div>
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span>Địa chỉ</span>

              <input
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="123 Võ Văn Ngân, TP. Thủ Đức, TP.HCM"
              />
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span>Logo URL</span>

              <input
                name="logoUrl"
                value={form.logoUrl}
                onChange={onChange}
                placeholder="https://..."
              />
            </label>
          </div>

          <div className={styles.footer}>
            <span>
              {setting?.updatedAt
                ? `Cập nhật gần nhất: ${formatDateTime(setting.updatedAt)}`
                : "Chưa có dữ liệu cấu hình"}
            </span>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              <Save size={16} />

              {saving
                ? "Đang lưu..."
                : setting?.id
                  ? "Lưu thay đổi"
                  : "Tạo cấu hình"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default RestaurantSettingPanel;
