import { X } from "lucide-react";

import styles from "./ExpenseFormModal.module.css";

function ExpenseFormModal({
  open,
  editingExpense,
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
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>
            {editingExpense ? "Sửa Khoản Chi Phí" : "+ Thêm Khoản Chi Phí Mới"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
          >
            <X size={20} />
          </button>
        </header>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <label>Ngày Chi</label>

            <input
              type="text"
              placeholder="07/08/2026"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Hạng Mục Chi Phí</label>

            <select
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
            >
              <option value="Nhập nguyên liệu thịt">
                Nhập nguyên liệu thịt & tôm
              </option>

              <option value="Rau tươi & gia vị">
                Rau tươi & gia vị, bánh hủ tiếu
              </option>

              <option value="Thanh toán tiền điện">
                Thanh toán tiền điện / nước EVN
              </option>

              <option value="Trả lương NV">
                Trả lương / tạm ứng nhân viên
              </option>

              <option value="Sửa chữa thiết bị">
                Sửa chữa máy POS / thiết bị bếp
              </option>

              <option value="Chi phí khác">Chi phí vận hành khác</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Người Chi (Phê Duyệt)</label>

            <input
              type="text"
              value={form.spender}
              onChange={(event) => updateField("spender", event.target.value)}
              placeholder="VD: Nguyễn Văn An (Quản lý)"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Số Tiền (VND / đ)</label>

            <input
              type="number"
              min="1"
              value={form.amount}
              onChange={(event) =>
                updateField("amount", Number(event.target.value))
              }
              placeholder="VD: 1200000"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Ghi Chú Chi Tiết</label>

            <textarea
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              placeholder="Nhập ghi chú hoặc hóa đơn kèm theo..."
            />
          </div>

          <footer className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Hủy Bỏ
            </button>

            <button type="submit" className={styles.saveButton}>
              {editingExpense ? "Cập Nhật" : "Lưu Khoản Chi"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default ExpenseFormModal;
