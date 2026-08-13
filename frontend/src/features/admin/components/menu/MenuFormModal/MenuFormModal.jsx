import { X } from "lucide-react";

import { MENU_CATEGORIES } from "../../../../../constants/menuCategories";

import styles from "./MenuFormModal.module.css";

function MenuFormModal({
  open,
  editingItem,
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
        <header className={styles.header}>
          <div>
            <span className={styles.badge}>Quản Lý Thực Đơn</span>

            <h2>{editingItem ? "Sửa Thông Tin Món Ăn" : "Thêm Món Ăn Mới"}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={onSubmit} className={styles.form}>
          {/* NAME */}

          <div className={styles.field}>
            <label>Tên Món Ăn</label>

            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="VD: Hủ Tiếu Nam Vang"
              required
            />
          </div>

          {/* CATEGORY */}

          <div className={styles.field}>
            <label>Danh Mục</label>

            <select
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
            >
              {MENU_CATEGORIES.filter((category) => category.id !== "all").map(
                (category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* PRICE */}

          <div className={styles.field}>
            <label>Đơn Giá (VND)</label>

            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="VD: 55000"
              required
            />
          </div>

          {/* STATUS */}

          <div className={styles.field}>
            <label>Trạng Thái Kho</label>

            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              <option value="in_stock">Còn món / Sẵn sàng</option>

              <option value="out_of_stock">Hết món</option>
            </select>
          </div>

          {/* IMAGE */}

          <div className={styles.field}>
            <label>URL Hình Ảnh</label>

            <input
              type="text"
              value={form.image}
              onChange={(event) => updateField("image", event.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* DESCRIPTION */}

          <div className={styles.field}>
            <label>Mô Tả Ngắn</label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Mô tả thành phần chính..."
            />
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
              {editingItem ? "Cập Nhật Món" : "Lưu Món Mới"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default MenuFormModal;
