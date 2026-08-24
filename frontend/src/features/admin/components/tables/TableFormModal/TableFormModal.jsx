import { X } from "lucide-react";

import styles from "./TableFormModal.module.css";

function TableFormModal({
  open,
  editingTable,
  form,
  areas,
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

  const selectedArea = areas.find(
    (area) => String(area.id) === String(form.areaId),
  );

  const isOutdoor = selectedArea?.name?.toLowerCase().includes("ngoài");

  const tablePrefix = isOutdoor ? "N" : "T";

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <header className={styles.header}>
          <div>
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
            <label>Số Bàn</label>

            <input
              type="text"
              value={form.number}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");

                updateField("number", value.slice(0, 3));
              }}
              placeholder="VD: 01"
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
              value={form.areaId}
              onChange={(event) => updateField("areaId", event.target.value)}
              required
            >
              <option value="">-- Chọn khu vực --</option>

              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.preview}>
            <span>Xem trước tên bàn</span>

            <strong>
              {tablePrefix}-{form.number || "--"}
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
