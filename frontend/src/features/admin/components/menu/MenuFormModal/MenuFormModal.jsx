import { X } from "lucide-react";

import styles from "./MenuFormModal.module.css";

function MenuFormModal({
  open,
  editingItem,
  form,
  categories,
  categoriesLoading,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  // =========================
  // UPDATE FIELD
  // =========================

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
        {/* =========================
            HEADER
        ========================= */}

        <header className={styles.header}>
          <div>         
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

        {/* =========================
            FORM
        ========================= */}

        <form onSubmit={onSubmit} className={styles.form}>
          {/* =========================
              NAME
          ========================= */}

          <div className={styles.field}>
            <label>Tên Món Ăn</label>

            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="VD: Hủ Tiếu Nam Vang"
              maxLength={150}
              required
            />
          </div>

          {/* =========================
              CATEGORY
          ========================= */}

          <div className={styles.field}>
            <label>Danh Mục</label>

            <select
              value={form.categoryId}
              onChange={(event) =>
                updateField("categoryId", event.target.value)
              }
              disabled={categoriesLoading}
              required
            >
              <option value="">
                {categoriesLoading
                  ? "Đang tải danh mục..."
                  : "-- Chọn danh mục --"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {!categoriesLoading && categories.length === 0 && (
              <small>Chưa có danh mục món ăn.</small>
            )}
          </div>

          {/* =========================
              PRICE
          ========================= */}

          <div className={styles.field}>
            <label>Đơn Giá (VND)</label>

            <input
              type="number"
              min="1"
              step="1000"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="VD: 55000"
              required
            />
          </div>

          {/* =========================
              IMAGE URL
          ========================= */}

          <div className={styles.field}>
            <label>URL Hình Ảnh</label>

            <input
              type="text"
              value={form.urlImg}
              onChange={(event) => updateField("urlImg", event.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* =========================
              FOOTER
          ========================= */}

          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Hủy
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={categoriesLoading || categories.length === 0}
            >
              {editingItem ? "Cập Nhật Món" : "Lưu Món Mới"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default MenuFormModal;
