import { X } from "lucide-react";

import { STAFF_ROLES } from "../../../../../constants/staffRoles";

import styles from "./StaffFormModal.module.css";

function StaffFormModal({
  open,
  editingStaff,
  form,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  const updateField = (field, value) => {
    onChange({
      ...form,
      [field]: value,
    });
  };

  const handlePinChange = (event) => {
    /*
      Chỉ cho phép nhập số.
    */
    const value = event.target.value.replace(/\D/g, "");

    updateField("pin", value.slice(0, 4));
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <span className={styles.badge}>Quản Lý Nhân Viên</span>

            <h2>{editingStaff ? "Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form className={styles.form} onSubmit={onSubmit}>
          {/* FULL NAME */}
          <div className={styles.field}>
            <label>Họ Tên Nhân Viên</label>

            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="VD: Trần Văn Minh"
              required
            />
          </div>

          {/* ROLE */}
          <div className={styles.field}>
            <label>Vai Trò / Vai Trò Hệ Thống</label>

            <select
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
            >
              {STAFF_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                  {" ("}
                  {role.englishLabel}
                  {")"}
                </option>
              ))}
            </select>
          </div>

          {/* PIN */}
          <div className={styles.field}>
            <label>Mã PIN Đăng Nhập (4 số)</label>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={form.pin}
              onChange={handlePinChange}
              placeholder="1234"
              className={styles.pinInput}
              required
            />
          </div>

          {/* SHIFT */}
          <div className={styles.field}>
            <label>Ca Trực</label>

            <select
              value={form.shift}
              onChange={(event) => updateField("shift", event.target.value)}
            >
              <option value="Ca Sáng (06:00 - 14:00)">
                Ca Sáng (06:00 - 14:00)
              </option>

              <option value="Ca Chiều (14:00 - 22:00)">
                Ca Chiều (14:00 - 22:00)
              </option>

              <option value="Ca Hành Chính (08:00 - 17:00)">
                Ca Hành Chính (08:00 - 17:00)
              </option>

              <option value="Ca Cả Ngày">Ca Cả Ngày</option>
            </select>
          </div>

          {/* PHONE */}
          <div className={styles.field}>
            <label>Số Điện Thoại</label>

            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="0901234567"
            />
          </div>

          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Hủy
            </button>

            <button type="submit" className={styles.saveButton}>
              {editingStaff ? "Cập Nhật" : "Thêm Nhân Viên"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default StaffFormModal;
