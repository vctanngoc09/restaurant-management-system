import styles from "./OrderCard.module.css";

function getOrderTypeLabel(type) {
  switch (type) {
    case "take_away":
      return "MANG VỀ";

    case "delivery":
      return "GIAO ĐI";

    default:
      return "TẠI CHỖ";
  }
}

function OrderCard({ order, onViewDetail, onPayment }) {
  const typeClass =
    order.orderType === "take_away"
      ? styles.orderTypeTakeaway
      : order.orderType === "delivery"
        ? styles.orderTypeDelivery
        : styles.orderTypeDineIn;

  const progressClass =
    order.status === "ready"
      ? styles.progressReady
      : order.status === "pending_payment"
        ? styles.progressPayment
        : styles.progressNormal;

  return (
    <article className={styles.orderCard}>
      <div>
        <div className={styles.orderCardHeader}>
          <div>
            <strong>{order.id}</strong>
            <span>{order.createdAt}</span>
          </div>

          <span className={`${styles.orderTypeBadge} ${typeClass}`}>
            {getOrderTypeLabel(order.orderType)}
          </span>
        </div>

        <div className={styles.orderCustomer}>
          <div className={styles.orderAvatar}>
            {order.tableId ? order.tableId.replace("-", "").slice(0, 3) : "KH"}
          </div>

          <div>
            <strong>
              {order.tableName || order.customerName || "Khách hàng"}
            </strong>

            <span>
              {order.guestCount ? `${order.guestCount} khách • ` : ""}
              Phục vụ: {order.waiterName}
            </span>
          </div>
        </div>

        <div className={styles.orderProgress}>
          <div>
            <strong
              className={order.status === "ready" ? styles.readyText : ""}
            >
              {order.progressLabel}
            </strong>

            <span>{order.items.length} món</span>
          </div>

          <div className={styles.progressTrack}>
            <span
              className={progressClass}
              style={{
                width: `${order.progressPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className={styles.orderItems}>
          <div className={styles.orderItemHeader}>
            <span>MÓN ĂN</span>
            <span>SL</span>
            <span>GIÁ</span>
          </div>

          {order.items.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              <span>
                <i />
                {item.name}
              </span>

              <strong>{item.quantity}</strong>

              <span>{Math.round((item.price * item.quantity) / 1000)}k</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.orderFooter}>
        <div className={styles.orderTotal}>
          <span>TỔNG CỘNG</span>

          <strong>{order.totalAmount.toLocaleString("vi-VN")}đ</strong>
        </div>

        <div className={styles.orderActions}>
          <button type="button" onClick={() => onViewDetail(order)}>
            CHI TIẾT
          </button>

          <button
            type="button"
            className={styles.payButton}
            disabled={order.status === "completed"}
            onClick={() => onPayment(order)}
          >
            {order.status === "completed" ? "ĐÃ THANH TOÁN" : "THANH TOÁN"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default OrderCard;
