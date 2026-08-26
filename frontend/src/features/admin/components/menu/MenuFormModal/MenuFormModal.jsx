import { useEffect, useState } from "react";

import { ImageIcon, Trash2, Upload, X } from "lucide-react";

import { toast } from "react-toastify";

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
  const [previewUrl, setPreviewUrl] = useState(null);

  // =========================
  // IMAGE PREVIEW
  // =========================

  useEffect(() => {
    /*
     * User chọn ảnh mới.
     */
    if (form.image instanceof File) {
      const objectUrl = URL.createObjectURL(form.image);

      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    /*
     * User yêu cầu xóa ảnh hiện tại.
     */
    if (form.removeImage) {
      setPreviewUrl(null);

      return undefined;
    }

    /*
     * Edit Product:
     * hiển thị ảnh hiện tại từ Cloudinary.
     */
    if (editingItem?.urlImg) {
      setPreviewUrl(editingItem.urlImg);

      return undefined;
    }

    /*
     * Product chưa có ảnh.
     */
    setPreviewUrl(null);

    return undefined;
  }, [form.image, form.removeImage, editingItem?.urlImg]);

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

  // =========================
  // SELECT IMAGE
  // =========================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // =========================
    // MAX 5MB
    // =========================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Dung lượng hình ảnh không được vượt quá 5MB.");

      event.target.value = "";

      return;
    }

    // =========================
    // FILE TYPE
    // =========================

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ ảnh JPG, JPEG, PNG hoặc WEBP.");

      event.target.value = "";

      return;
    }

    /*
     * Có ảnh mới
     * → không còn yêu cầu xóa ảnh.
     */
    onChange({
      ...form,

      image: file,

      removeImage: false,
    });
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const handleRemoveImage = () => {
    /*
     * CREATE:
     * chỉ cần bỏ file vừa chọn.
     */
    if (!editingItem) {
      onChange({
        ...form,

        image: null,

        removeImage: false,
      });

      return;
    }

    /*
     * UPDATE:
     *
     * Nếu Product đang có ảnh
     * thì báo Backend xóa Cloudinary.
     */
    onChange({
      ...form,

      image: null,

      removeImage: Boolean(editingItem.urlImg),
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
              placeholder={"VD: Hủ Tiếu Nam Vang"}
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
              min="1000"
              step="1000"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder={"VD: 55000"}
              required
            />
          </div>

          {/* =========================
              IMAGE
          ========================= */}

          <div className={styles.field}>
            <label>Hình Ảnh Món Ăn</label>

            <div className={styles.imageUpload}>
              {/* PREVIEW */}

              <div className={styles.imagePreview}>
                {previewUrl ? (
                  <img src={previewUrl} alt={form.name || "Ảnh món ăn"} />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <ImageIcon size={32} />

                    <span>Chưa có hình ảnh</span>
                  </div>
                )}
              </div>

              {/* ACTION */}

              <div className={styles.imageActions}>
                <label className={styles.uploadButton}>
                  <Upload size={17} />

                  {previewUrl ? "Chọn Ảnh Khác" : "Chọn Hình Ảnh"}

                  <input
                    type="file"
                    accept={
                      ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    }
                    onChange={handleImageChange}
                    hidden
                  />
                </label>

                {previewUrl && (
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={handleRemoveImage}
                  >
                    <Trash2 size={17} />
                    Xóa Ảnh
                  </button>
                )}
              </div>

              {form.image ? (
                <small>
                  Ảnh đã chọn: <strong>{form.image.name}</strong>
                </small>
              ) : editingItem?.urlImg && !form.removeImage ? (
                <small>Đang sử dụng hình ảnh hiện tại.</small>
              ) : (
                <small>Hỗ trợ JPG, JPEG, PNG, WEBP. Tối đa 5MB.</small>
              )}
            </div>
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
