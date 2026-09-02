import {
  Check,
  CheckCircle2,
  ChefHat,
  Circle,
  Clock3,
  CreditCard,
  MessageSquare,
  Plus,
  ReceiptText,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { useState } from "react";

import styles from "./WaiterOrderDetailModal.module.css";

// ==================================================
// ORDER CODE
// ==================================================

function getOrderCode(orderId) {
  return `DI${String(orderId).padStart(3, "0")}`;
}

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
// ITEM STATUS
// ==================================================

function getItemStatus(item) {
  switch (item.status) {
    case "served":
      return {
        label: "Đã phục vụ",

        type: "served",
      };

    case "ready":
      return {
        label: "Sẵn sàng phục vụ",

        type: "ready",
      };

    case "cooking":
      return {
        label: "Đang chế biến",

        type: "processing",
      };

    case "pending":
      return {
        label: "Chờ chế biến",

        type: "processing",
      };

    default:
      return {
        label: "Đang xử lý",

        type: "processing",
      };
  }
}

// ==================================================
// COMPONENT
// ==================================================

function WaiterOrderDetailModal({
  order,

  menuItems = [],

  servingItemId,

  onServeItem,

  onAddItems,

  onRequestPayment,

  onClose,
}) {
  const [requestingPayment, setRequestingPayment] = useState(false);

  // ==================================================
  // EMPTY
  // ==================================================

  if (!order) {
    return null;
  }

  // ==================================================
  // ITEMS
  // ==================================================

  const items = Array.isArray(order.items) ? order.items : [];

  // ==================================================
  // QUANTITY
  // ==================================================

  const totalQuantity = items.reduce(
    (total, item) => total + Number(item.quantity || 0),

    0,
  );

  const servedQuantity = items.reduce(
    (total, item) =>
      item.status === "served" ? total + Number(item.quantity || 0) : total,

    0,
  );

  // ==================================================
  // STATE
  // ==================================================

  const allServed =
    items.length > 0 && items.every((item) => item.status === "served");

  const waitingPayment = order.status === "pending_payment";

  const processing = order.status === "cooking";

  // ==================================================
  // BUTTON PERMISSION
  //
  // Chờ thanh toán:
  // -> khóa gọi món
  // -> khóa request payment
  //
  // Chưa chờ thanh toán:
  // -> gọi món được
  //
  // Payment:
  // -> chỉ PROCESSING
  // -> tất cả món SERVED
  // ==================================================

  const canAddItems = !waitingPayment;

  const canRequestPayment = !waitingPayment && processing && allServed;

  // ==================================================
  // PROGRESS
  // ==================================================

  const progress =
    totalQuantity > 0 ? Math.round((servedQuantity / totalQuantity) * 100) : 0;

  // ==================================================
  // MAIN STATUS
  // ==================================================

  let mainStatus = "Đang phục vụ";

  let mainStatusType = "processing";

  if (allServed) {
    mainStatus = "Đã phục vụ";

    mainStatusType = "served";
  }

  if (waitingPayment) {
    mainStatus = "Chờ thanh toán";

    mainStatusType = "payment";
  }

  // ==================================================
  // REQUEST PAYMENT
  // ==================================================

  const handleRequestPayment = async () => {
    if (!canRequestPayment || requestingPayment) {
      return;
    }

    try {
      setRequestingPayment(true);

      await onRequestPayment(order.id);
    } finally {
      setRequestingPayment(false);
    }
  };

  // ==================================================
  // ADD ITEM
  // ==================================================

  const handleAddItems = () => {
    if (!canAddItems) {
      return;
    }

    onAddItems(order);
  };

  // ==================================================
  // RENDER ITEM
  // ==================================================

  const renderItem = (item) => {
    const status = getItemStatus(item);

    const loading = servingItemId === item.id;

    const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);

    const product = menuItems.find(
      (menuItem) => String(menuItem.id) === String(item.productId),
    );

    const imageUrl = product?.urlImg || null;
    return (
      <article key={item.id} className={styles.itemCard}>
        {/* =========================
              STATUS
          ========================= */}

        <div
          className={`${styles.itemStatus} ${
            status.type === "served"
              ? styles.itemStatusServed
              : status.type === "ready"
                ? styles.itemStatusReady
                : styles.itemStatusProcessing
          }`}
        >
          <div>
            {status.type === "served" ? (
              <CheckCircle2 size={17} />
            ) : status.type === "ready" ? (
              <CheckCircle2 size={17} />
            ) : (
              <Clock3 size={17} />
            )}

            <strong>{status.label}</strong>
          </div>

          <span>x{item.quantity}</span>
        </div>

        {/* =========================
              ITEM CONTENT
          ========================= */}

        <div className={styles.itemContent}>
          <div className={styles.itemImage}>
            {imageUrl ? (
              <img src={imageUrl} alt={item.name} />
            ) : (
              <div className={styles.imageFallback}>
                <UtensilsCrossed size={22} />
              </div>
            )}
          </div>

          <div className={styles.itemInfo}>
            <strong>{item.name}</strong>

            {item.note && (
              <span className={styles.itemNote}>
                <MessageSquare size={12} />

                {item.note}
              </span>
            )}

            <small>
              {Number(item.price || 0).toLocaleString("vi-VN")}đ / món
            </small>
          </div>

          {/* =========================
                READY -> SERVE
            ========================= */}

          {item.status === "ready" && (
            <button
              type="button"
              className={styles.serveButton}
              disabled={loading || waitingPayment}
              onClick={() => onServeItem(item.id)}
            >
              {loading ? <Clock3 size={15} /> : <Check size={15} />}

              {loading ? "Đang xử lý" : "Phục vụ"}
            </button>
          )}

          {item.status === "served" && (
            <span className={styles.servedCheck}>
              <Check size={16} />
            </span>
          )}
        </div>

        {/* =========================
              PRICE
          ========================= */}

        <div className={styles.itemPrice}>
          <strong>{lineTotal.toLocaleString("vi-VN")}đ</strong>

          <span>x{item.quantity}</span>
        </div>
      </article>
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <ReceiptText size={19} />

            <h2>Chi tiết đơn hàng</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </header>

        {/* ==================================================
            ORDER META
        ================================================== */}

        <div className={styles.orderMeta}>
          <div>
            <span>Order#</span>

            <strong>{getOrderCode(order.id)}</strong>

            <i>/</i>

            <strong>Tại chỗ</strong>
          </div>

          <time>{formatDate(order.createdAt)}</time>
        </div>

        {/* ==================================================
            TABLE SUMMARY
        ================================================== */}

        <section className={styles.orderSummary}>
          <div className={styles.tableArea}>
            <div className={styles.tableAvatar}>
              {String(order.tableNumber || "?")
                .replace("-", "")
                .slice(0, 3)}
            </div>

            <div className={styles.tableInfo}>
              <span>Bàn phục vụ</span>

              <strong>Bàn {order.tableNumber}</strong>

              <small>
                Phục vụ:{" "}
                <b>{order.staffName || order.waiterName || "Nhân viên"}</b>
              </small>
            </div>
          </div>

          {/* =========================
              MAIN STATUS
          ========================= */}

          <div
            className={`${styles.mainStatus} ${
              mainStatusType === "served"
                ? styles.mainStatusServed
                : mainStatusType === "payment"
                  ? styles.mainStatusPayment
                  : styles.mainStatusProcessing
            }`}
          >
            <div
              className={styles.progressCircle}
              style={{
                "--progress": `${progress}%`,
              }}
            >
              <span>{progress}%</span>
            </div>

            <div>
              <strong>{mainStatus}</strong>

              <span>{totalQuantity} món</span>
            </div>
          </div>
        </section>

        {/* ==================================================
            BODY
        ================================================== */}

        <div className={styles.body}>
          {items.length > 0 ? (
            items.map(renderItem)
          ) : (
            <div className={styles.empty}>
              <UtensilsCrossed size={30} />

              <strong>Đơn chưa có món ăn</strong>
            </div>
          )}
        </div>

        {/* ==================================================
            BOTTOM
        ================================================== */}

        <footer className={styles.footer}>
          {/* =========================
              TOTAL
          ========================= */}

          <div className={styles.totalRow}>
            <span>Tổng thanh toán</span>

            <strong>
              {Number(order.totalAmount || 0).toLocaleString("vi-VN")}đ
            </strong>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className={styles.actions}>
            {/* =========================
                ADD ITEMS
            ========================= */}

            <button
              type="button"
              className={styles.addButton}
              disabled={!canAddItems}
              onClick={handleAddItems}
            >
              <Plus size={18} />
              Gọi món
            </button>

            {/* =========================
                PAYMENT
            ========================= */}

            <button
              type="button"
              className={styles.paymentButton}
              disabled={!canRequestPayment || requestingPayment}
              onClick={handleRequestPayment}
            >
              <CreditCard size={17} />

              {requestingPayment
                ? "Đang gửi..."
                : waitingPayment
                  ? "Đã yêu cầu thanh toán"
                  : "Yêu cầu thanh toán"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default WaiterOrderDetailModal;
