import { AlertTriangle, X } from "lucide-react";

import styles from "./OutOfStockModal.module.css";

function OutOfStockModal({
  open,

  menuItems,

  onToggleStock,
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <AlertTriangle size={20} />

            <h2>Quản Lý Báo Hết Món Tức Thời</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.description}>
            Bật hoặc tắt trạng thái phục vụ món ăn. Món được báo hết sẽ không
            còn khả dụng khi nhân viên tạo đơn mới.
          </p>

          <div className={styles.menuList}>
            {menuItems.map((item) => {
              const outOfStock = item.status === "out_of_stock";

              return (
                <div key={item.id} className={styles.menuItem}>
                  <div>
                    <strong>{item.name}</strong>

                    <span>{item.price.toLocaleString("vi-VN")}đ</span>
                  </div>

                  <button
                    type="button"
                    className={
                      outOfStock ? styles.outButton : styles.availableButton
                    }
                    onClick={() => onToggleStock(item.id)}
                  >
                    {outOfStock ? "Đã Hết • Bật lại" : "Sẵn Sàng"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default OutOfStockModal;
