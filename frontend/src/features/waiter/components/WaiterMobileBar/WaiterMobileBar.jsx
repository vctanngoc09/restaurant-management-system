import { CreditCard, Send } from "lucide-react";

import styles from "./WaiterMobileBar.module.css";

function WaiterMobileBar({
  itemCount,
  totalAmount,

  hasExistingOrder,

  onSend,
  onRequestPayment,
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.total}>
        <span>Tạm tính ({itemCount} món chọn):</span>

        <strong>{totalAmount.toLocaleString("vi-VN")}đ</strong>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.send} onClick={onSend}>
          <Send size={16} />
          Gửi Đơn Xuống Bếp
        </button>

        {hasExistingOrder && (
          <button
            type="button"
            className={styles.payment}
            onClick={onRequestPayment}
          >
            <CreditCard size={16} />
            Thanh Toán
          </button>
        )}
      </div>
    </div>
  );
}

export default WaiterMobileBar;
