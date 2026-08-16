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

  const handleRoleChange = (roleValue) => {
    const currentRoles = form.roles || [];

    const isSelected = currentRoles.includes(roleValue);

    const updatedRoles = isSelected
      ? currentRoles.filter((role) => role !== roleValue)
      : [...currentRoles, roleValue];

    updateField("roles", updatedRoles);
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
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="VD: Trần Văn Minh"
              required
            />
          </div>

          {/* USERNAME */}
          <div className={styles.field}>
            <label>Tên Đăng Nhập</label>

            <input
              type="text"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              placeholder="VD: waiter01"
              minLength={6}
              maxLength={20}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.field}>
            <label>{editingStaff ? "Mật Khẩu Mới" : "Mật Khẩu"}</label>

            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder={
                editingStaff
                  ? "Để trống nếu không đổi mật khẩu"
                  : "Nhập mật khẩu"
              }
              minLength={form.password ? 6 : undefined}
              required={!editingStaff}
            />
          </div>

          {/* PHONE */}
          <div className={styles.field}>
            <label>Số Điện Thoại</label>

            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="0901234567"
              required
            />
          </div>

          {/* ROLES */}
          <div className={styles.field}>
            <label>Vai Trò Hệ Thống</label>

            <p className={styles.roleHint}>
              Một nhân viên có thể được cấp nhiều vai trò
            </p>

            <div className={styles.roleGrid}>
              {STAFF_ROLES.map((role) => {
                const checked = form.roles.includes(role.value);

                return (
                  <label
                    key={role.value}
                    className={`${styles.roleOption} ${
                      checked ? styles.roleOptionSelected : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleRoleChange(role.value)}
                    />

                    <div className={styles.roleContent}>
                      <span className={styles.roleName}>{role.label}</span>

                      <span className={styles.roleEnglish}>
                        {role.englishLabel}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
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
