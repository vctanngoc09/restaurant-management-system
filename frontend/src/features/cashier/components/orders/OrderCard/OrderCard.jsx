import styles from "./OrderCard.module.css";

// ==================================================
// ORDER TYPE LABEL
// ==================================================

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

// ==================================================
// COMPONENT
// ==================================================

function OrderCard({
  order,

  onViewDetail,

  onPayment,
}) {
  // ==================================================
  // TYPE STYLE
  // ==================================================

  const typeClass =
    order.orderType === "take_away"
      ? styles.orderTypeTakeaway
      : order.orderType === "delivery"
        ? styles.orderTypeDelivery
        : styles.orderTypeDineIn;

  // ==================================================
  // PROGRESS STYLE
  // ==================================================

  const progressClass =
    order.status === "pending_payment"
      ? styles.progressPayment
      : order.status === "completed"
        ? styles.progressReady
        : styles.progressNormal;

  // ==================================================
  // AVATAR
  // ==================================================

  const avatarText = order.tableId
    ? String(order.tableNumber || order.tableId)
        .replace("-", "")
        .slice(0, 3)
    : order.orderType === "take_away"
      ? "MV"
      : order.orderType === "delivery"
        ? "GH"
        : "KH";

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <article className={styles.orderCard}>
      <div>
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className={styles.orderCardHeader}>
          <div>
            <strong>{order.id}</strong>

            <span>{order.createdAt}</span>
          </div>

          <span className={`${styles.orderTypeBadge} ${typeClass}`}>
            {getOrderTypeLabel(order.orderType)}
          </span>
        </div>

        {/* ==================================================
            CUSTOMER / TABLE
        ================================================== */}

        <div className={styles.orderCustomer}>
          <div className={styles.orderAvatar}>{avatarText}</div>

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

        {/* ==================================================
            PROGRESS
        ================================================== */}

        <div className={styles.orderProgress}>
          <div>
            <strong
              className={order.status === "completed" ? styles.readyText : ""}
            >
              {order.progressLabel || "Đang xử lý"}
            </strong>

            <span>{order.items?.length || 0} món</span>
          </div>

          <div className={styles.progressTrack}>
            <span
              className={progressClass}
              style={{
                width: `${order.progressPercentage || 0}%`,
              }}
            />
          </div>
        </div>

        {/* ==================================================
            ITEMS
        ================================================== */}

        <div className={styles.orderItems}>
          <div className={styles.orderItemHeader}>
            <span>MÓN ĂN</span>

            <span>SL</span>

            <span>GIÁ</span>
          </div>

          {order.items?.map((item) => (
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

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className={styles.orderFooter}>
        <div className={styles.orderTotal}>
          <span>TỔNG CỘNG</span>

          <strong>
            {Number(order.totalAmount || 0).toLocaleString("vi-VN")}đ
          </strong>
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

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
