import { useCallback, useEffect, useMemo, useState } from "react";

import { Edit3, MapPinned, Plus, Save, Trash2, X, XCircle } from "lucide-react";

import { toast } from "react-toastify";

import areaService from "../../../services/areaService";

import styles from "./AreaManagementModal.module.css";

function AreaManagementModal({ open, areas, onClose, onChanged }) {
  // =========================
  // STATE
  // =========================

  const [name, setName] = useState("");

  const [editingAreaId, setEditingAreaId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // SORT AREA
  // =========================

  const sortedAreas = useMemo(() => {
    return [...areas].sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [areas]);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = useCallback(() => {
    setName("");
    setEditingAreaId(null);
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
  // ESC CLOSE MODAL
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

  const handleStartEdit = (area) => {
    setEditingAreaId(area.id);

    setName(area.name);
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

    const normalizedName = name.trim();

    // =========================
    // VALIDATE EMPTY
    // =========================

    if (!normalizedName) {
      toast.error("Vui lòng nhập tên khu vực.");

      return;
    }

    // =========================
    // VALIDATE DUPLICATE
    // =========================

    const duplicatedArea = areas.find(
      (area) =>
        area.id !== editingAreaId &&
        area.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (duplicatedArea) {
      toast.error("Tên khu vực đã tồn tại.");

      return;
    }

    // =========================
    // PAYLOAD
    // =========================

    const payload = {
      name: normalizedName,
    };

    try {
      setSaving(true);

      // =========================
      // UPDATE
      // =========================

      if (editingAreaId) {
        await areaService.update(editingAreaId, payload);

        toast.success(`Cập nhật khu vực "${normalizedName}" thành công!`);
      }

      // =========================
      // CREATE
      // =========================
      else {
        await areaService.create(payload);

        toast.success(`Thêm khu vực "${normalizedName}" thành công!`);
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
          (editingAreaId
            ? "Không thể cập nhật khu vực."
            : "Không thể thêm khu vực."),
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (area) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa khu vực "${area.name}"?\n\nNếu khu vực đang có bàn thì hệ thống có thể không cho phép xóa.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(area.id);

      await areaService.remove(area.id);

      // Nếu đang edit khu vực
      // vừa bị delete
      if (editingAreaId === area.id) {
        resetForm();
      }

      toast.success(`Xóa khu vực "${area.name}" thành công!`);

      await onChanged?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          `Không thể xóa khu vực "${area.name}". Có thể khu vực này đang được bàn sử dụng.`,
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
              <MapPinned size={21} />
            </div>

            <div>
              <h2>Quản Lý Khu Vực</h2>

              <p>Thêm, đổi tên hoặc xóa khu vực bàn ăn.</p>
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
            CREATE / UPDATE FORM
        ========================= */}

        <form className={styles.formSection} onSubmit={handleSubmit}>
          <div className={styles.formHeading}>
            <span>
              {editingAreaId ? "Chỉnh sửa khu vực" : "Thêm khu vực mới"}
            </span>
          </div>

          <div className={styles.formRow}>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="VD: Tầng 1, Tầng 2, Ngoài trời..."
              maxLength={100}
              autoFocus
            />

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {editingAreaId ? <Save size={17} /> : <Plus size={17} />}

              <span>
                {saving
                  ? "Đang lưu..."
                  : editingAreaId
                    ? "Cập Nhật"
                    : "Thêm Khu Vực"}
              </span>
            </button>

            {editingAreaId && (
              <button
                type="button"
                className={styles.cancelEditButton}
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <XCircle size={17} />

                <span>Hủy sửa</span>
              </button>
            )}
          </div>
        </form>

        <div className={styles.divider} />

        {/* =========================
            AREA LIST
        ========================= */}

        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <div>
              <h3>Danh Sách Khu Vực</h3>

              <p>{areas.length} khu vực hiện có</p>
            </div>
          </div>

          {sortedAreas.length === 0 ? (
            // =========================
            // EMPTY
            // =========================

            <div className={styles.emptyState}>
              <MapPinned size={30} />

              <strong>Chưa có khu vực nào</strong>

              <span>Hãy thêm khu vực đầu tiên cho nhà hàng.</span>
            </div>
          ) : (
            // =========================
            // LIST
            // =========================

            <div className={styles.areaList}>
              {sortedAreas.map((area) => {
                const isEditing = editingAreaId === area.id;

                const isDeleting = deletingId === area.id;

                return (
                  <div
                    key={area.id}
                    className={`
                                ${styles.areaItem}
                                ${isEditing ? styles.areaItemEditing : ""}
                              `}
                  >
                    {/* AREA INFO */}

                    <div className={styles.areaInfo}>
                      <div className={styles.areaIcon}>
                        <MapPinned size={17} />
                      </div>

                      <div>
                        <strong>{area.name}</strong>

                        <span>ID: {area.id}</span>
                      </div>
                    </div>

                    {/* ACTION */}

                    <div className={styles.actions}>
                      {/* EDIT */}

                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => handleStartEdit(area)}
                        disabled={saving || isDeleting}
                        title={`Sửa khu vực ${area.name}`}
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleDelete(area)}
                        disabled={saving || isDeleting}
                        title={`Xóa khu vực ${area.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
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

export default AreaManagementModal;
