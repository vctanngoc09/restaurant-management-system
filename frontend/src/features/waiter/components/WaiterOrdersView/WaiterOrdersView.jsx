import {
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  CreditCard,
  UtensilsCrossed,
} from "lucide-react";

import styles from "./WaiterOrdersView.module.css";

const STATUS = {
  pending: {
    label: "Chờ bếp",

    className: "pending",
  },

  cooking: {
    label: "Đang phục vụ",

    className: "cooking",
  },

  pending_payment: {
    label: "Chờ thanh toán",

    className: "payment",
  },
};

// ==================================================
// FORMAT DATE
// ==================================================

function formatOrderDate(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",

    month: "2-digit",

    hour: "2-digit",

    minute: "2-digit",
  });
}

// ==================================================
// COMPONENT
// ==================================================

function WaiterOrdersView({
  orders,

  servingItemId,

  onServeItem,

  onViewDetail,

  onRequestPayment,
}) {
  // ==================================================
  // ACTIVE DINE IN ONLY
  // ==================================================

  const activeOrders = orders.filter(
    (order) =>
      order.orderType === "dine_in" &&
      order.status !== "completed" &&
      order.status !== "cancelled",
  );

  // ==================================================
  // EMPTY
  // ==================================================

  if (activeOrders.length === 0) {
    return (
      <div className={styles.empty}>
        <UtensilsCrossed size={34} />

        <h3>Chưa có đơn đang phục vụ</h3>

        <p>Các đơn tại bàn đang hoạt động sẽ xuất hiện tại đây.</p>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className={styles.header}>
        <div>
          <h1>Đơn hàng đang phục vụ</h1>

          <p>Theo dõi món ăn, xác nhận phục vụ và yêu cầu thanh toán</p>
        </div>

        <strong>{activeOrders.length} đơn</strong>
      </div>

      {/* ==================================================
          ORDER GRID
      ================================================== */}

      <div className={styles.grid}>
        {activeOrders.map((order) => {
          // ==================================================
          // COUNTS
          // ==================================================

          const totalItemLines = order.items.length;

          const totalQuantity = order.items.reduce(
            (total, item) => total + item.quantity,
            0,
          );

          const readyCount = order.items.filter(
            (item) => item.status === "ready",
          ).length;

          const servedCount = order.items.filter(
            (item) => item.status === "served",
          ).length;

          // ==================================================
          // PAYMENT CONDITION
          //
          // Chỉ được thanh toán khi
          // TẤT CẢ OrderItem = SERVED.
          // ==================================================

          const allServed =
            totalItemLines > 0 &&
            order.items.every((item) => item.status === "served");

          const waitingPayment = order.status === "pending_payment";

          const paymentDisabled = !allServed || waitingPayment;

          // ==================================================
          // PROGRESS
          // ==================================================

          const progress =
            totalItemLines === 0
              ? 0
              : Math.round((servedCount / totalItemLines) * 100);

          // ==================================================
          // STATUS
          // ==================================================

          const orderStatus = STATUS[order.status] || STATUS.cooking;

          const progressLabel = waitingPayment
            ? "Chờ thanh toán"
            : allServed
              ? "Đã phục vụ xong"
              : readyCount > 0
                ? `${readyCount} món sẵn sàng`
                : "Đang phục vụ";

          return (
            <article key={order.id} className={styles.card}>
              {/* ==================================================
                    TOP META
                ================================================== */}

              <div className={styles.topMeta}>
                <div>
                  <span>Order #{order.id}</span>

                  <strong>/</strong>

                  <span>Tại bàn</span>
                </div>

                <time>{formatOrderDate(order.createdAt)}</time>
              </div>

              {/* ==================================================
                    TABLE / STAFF
                ================================================== */}

              <div className={styles.identity}>
                <div className={styles.tableBadge}>
                  {order.tableNumber || "?"}
                </div>

                <div className={styles.identityInfo}>
                  <span>Bàn phục vụ</span>

                  <strong>Bàn {order.tableNumber}</strong>

                  <small>
                    NV: {order.staffName || order.waiterName || "Phục vụ"}
                  </small>
                </div>
              </div>

              {/* ==================================================
                    PROGRESS
                ================================================== */}

              <div className={styles.progressBox}>
                <div className={styles.progressTop}>
                  <div>
                    <strong>{progress}%</strong>

                    <span
                      className={`${styles.orderStatus} ${
                        styles[orderStatus.className]
                      }`}
                    >
                      {progressLabel}
                    </span>
                  </div>

                  <span>
                    {totalQuantity} món
                    <ChevronRight size={13} />
                  </span>
                </div>

                <div className={styles.progressTrack}>
                  <div
                    className={
                      allServed ? styles.progressComplete : styles.progressValue
                    }
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* ==================================================
                    ITEMS BOX
                ================================================== */}

              <div className={styles.orderItemsBox}>
                {/* =========================
                      ITEM HEADER
                  ========================= */}

                <div className={styles.itemsHeader}>
                  <span>Món</span>

                  <span>SL</span>

                  <span>Giá</span>
                </div>

                {/* =========================
                      ITEMS
                  ========================= */}

                <div className={styles.items}>
                  {order.items.map((item) => {
                    const ready = item.status === "ready";

                    const served = item.status === "served";

                    const loading = servingItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`${styles.item} ${
                          ready ? styles.readyItem : ""
                        } ${served ? styles.servedItem : ""}`}
                      >
                        {/* =========================
                                CHECK
                            ========================= */}

                        <button
                          type="button"
                          className={styles.serveCheck}
                          disabled={!ready || loading}
                          title={
                            ready
                              ? "Xác nhận đã phục vụ món"
                              : served
                                ? "Món đã phục vụ"
                                : "Món chưa sẵn sàng"
                          }
                          onClick={() => onServeItem(item.id)}
                        >
                          {served ? <Check size={12} /> : <Circle size={13} />}
                        </button>

                        {/* =========================
                                NAME
                            ========================= */}

                        <div className={styles.itemInfo}>
                          <strong>{item.name}</strong>

                          {item.note && <small>{item.note}</small>}
                        </div>

                        {/* =========================
                                QUANTITY
                            ========================= */}

                        <span className={styles.quantity}>{item.quantity}</span>

                        {/* =========================
                                PRICE
                            ========================= */}

                        <span className={styles.itemPrice}>
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* ==================================================
                      TOTAL
                  ================================================== */}

                <div className={styles.total}>
                  <span>Tổng</span>

                  <strong>{order.totalAmount.toLocaleString("vi-VN")}đ</strong>
                </div>
              </div>

              {/* ==================================================
                    ACTIONS
                ================================================== */}

              <div className={styles.actions}>
                {/* =========================
                      SEE DETAIL
                  ========================= */}

                <button
                  type="button"
                  className={styles.detailButton}
                  onClick={() => onViewDetail(order.id)}
                >
                  Xem chi tiết
                </button>

                {/* =========================
                      REQUEST PAYMENT
                  ========================= */}

                <button
                  type="button"
                  className={`${styles.paymentButton} ${
                    allServed && !waitingPayment ? styles.paymentAvailable : ""
                  }`}
                  disabled={paymentDisabled}
                  onClick={() => onRequestPayment(order.id)}
                >
                  <CreditCard size={14} />

                  {waitingPayment ? "Chờ thanh toán" : "Yêu cầu thanh toán"}
                </button>
              </div>

              {/* ==================================================
                    PAYMENT HINT
                ================================================== */}

              {!allServed && !waitingPayment && (
                <div className={styles.paymentHint}>
                  <Clock3 size={11} />
                  Phục vụ tất cả món để yêu cầu thanh toán
                </div>
              )}

              {allServed && !waitingPayment && (
                <div className={styles.readyPaymentHint}>
                  <CheckCircle2 size={11} />
                  Đơn đã phục vụ xong • Có thể yêu cầu thanh toán
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default WaiterOrdersView;