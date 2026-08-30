import {
  Check,
  ChevronRight,
  CreditCard,
  Search,
  Square,
  UtensilsCrossed,
} from "lucide-react";

import { useMemo, useState } from "react";

import styles from "./WaiterOrdersView.module.css";

/* ======================================================
   FORMAT DATE
====================================================== */

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

/* ======================================================
   ORDER CODE
====================================================== */

function getOrderCode(orderId) {
  return `DI${String(orderId).padStart(3, "0")}`;
}

/* ======================================================
   COMPONENT
====================================================== */

function WaiterOrdersView({
  orders,

  servingItemId,

  onServeItem,

  onViewDetail,

  onRequestPayment,
}) {
  // ==================================================
  // FILTER STATE
  // ==================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  // ==================================================
  // ACTIVE DINE IN ONLY
  // ==================================================

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.orderType === "dine_in" &&
          order.status !== "completed" &&
          order.status !== "cancelled",
      ),
    [orders],
  );

  // ==================================================
  // FILTER
  // ==================================================

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return activeOrders.filter((order) => {
      // =========================
      // SEARCH
      // =========================

      const matchSearch =
        !keyword ||
        String(order.id).includes(keyword) ||
        String(order.tableNumber || "")
          .toLowerCase()
          .includes(keyword) ||
        order.items.some((item) => item.name?.toLowerCase().includes(keyword));

      if (!matchSearch) {
        return false;
      }

      // =========================
      // ALL
      // =========================

      if (statusFilter === "all") {
        return true;
      }

      // =========================
      // PROCESSING
      // =========================

      if (statusFilter === "processing") {
        return order.status === "pending" || order.status === "cooking";
      }

      // =========================
      // READY
      // =========================

      if (statusFilter === "ready") {
        return order.items.some((item) => item.status === "ready");
      }

      // =========================
      // SERVED
      // =========================

      if (statusFilter === "served") {
        return (
          order.items.length > 0 &&
          order.items.every((item) => item.status === "served")
        );
      }

      // =========================
      // PAYMENT
      // =========================

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

        <h3>Chưa có đơn đang phục vụ</h3>

        <p>Các đơn tại bàn sẽ xuất hiện tại đây.</p>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.orderView}>
      {/* ==================================================
          FILTER CARD
      ================================================== */}

      {/* ==================================================
    COMPACT FILTER BAR
================================================== */}

      <section className={styles.filterCard}>
        {/* ==================================================
      SEARCH
  ================================================== */}

        <div className={styles.searchBox}>
          <Search size={16} />

          <input
            value={search}
            type="text"
            placeholder="Tìm mã đơn, bàn, món ăn..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* ==================================================
      STATUS FILTER
  ================================================== */}

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
            // PAYMENT
            // ==================================================

            const allServed =
              order.items.length > 0 &&
              order.items.every((item) => item.status === "served");

            const waitingPayment = order.status === "pending_payment";

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
                      TOP META
                  ================================================== */}

                <div className={styles.cardTop}>
                  <div className={styles.orderCode}>
                    <span>Order#</span>

                    <strong>{getOrderCode(order.id)}</strong>

                    <i>/</i>

                    <strong>Tại chỗ</strong>
                  </div>

                  <time>{formatDate(order.createdAt)}</time>
                </div>

                <div className={styles.tableInfo}>
                  <div className={styles.tableAvatar}>
                    {String(order.tableNumber || "?")
                      .replace("-", "")
                      .slice(0, 3)}
                  </div>

                  <div className={styles.tableContent}>
                    <span>Bàn phục vụ</span>

                    <strong>Bàn {order.tableNumber}</strong>

                    <small>
                      Phục vụ:{" "}
                      {order.staffName || order.waiterName || "Nhân viên"}
                    </small>
                  </div>

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
                      ITEMS PANEL
                  ================================================== */}

                <div className={styles.itemsPanel}>
                  {/* =========================
                        HEADER
                    ========================= */}

                  <div className={styles.itemHeader}>
                    <span>Món ăn</span>

                    <span>SL</span>

                    <span>Giá</span>
                  </div>

                  {/* =========================
                        SCROLL
                    ========================= */}

                  <div className={styles.itemScroll}>
                    {order.items.map((item) => {
                      const ready = item.status === "ready";

                      const served = item.status === "served";

                      const loading = servingItemId === item.id;

                      const lineTotal = item.price * item.quantity;

                      return (
                        <div
                          key={item.id}
                          className={`${styles.item} ${
                            ready ? styles.readyItem : ""
                          } ${served ? styles.servedItem : ""}`}
                        >
                          {/* =========================
                                  CHECKBOX
                              ========================= */}

                          <button
                            type="button"
                            className={styles.check}
                            disabled={!ready || loading}
                            title={
                              ready
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

                          {/* =========================
                                  NAME
                              ========================= */}

                          <div className={styles.itemName}>
                            <span>{item.name}</span>

                            {item.note && <small>{item.note}</small>}
                          </div>

                          {/* =========================
                                  QUANTITY
                              ========================= */}

                          <strong className={styles.itemQuantity}>
                            {item.quantity}
                          </strong>

                          {/* =========================
                                  PRICE
                              ========================= */}

                          <span className={styles.itemPrice}>
                            {lineTotal.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* ==================================================
                        TOTAL INSIDE PANEL
                    ================================================== */}

                  <div className={styles.total}>
                    <span>Tổng cộng</span>

                    <strong>
                      {order.totalAmount.toLocaleString("vi-VN")}đ
                    </strong>
                  </div>
                </div>

                {/* ==================================================
                      ACTIONS
                  ================================================== */}

                <div className={styles.actions}>
                  {/* =========================
                        DETAIL
                    ========================= */}

                  <button
                    type="button"
                    className={styles.detailButton}
                    onClick={() => onViewDetail(order.id)}
                  >
                    Chi tiết
                  </button>

                  {/* =========================
                        PAYMENT
                    ========================= */}

                  <button
                    type="button"
                    className={styles.paymentButton}
                    disabled={!allServed || waitingPayment}
                    onClick={() => onRequestPayment(order.id)}
                  >
                    <CreditCard size={16} />

                    {waitingPayment ? "Đã yêu cầu" : "Yêu cầu thanh toán"}
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

export default WaiterOrdersView;
