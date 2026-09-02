import {
  Check,
  CreditCard,
  Search,
  Square,
  UtensilsCrossed,
} from "lucide-react";

import { useMemo, useState } from "react";

/*
 * Dùng chung stylesheet với Waiter
 * để Cashier giống 100% giao diện Waiter.
 *
 * Sau này muốn tách riêng thì chỉ cần
 * copy file CSS sang folder Cashier.
 */
import styles from "./OrderView.module.css";

// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ==================================================
// ORDER TYPE
// ==================================================

function getOrderTypeLabel(type) {
  switch (type) {
    case "take_away":
      return "Mang về";

    case "delivery":
      return "Giao đi";

    default:
      return "Tại chỗ";
  }
}

// ==================================================
// AVATAR
// ==================================================

function getOrderAvatar(order) {
  if (order.orderType === "take_away") {
    return "MV";
  }

  if (order.orderType === "delivery") {
    return "GH";
  }

  return String(order.tableNumber || "?")
    .replace("-", "")
    .slice(0, 3);
}

// ==================================================
// COMPONENT
// ==================================================

function OrderView({
  orders,
  servingItemId,
  onServeItem,
  onViewDetail,
  onPayment,
}) {
  // ==================================================
  // FILTER
  // ==================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ==================================================
  // ACTIVE ORDERS
  // ==================================================

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status !== "completed" && order.status !== "cancelled",
      ),
    [orders],
  );

  // ==================================================
  // FILTERED
  // ==================================================

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return activeOrders.filter((order) => {
      // ==================================================
      // SEARCH
      // ==================================================

      const matchSearch =
        !keyword ||
        String(order.id).toLowerCase().includes(keyword) ||
        String(order.tableNumber || "")
          .toLowerCase()
          .includes(keyword) ||
        String(order.tableName || "")
          .toLowerCase()
          .includes(keyword) ||
        order.items.some((item) => item.name?.toLowerCase().includes(keyword));

      if (!matchSearch) {
        return false;
      }

      // ==================================================
      // ALL
      // ==================================================

      if (statusFilter === "all") {
        return true;
      }

      // ==================================================
      // PROCESSING
      // ==================================================

      if (statusFilter === "processing") {
        return order.status === "new" || order.status === "cooking";
      }

      // ==================================================
      // READY
      // ==================================================

      if (statusFilter === "ready") {
        return order.items.some((item) => item.status === "ready");
      }

      // ==================================================
      // SERVED
      // ==================================================

      if (statusFilter === "served") {
        return (
          order.items.length > 0 &&
          order.items.every((item) => item.status === "served")
        );
      }

      // ==================================================
      // PAYMENT
      // ==================================================

      if (statusFilter === "pending_payment") {
        return order.status === "pending_payment";
      }

      return true;
    });
  }, [activeOrders, search, statusFilter]);

  // ==================================================
  // EMPTY
  // ==================================================

  if (activeOrders.length === 0) {
    return (
      <div className={styles.empty}>
        <UtensilsCrossed size={38} />

        <h3>Chưa có đơn đang hoạt động</h3>

        <p>Các đơn đang phục vụ sẽ xuất hiện tại đây.</p>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.orderView}>
      {/* ==================================================
          FILTER
      ================================================== */}

      <section className={styles.filterCard}>
        {/* SEARCH */}

        <div className={styles.searchBox}>
          <Search size={16} />

          <input
            value={search}
            type="text"
            placeholder="Tìm mã đơn, bàn, món ăn..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* STATUS */}

        <div className={styles.filterGroup}>
          <button
            type="button"
            className={statusFilter === "all" ? styles.active : ""}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>

          <button
            type="button"
            className={statusFilter === "processing" ? styles.active : ""}
            onClick={() => setStatusFilter("processing")}
          >
            Đang xử lý
          </button>

          <button
            type="button"
            className={statusFilter === "ready" ? styles.readyActive : ""}
            onClick={() => setStatusFilter("ready")}
          >
            Có món sẵn sàng
          </button>

          <button
            type="button"
            className={statusFilter === "served" ? styles.active : ""}
            onClick={() => setStatusFilter("served")}
          >
            Đã phục vụ
          </button>

          <button
            type="button"
            className={statusFilter === "pending_payment" ? styles.active : ""}
            onClick={() => setStatusFilter("pending_payment")}
          >
            Chờ thanh toán
          </button>
        </div>
      </section>

      {/* ==================================================
          ORDER GRID
      ================================================== */}

      {filteredOrders.length > 0 ? (
        <div className={styles.orderGrid}>
          {filteredOrders.map((order) => {
            // ==================================================
            // QUANTITY
            // ==================================================

            const totalQuantity = order.items.reduce(
              (total, item) => total + item.quantity,
              0,
            );

            const servedQuantity = order.items.reduce(
              (total, item) =>
                item.status === "served" ? total + item.quantity : total,
              0,
            );

            const readyCount = order.items.filter(
              (item) => item.status === "ready",
            ).length;

            // ==================================================
            // STATE
            // ==================================================

            const allServed =
              order.items.length > 0 &&
              order.items.every((item) => item.status === "served");

            const waitingPayment = order.status === "pending_payment";

            const isPrepaidOrder =
              order.orderType === "take_away" || order.orderType === "delivery";

            const canPayment =
              order.orderType === "dine_in" &&
              allServed &&
              (order.status === "cooking" || waitingPayment);
            // ==================================================
            // PAYMENT LABEL
            // ==================================================

            let paymentLabel = "Thanh toán";

            if (isPrepaidOrder) {
              paymentLabel = "Đã thanh toán";
            } else if (!allServed) {
              paymentLabel = "Chưa phục vụ xong";
            }

            // ==================================================
            // PROGRESS
            // ==================================================

            const progress =
              totalQuantity > 0
                ? Math.round((servedQuantity / totalQuantity) * 100)
                : 0;

            // ==================================================
            // LABEL
            // ==================================================

            let progressLabel = "Đang phục vụ";

            if (readyCount > 0) {
              progressLabel = `${readyCount} món sẵn sàng`;
            }

            if (allServed) {
              progressLabel = "Đã phục vụ xong";
            }

            if (waitingPayment) {
              progressLabel = "Chờ thanh toán";
            }

            // ==================================================
            // PROGRESS CLASS
            // ==================================================

            const progressClass = waitingPayment
              ? styles.paymentProgress
              : allServed
                ? styles.servedProgress
                : styles.processingProgress;

            return (
              <article key={order.id} className={styles.orderCard}>
                {/* ==================================================
                    TOP
                ================================================== */}

                <div className={styles.cardTop}>
                  <div className={styles.orderCode}>
                    <span>Order#</span>

                    <strong>{String(order.id).replace("#", "")}</strong>

                    <i>/</i>

                    <strong>{getOrderTypeLabel(order.orderType)}</strong>
                  </div>

                  <time>{formatDate(order.createdAt)}</time>
                </div>

                {/* ==================================================
                    TABLE / CHANNEL
                ================================================== */}

                <div className={styles.tableInfo}>
                  <div className={styles.tableAvatar}>
                    {getOrderAvatar(order)}
                  </div>

                  <div className={styles.tableContent}>
                    <span>
                      {order.orderType === "dine_in"
                        ? "Bàn phục vụ"
                        : "Loại đơn"}
                    </span>

                    <strong>
                      {order.orderType === "dine_in"
                        ? `Bàn ${order.tableNumber}`
                        : getOrderTypeLabel(order.orderType)}
                    </strong>

                    <small>
                      Phục vụ:{" "}
                      {order.staffName || order.waiterName || "Thu ngân"}
                    </small>
                  </div>

                  {/* ==================================================
                      PROGRESS
                  ================================================== */}

                  <div className={`${styles.compactProgress} ${progressClass}`}>
                    <div
                      className={styles.miniProgressCircle}
                      style={{
                        "--progress": `${progress}%`,
                      }}
                    >
                      <div>
                        <strong>{progress}%</strong>
                      </div>
                    </div>

                    <div className={styles.compactProgressInfo}>
                      <strong>{progressLabel}</strong>

                      <span>{totalQuantity} món</span>
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    ITEMS
                ================================================== */}

                <div className={styles.itemsPanel}>
                  {/* HEADER */}

                  <div className={styles.itemHeader}>
                    <span>Món ăn</span>
                    <span>SL</span>
                    <span>Giá</span>
                  </div>

                  {/* ITEMS */}

                  <div className={styles.itemScroll}>
                    {order.items.map((item) => {
                      const ready = item.status === "ready";
                      const served = item.status === "served";

                      const loading = servingItemId === item.id;

                      const lineTotal =
                        Number(item.price || 0) * Number(item.quantity || 0);

                      return (
                        <div
                          key={item.id}
                          className={`${styles.item} ${
                            ready ? styles.readyItem : ""
                          } ${served ? styles.servedItem : ""}`}
                        >
                          {/* ==========================================
                              READY -> SERVED
                          ========================================== */}

                          <button
                            type="button"
                            className={styles.check}
                            disabled={!ready || loading}
                            title={
                              loading
                                ? "Đang xác nhận..."
                                : ready
                                  ? "Xác nhận đã phục vụ"
                                  : served
                                    ? "Đã phục vụ"
                                    : "Món chưa sẵn sàng"
                            }
                            onClick={() => onServeItem(item.id)}
                          >
                            {served ? (
                              <Check size={13} />
                            ) : (
                              <Square size={15} />
                            )}
                          </button>

                          {/* NAME */}

                          <div className={styles.itemName}>
                            <span>{item.name}</span>

                            {item.note && <small>{item.note}</small>}
                          </div>

                          {/* QUANTITY */}

                          <strong className={styles.itemQuantity}>
                            {item.quantity}
                          </strong>

                          {/* PRICE */}

                          <span className={styles.itemPrice}>
                            {lineTotal.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* ==================================================
                      TOTAL
                  ================================================== */}

                  <div className={styles.total}>
                    <span>Tổng cộng</span>

                    <strong>
                      {Number(order.totalAmount || 0).toLocaleString("vi-VN")}đ
                    </strong>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.detailButton}
                    onClick={() => onViewDetail(order)}
                  >
                    Chi tiết
                  </button>

                  <button
                    type="button"
                    className={styles.paymentButton}
                    disabled={!canPayment}
                    title={
                      isPrepaidOrder
                        ? "Đơn đã thanh toán trước khi gửi xuống bếp."
                        : !allServed
                          ? "Cần phục vụ tất cả món trước khi thanh toán."
                          : "Thanh toán đơn hàng"
                    }
                    onClick={() => {
                      if (!canPayment) {
                        return;
                      }

                      onPayment(order);
                    }}
                  >
                    <CreditCard size={16} />

                    {paymentLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.noData}>Không tìm thấy đơn hàng phù hợp.</div>
      )}
    </div>
  );
}

export default OrderView;
