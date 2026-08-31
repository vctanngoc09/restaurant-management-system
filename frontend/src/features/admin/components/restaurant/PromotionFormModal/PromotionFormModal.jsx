import { CircleDollarSign, X } from "lucide-react";

import styles from "./PromotionFormModal.module.css";

function PromotionFormModal({
  open,

  editingPromotion,

  form,
  saving,

  onChange,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              {editingPromotion ? "CHỈNH SỬA" : "TẠO MỚI"}
            </span>

            <h2>
              {editingPromotion ? "Cập Nhật Mã Giảm Giá" : "Tạo Mã Giảm Giá"}
            </h2>
          </div>

          <button type="button" className={styles.close} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.body}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>
                  Mã giảm giá
                  <b>*</b>
                </span>

                <input
                  name="code"
                  value={form.code}
                  onChange={onChange}
                  placeholder="RESTO10"
                />
              </label>

              <label className={styles.field}>
                <span>
                  Tên chương trình
                  <b>*</b>
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Giảm 10% tháng 9"
                />
              </label>

              <label className={`${styles.field} ${styles.full}`}>
                <span>Mô tả</span>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows="3"
                  placeholder="Mô tả chương trình..."
                />
              </label>

              <label className={styles.field}>
                <span>
                  Loại giảm
                  <b>*</b>
                </span>

                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={onChange}
                >
                  <option value="PERCENT">Giảm theo %</option>

                  <option value="FIXED_AMOUNT">Giảm số tiền cố định</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>
                  Giá trị giảm
                  <b>*</b>
                </span>

                <div className={styles.suffix}>
                  <input
                    type="number"
                    min="0"
                    name="discountValue"
                    value={form.discountValue}
                    onChange={onChange}
                    placeholder={
                      form.discountType === "PERCENT" ? "10" : "30000"
                    }
                  />

                  <span>{form.discountType === "PERCENT" ? "%" : "đ"}</span>
                </div>
              </label>

              <label className={styles.field}>
                <span>Đơn tối thiểu</span>

                <div className={styles.suffix}>
                  <input
                    type="number"
                    min="0"
                    name="minOrderAmount"
                    value={form.minOrderAmount}
                    onChange={onChange}
                  />

                  <span>đ</span>
                </div>
              </label>

              <label className={styles.field}>
                <span>Giảm tối đa</span>

                <div className={styles.suffix}>
                  <input
                    type="number"
                    min="0"
                    name="maxDiscountAmount"
                    value={form.maxDiscountAmount}
                    onChange={onChange}
                    placeholder="Không giới hạn"
                  />

                  <span>đ</span>
                </div>
              </label>

              <label className={styles.field}>
                <span>
                  Bắt đầu
                  <b>*</b>
                </span>

                <input
                  type="datetime-local"
                  name="startAt"
                  value={form.startAt}
                  onChange={onChange}
                />
              </label>

              <label className={styles.field}>
                <span>
                  Kết thúc
                  <b>*</b>
                </span>

                <input
                  type="datetime-local"
                  name="endAt"
                  value={form.endAt}
                  onChange={onChange}
                />
              </label>

              <label className={styles.field}>
                <span>Giới hạn lượt</span>

                <input
                  type="number"
                  min="1"
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={onChange}
                  placeholder="Không giới hạn"
                />
              </label>

              <label className={styles.switchField}>
                <div>
                  <strong>Kích hoạt chương trình</strong>

                  <span>Cho phép sử dụng mã ngay khi đủ điều kiện.</span>
                </div>

                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={onChange}
                />
              </label>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={saving}
            >
              Hủy
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              <CircleDollarSign size={16} />

              {saving
                ? "Đang lưu..."
                : editingPromotion
                  ? "Lưu thay đổi"
                  : "Tạo mã giảm giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PromotionFormModal;
