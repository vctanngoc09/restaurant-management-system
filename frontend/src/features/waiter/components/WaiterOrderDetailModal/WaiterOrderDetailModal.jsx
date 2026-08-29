import { CheckCircle2, Circle, Clock3, MessageSquare, X } from "lucide-react";

import styles from "./WaiterOrderDetailModal.module.css";

function WaiterOrderDetailModal({
  order,

  servingItemId,

  onServeItem,

  onClose,
}) {
  if (!order) {
    return null;
  }

  const readyItems = order.items.filter((item) => item.status === "ready");

  const preparingItems = order.items.filter(
    (item) => item.status === "pending" || item.status === "cooking",
  );

  const servedItems = order.items.filter((item) => item.status === "served");

  const renderItem = (item, allowServe = false) => {
    const loading = servingItemId === item.id;

    return (
      <article key={item.id} className={styles.item}>
        {allowServe ? (
          <button
            type="button"
            className={styles.checkButton}
            disabled={loading}
            onClick={() => onServeItem(item.id)}
          >
            <Circle size={19} />
          </button>
        ) : item.status === "served" ? (
          <CheckCircle2 size={19} className={styles.servedIcon} />
        ) : (
          <Clock3 size={19} className={styles.waitIcon} />
        )}

        <div className={styles.itemInfo}>
          <strong>
            {item.quantity}x {item.name}
          </strong>

          {item.note && (
            <span>
              <MessageSquare size={11} />

              {item.note}
            </span>
          )}
        </div>

        <strong className={styles.price}>
          {(item.price * item.quantity).toLocaleString("vi-VN")}đ
        </strong>
      </article>
    );
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2>Chi tiết Order #{order.id}</h2>

            <p>
              Bàn {order.tableNumber} • Phục vụ: {order.staffName}
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {readyItems.length > 0 && (
            <section>
              <h3 className={styles.readyTitle}>
                Sẵn sàng phục vụ ({readyItems.length})
              </h3>

              {readyItems.map((item) => renderItem(item, true))}
            </section>
          )}

          {preparingItems.length > 0 && (
            <section>
              <h3>Đang chế biến ({preparingItems.length})</h3>

              {preparingItems.map((item) => renderItem(item))}
            </section>
          )}

          {servedItems.length > 0 && (
            <section>
              <h3>Đã phục vụ ({servedItems.length})</h3>

              {servedItems.map((item) => renderItem(item))}
            </section>
          )}
        </div>

        <div className={styles.total}>
          <span>Tổng đơn</span>

          <strong>{order.totalAmount.toLocaleString("vi-VN")}đ</strong>
        </div>
      </section>
    </div>
  );
}

export default WaiterOrderDetailModal;
