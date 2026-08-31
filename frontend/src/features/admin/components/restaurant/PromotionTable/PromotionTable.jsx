import { Clock3, Edit3, Power, PowerOff } from "lucide-react";

import styles from "./PromotionTable.module.css";

// ==================================================
// FORMAT CURRENCY
// ==================================================

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

// ==================================================
// FORMAT DATE TIME
// ==================================================

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ==================================================
// PROMOTION TABLE
// ==================================================

function PromotionTable({ promotions, loading, onEdit, onToggle }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {/* =========================
            HEADER
        ========================= */}

        <thead>
          <tr>
            <th>Mã Giảm Giá</th>

            <th>Chương Trình</th>

            <th>Mức Giảm</th>

            <th>Điều Kiện</th>

            <th>Thời Gian</th>

            <th>Lượt Sử Dụng</th>

            <th>Trạng Thái</th>

            <th className={styles.actionsHeader}>Thao Tác</th>
          </tr>
        </thead>

        {/* =========================
            BODY
        ========================= */}

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className={styles.empty}>
                Đang tải danh sách mã giảm giá...
              </td>
            </tr>
          ) : promotions.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.empty}>
                Không tìm thấy chương trình giảm giá nào phù hợp.
              </td>
            </tr>
          ) : (
            promotions.map((promotion) => (
              <tr key={promotion.id}>
                {/* =========================
                    CODE
                ========================= */}

                <td>
                  <span className={styles.code}>{promotion.code}</span>
                </td>

                {/* =========================
                    PROMOTION
                ========================= */}

                <td>
                  <div className={styles.promotionInfo}>
                    <strong>{promotion.name}</strong>

                    <span>{promotion.description || "Không có mô tả"}</span>
                  </div>
                </td>

                {/* =========================
                    DISCOUNT
                ========================= */}

                <td>
                  <div className={styles.discountInfo}>
                    <strong>
                      {promotion.discountType === "PERCENT"
                        ? `${promotion.discountValue}%`
                        : formatCurrency(promotion.discountValue)}
                    </strong>

                    <span>
                      {promotion.discountType === "PERCENT"
                        ? "Theo phần trăm"
                        : "Giảm cố định"}
                    </span>
                  </div>
                </td>

                {/* =========================
                    CONDITION
                ========================= */}

                <td>
                  <div className={styles.conditionInfo}>
                    <span>
                      Đơn từ{" "}
                      <strong>
                        {formatCurrency(promotion.minOrderAmount)}
                      </strong>
                    </span>

                    {promotion.maxDiscountAmount != null && (
                      <small>
                        Giảm tối đa{" "}
                        {formatCurrency(promotion.maxDiscountAmount)}
                      </small>
                    )}
                  </div>
                </td>

                {/* =========================
                    DATE
                ========================= */}

                <td>
                  <div className={styles.dateInfo}>
                    <Clock3 size={15} />

                    <div>
                      <span>{formatDateTime(promotion.startAt)}</span>

                      <small>đến {formatDateTime(promotion.endAt)}</small>
                    </div>
                  </div>
                </td>

                {/* =========================
                    USAGE
                ========================= */}

                <td>
                  <div className={styles.usageInfo}>
                    <strong>{promotion.usedCount ?? 0}</strong>

                    <span>/ {promotion.usageLimit ?? "∞"} lượt</span>
                  </div>
                </td>

                {/* =========================
                    STATUS
                ========================= */}

                <td>
                  <span
                    className={
                      promotion.active
                        ? styles.activeStatus
                        : styles.inactiveStatus
                    }
                  >
                    {promotion.active ? "Hoạt động" : "Đã tắt"}
                  </span>
                </td>

                {/* =========================
                    ACTION
                ========================= */}

                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.editButton}
                      title={`Sửa ${promotion.code}`}
                      onClick={() => onEdit(promotion.id)}
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      className={
                        promotion.active
                          ? styles.disableButton
                          : styles.enableButton
                      }
                      title={
                        promotion.active
                          ? `Tắt ${promotion.code}`
                          : `Kích hoạt ${promotion.code}`
                      }
                      onClick={() => onToggle(promotion)}
                    >
                      {promotion.active ? (
                        <PowerOff size={16} />
                      ) : (
                        <Power size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PromotionTable;
