import { useCallback, useEffect, useMemo, useState } from "react";

import { Plus, Save, Tags, X, XCircle } from "lucide-react";

import { toast } from "react-toastify";

import categoryService from "../../../services/categoryService";

import {
  ActionButton,
  ActionGroup,
} from "../../../../../components/common/ActionButton";

import styles from "./CategoryManagementModal.module.css";

function CategoryManagementModal({ open, categories, onClose, onChanged }) {
  // =========================
  // STATE
  // =========================

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // SORT
  // =========================

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [categories]);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = useCallback(() => {
    setName("");

    setDescription("");

    setEditingCategoryId(null);
  }, []);

  // =========================
  // RESET WHEN CLOSE
  // =========================

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  // =========================
  // ESC CLOSE
  // =========================

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // =========================
  // DO NOT RENDER
  // =========================

  if (!open) {
    return null;
  }

  // =========================
  // START EDIT
  // =========================

  const handleStartEdit = (category) => {
    setEditingCategoryId(category.id);

    setName(category.name || "");

    setDescription(category.description || "");
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    resetForm();
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // =========================
    // NORMALIZE
    // =========================

    const normalizedName = name.trim();

    const normalizedDescription = description.trim();

    // =========================
    // VALIDATE NAME
    // =========================

    if (!normalizedName) {
      toast.error("Vui lòng nhập tên danh mục.");

      return;
    }

    // =========================
    // DUPLICATE FRONTEND
    // =========================

    const duplicatedCategory = categories.find(
      (category) =>
        category.id !== editingCategoryId &&
        category.name?.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (duplicatedCategory) {
      toast.error("Tên danh mục đã tồn tại.");

      return;
    }

    // =========================
    // PAYLOAD
    // =========================

    const payload = {
      name: normalizedName,

      description: normalizedDescription || null,
    };

    try {
      setSaving(true);

      // =========================
      // UPDATE
      // =========================

      if (editingCategoryId) {
        await categoryService.update(
          editingCategoryId,

          payload,
        );

        toast.success(`Cập nhật danh mục "${normalizedName}" thành công!`);
      }

      // =========================
      // CREATE
      // =========================
      else {
        await categoryService.create(payload);

        toast.success(`Thêm danh mục "${normalizedName}" thành công!`);
      }

      // =========================
      // RESET
      // =========================

      resetForm();

      // =========================
      // REFRESH PARENT
      // =========================

      await onChanged?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          (editingCategoryId
            ? "Không thể cập nhật danh mục."
            : "Không thể thêm danh mục."),
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa danh mục "${category.name}"?\n\nDanh mục đang có món ăn sẽ không thể xóa.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);

      await categoryService.remove(category.id);

      // Nếu đang sửa đúng category
      // vừa bị xóa
      if (editingCategoryId === category.id) {
        resetForm();
      }

      toast.success(`Xóa danh mục "${category.name}" thành công!`);

      await onChanged?.();
    } catch (error) {
      console.error(error);

      /*
       * Backend của bạn đã xử lý:
       *
       * "Không thể xóa danh mục vì
       * vẫn còn sản phẩm thuộc
       * danh mục này."
       */
      toast.error(
        error.response?.data?.message ||
          `Không thể xóa danh mục "${category.name}".`,
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* =========================
            HEADER
        ========================= */}

        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>
              <Tags size={21} />
            </div>

            <div>
              <h2>Quản Lý Danh Mục</h2>

              <p>Thêm, sửa hoặc xóa danh mục món ăn.</p>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </header>

        {/* =========================
            FORM
        ========================= */}

        <form className={styles.formSection} onSubmit={handleSubmit}>
          <div className={styles.formHeading}>
            {editingCategoryId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </div>

          {/* NAME */}

          <div className={styles.field}>
            <label>Tên danh mục</label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="VD: Món chính, Món kèm, Nước uống..."
              maxLength={100}
              autoFocus
            />
          </div>

          {/* DESCRIPTION */}

          <div className={styles.field}>
            <label>Mô tả danh mục</label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="VD: Các món chính phục vụ trong thực đơn..."
              rows={2}
            />
          </div>

          {/* ACTION */}

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {editingCategoryId ? <Save size={17} /> : <Plus size={17} />}

              <span>
                {saving
                  ? "Đang lưu..."
                  : editingCategoryId
                    ? "Cập Nhật"
                    : "Thêm Danh Mục"}
              </span>
            </button>

            {editingCategoryId && (
              <button
                type="button"
                className={styles.cancelEditButton}
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <XCircle size={17} />
                Hủy sửa
              </button>
            )}
          </div>
        </form>

        <div className={styles.divider} />

        {/* =========================
            LIST
        ========================= */}

        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <div>
              <h3>Danh Sách Danh Mục</h3>

              <p>{categories.length} danh mục hiện có</p>
            </div>
          </div>

          {sortedCategories.length === 0 ? (
            <div className={styles.emptyState}>
              <Tags size={30} />

              <strong>Chưa có danh mục nào</strong>

              <span>Hãy thêm danh mục đầu tiên cho thực đơn.</span>
            </div>
          ) : (
            <div className={styles.categoryList}>
              {sortedCategories.map((category) => {
                const isEditing = editingCategoryId === category.id;

                const isDeleting = deletingId === category.id;

                return (
                  <div
                    key={category.id}
                    className={`
                              ${styles.categoryItem}
                              ${isEditing ? styles.categoryItemEditing : ""}
                            `}
                  >
                    {/* INFO */}

                    <div className={styles.categoryInfo}>
                      <div className={styles.categoryIcon}>
                        <Tags size={17} />
                      </div>

                      <div className={styles.categoryText}>
                        <strong>{category.name}</strong>

                        <span>{category.description || "Chưa có mô tả"}</span>

                        <small>ID: {category.id}</small>
                      </div>
                    </div>

                    {/* ACTION */}

                    <div className={styles.actions}>
                      <ActionGroup>
                        <ActionButton
                          action="edit"
                          title={`Sửa danh mục ${category.name}`}
                          onClick={() => handleStartEdit(category)}
                          disabled={saving || isDeleting}
                        />

                        <ActionButton
                          action="delete"
                          title={`Xóa danh mục ${category.name}`}
                          onClick={() => handleDelete(category)}
                          disabled={saving || isDeleting}
                        />
                      </ActionGroup>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className={styles.footer}>
          <button type="button" className={styles.doneButton} onClick={onClose}>
            Đóng
          </button>
        </footer>
      </section>
    </div>
  );
}

export default CategoryManagementModal;
