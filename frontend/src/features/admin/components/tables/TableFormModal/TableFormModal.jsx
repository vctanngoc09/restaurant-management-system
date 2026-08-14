import { X } from "lucide-react";

import { TABLE_AREA } from "../../../../../constants/tableConfig";

import styles from "./TableFormModal.module.css";

function TableFormModal({
  open,
  editingTable,
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

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <header className={styles.header}>
          <div>
            <span className={styles.badge}>Quản Lý Bàn Ăn</span>

            <h2>{editingTable ? "Sửa Bàn Ăn" : "Thêm Bàn Ăn Mới"}</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        {/* FORM */}

        <form className={styles.form} onSubmit={onSubmit}>
          {/* NUMBER */}

          <div className={styles.field}>
            <label>Số Bàn (Tên Bàn)</label>

            <input
              type="text"
              value={form.number}
              onChange={(event) => updateField("number", event.target.value)}
              placeholder="VD: 09"
              maxLength={3}
              className={styles.numberInput}
              required
            />

            <small>Chỉ cần nhập số, ví dụ: 01, 02, 03...</small>
          </div>

          {/* AREA */}

          <div className={styles.field}>
            <label>Khu Vực Bàn</label>

            <select
              value={form.area}
              onChange={(event) => updateField("area", event.target.value)}
            >
              <option value={TABLE_AREA.INDOOR}>Trong Nhà (Indoor)</option>

              <option value={TABLE_AREA.OUTDOOR}>Ngoài Trời (Outdoor)</option>
            </select>
          </div>

          <div className={styles.preview}>
            <span>Xem trước tên bàn</span>

            <strong>
              {form.area === TABLE_AREA.OUTDOOR
                ? `N-${form.number || "--"}`
                : `T-${form.number || "--"}`}
            </strong>
          </div>

          {/* FOOTER */}

          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Hủy
            </button>

            <button type="submit" className={styles.saveButton}>
              {editingTable ? "Cập Nhật Bàn" : "Lưu Bàn"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default TableFormModal;
