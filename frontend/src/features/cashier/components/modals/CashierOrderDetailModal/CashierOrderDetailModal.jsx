import {
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Plus,
  Printer,
  ReceiptText,
  UtensilsCrossed,
  X,
} from "lucide-react";

import styles from "./CashierOrderDetailModal.module.css";

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
      return "Giao hàng";

    default:
      return "Tại chỗ";
  }
}

// ==================================================
// ITEM STATUS
// ==================================================

function getItemStatus(status) {
  switch (status) {
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

    default:
      return {
        label: "Chờ chế biến",
        type: "processing",
      };
  }
}

// ==================================================
// COMPONENT
// ==================================================

function CashierOrderDetailModal({
  open,

  order,

  menuItems = [],

  servingItemId,

  onServeItem,

  onAddItems,

  onPayment,

  onPrintReceipt,

  onClose,
}) {
  if (!open || !order) {
    return null;
  }

  // ==================================================
  // ITEMS
  // ==================================================

  const items = Array.isArray(order.items) ? order.items : [];

  // ==================================================
  // ORDER TYPE
  // ==================================================

  const isDineIn = order.orderType === "dine_in";

  const isPrepaid =
    order.orderType === "take_away" || order.orderType === "delivery";

  // ==================================================
  // PAYMENT STATUS
  // ==================================================

  const waitingPayment = order.status === "pending_payment";

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

  const readyQuantity = items.reduce(
    (total, item) =>
      item.status === "ready" ? total + Number(item.quantity || 0) : total,

    0,
  );

  // ==================================================
  // SERVED
  // ==================================================

  const allServed =
    items.length > 0 && items.every((item) => item.status === "served");

  // ==================================================
  // PROGRESS
  // ==================================================

  const progress =
    totalQuantity > 0 ? Math.round((servedQuantity / totalQuantity) * 100) : 0;

  // ==================================================
  // STATUS LABEL
  // ==================================================

  let progressLabel = "Đang phục vụ";

  let progressType = "processing";

  if (readyQuantity > 0) {
    progressLabel = `${readyQuantity} món sẵn sàng`;
  }

  if (allServed) {
    progressLabel = "Đã phục vụ xong";

    progressType = "served";
  }

  if (waitingPayment) {
    progressLabel = "Chờ thanh toán";

    progressType = "payment";
  }

  // ==================================================
  // ACTION RULE
  //
  // DINE IN:
  //
  // chưa request payment
  // -> Gọi món
  //
  // pending_payment
  // -> Thanh toán
  //
  // TAKE_AWAY / DELIVERY:
  // -> In hóa đơn
  // ==================================================

  const showAddItems =
    isDineIn &&
    !waitingPayment &&
    (order.status === "new" || order.status === "cooking");

  const showPayment =
    isDineIn && allServed && (order.status === "cooking" || waitingPayment);

  const showPrintReceipt = isPrepaid;

  // ==================================================
  // FIND IMAGE
  // ==================================================

  const findProductImage = (productId) => {
    const product = menuItems.find(
      (menuItem) => String(menuItem.id) === String(productId),
    );

    return product?.urlImg || null;
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
            <ReceiptText size={20} />

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

            <strong>{String(order.id).replace("#", "")}</strong>

            <i>/</i>

            <strong>{getOrderTypeLabel(order.orderType)}</strong>
          </div>

          <time>{formatDate(order.createdAt)}</time>
        </div>

        {/* ==================================================
            SUMMARY
        ================================================== */}

        <section className={styles.summary}>
          <div className={styles.orderIdentity}>
            <div className={styles.avatar}>
              {isDineIn
                ? String(order.tableNumber || "?")
                    .replace("-", "")
                    .slice(0, 3)
                : order.orderType === "take_away"
                  ? "MV"
                  : "GH"}
            </div>

            <div className={styles.identityInfo}>
              <span>{isDineIn ? "Bàn phục vụ" : "Loại đơn"}</span>

              <strong>
                {isDineIn
                  ? `Bàn ${order.tableNumber}`
                  : getOrderTypeLabel(order.orderType)}
              </strong>

              <small>
                Phục vụ:{" "}
                <b>{order.staffName || order.waiterName || "Thu ngân"}</b>
              </small>
            </div>
          </div>

          {/* =========================
              PROGRESS
          ========================= */}

          <div
            className={`${styles.progressBox} ${
              progressType === "payment"
                ? styles.paymentProgress
                : progressType === "served"
                  ? styles.servedProgress
                  : styles.processingProgress
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

            <div className={styles.progressInfo}>
              <strong>{progressLabel}</strong>

              <span>{totalQuantity} món</span>
            </div>
          </div>
        </section>

        {/* ==================================================
            ITEMS
        ================================================== */}

        <main className={styles.body}>
          {items.length > 0 ? (
            items.map((item) => {
              const status = getItemStatus(item.status);

              const imageUrl = findProductImage(item.productId);

              const loading = servingItemId === item.id;

              const lineTotal =
                Number(item.price || 0) * Number(item.quantity || 0);

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
                      {status.type === "processing" ? (
                        <Clock3 size={16} />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}

                      <strong>{status.label}</strong>
                    </div>

                    <span>x{item.quantity}</span>
                  </div>

                  {/* =========================
                      CONTENT
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
                        <span className={styles.itemNote}>{item.note}</span>
                      )}

                      <small>
                        {Number(item.price || 0).toLocaleString("vi-VN")}đ / món
                      </small>
                    </div>

                    {/* =========================
                        READY
                    ========================= */}

                    {item.status === "ready" && (
                      <button
                        type="button"
                        className={styles.serveButton}
                        disabled={loading}
                        onClick={() => onServeItem(item.id)}
                      >
                        <Check size={15} />

                        {loading ? "Đang xử lý" : "Phục vụ"}
                      </button>
                    )}

                    {/* =========================
                        SERVED
                    ========================= */}

                    {item.status === "served" && (
                      <span className={styles.servedIcon}>
                        <Check size={17} />
                      </span>
                    )}
                  </div>

                  {/* =========================
                      PRICE
                  ========================= */}

                  <div className={styles.itemBottom}>
                    <strong>{lineTotal.toLocaleString("vi-VN")}đ</strong>

                    <span>x{item.quantity}</span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className={styles.empty}>
              <UtensilsCrossed size={30} />

              <strong>Đơn chưa có món</strong>
            </div>
          )}
        </main>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className={styles.footer}>
          <div className={styles.total}>
            <span>Tổng thanh toán</span>

            <strong>
              {Number(order.totalAmount || 0).toLocaleString("vi-VN")}đ
            </strong>
          </div>

          <div className={styles.actions}>
            {/* ==================================================
                DINE IN - ADD ITEMS
            ================================================== */}

            {showAddItems && (
              <button
                type="button"
                className={styles.addButton}
                onClick={() => onAddItems(order)}
              >
                <Plus size={18} />
                Gọi món
              </button>
            )}

            {/* ==================================================
                DINE IN - PAYMENT
            ================================================== */}

            {showPayment && (
              <button
                type="button"
                className={styles.paymentButton}
                onClick={() => onPayment(order)}
              >
                <CreditCard size={17} />
                Thanh toán
              </button>
            )}

            {/* ==================================================
                TAKE AWAY / DELIVERY
            ================================================== */}

            {showPrintReceipt && (
              <button
                type="button"
                className={styles.printButton}
                onClick={() => onPrintReceipt(order)}
              >
                <Printer size={17} />
                In hóa đơn
              </button>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}

export default CashierOrderDetailModal;
