import {
  Check,
  CheckCircle2,
  ChefHat,
  Circle,
  Clock3,
  MessageSquare,
  ReceiptText,
  UtensilsCrossed,
  X,
} from "lucide-react";

import styles from "./WaiterOrderDetailModal.module.css";

function WaiterOrderDetailModal({
  order,

  servingItemId,

  onServeItem,

  onClose,
}) {
  // ==================================================
  // EMPTY
  // ==================================================

  if (!order) {
    return null;
  }

  // ==================================================
  // ITEMS BY STATUS
  // ==================================================

  const readyItems = order.items.filter((item) => item.status === "ready");

  const preparingItems = order.items.filter(
    (item) => item.status === "pending" || item.status === "cooking",
  );

  const servedItems = order.items.filter((item) => item.status === "served");

  // ==================================================
  // QUANTITY SUMMARY
  // ==================================================

  const totalQuantity = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const servedQuantity = servedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const readyQuantity = readyItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const preparingQuantity = preparingItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // ==================================================
  // PROGRESS
  //
  // Dựa theo số lượng món đã phục vụ.
  // ==================================================

  const progress =
    totalQuantity > 0 ? Math.round((servedQuantity / totalQuantity) * 100) : 0;

  const allServed =
    order.items.length > 0 &&
    order.items.every((item) => item.status === "served");

  // ==================================================
  // RENDER ITEM
  // ==================================================

  const renderItem = (item, allowServe = false) => {
    const loading = servingItemId === item.id;

    const lineTotal = item.price * item.quantity;

    return (
      <article
        key={item.id}
        className={`${styles.item} ${allowServe ? styles.readyItem : ""} ${
          item.status === "served" ? styles.servedItem : ""
        }`}
      >
        {/* ==================================================
              STATUS ACTION
          ================================================== */}

        <div className={styles.itemAction}>
          {allowServe ? (
            <button
              type="button"
              className={styles.checkButton}
              disabled={loading}
              title="Xác nhận món đã được phục vụ"
              onClick={() => onServeItem(item.id)}
            >
              {loading ? <Clock3 size={18} /> : <Circle size={18} />}
            </button>
          ) : item.status === "served" ? (
            <span className={styles.servedIcon}>
              <Check size={16} />
            </span>
          ) : (
            <span className={styles.waitIcon}>
              <ChefHat size={17} />
            </span>
          )}
        </div>

        {/* ==================================================
              ITEM INFO
          ================================================== */}

        <div className={styles.itemInfo}>
          <div className={styles.itemNameRow}>
            <strong>{item.name}</strong>

            <span className={styles.quantityBadge}>x{item.quantity}</span>
          </div>

          {item.note && (
            <span className={styles.itemNote}>
              <MessageSquare size={13} />

              {item.note}
            </span>
          )}

          <small>{item.price.toLocaleString("vi-VN")}đ / món</small>
        </div>

        {/* ==================================================
              PRICE
          ================================================== */}

        <strong className={styles.price}>
          {lineTotal.toLocaleString("vi-VN")}đ
        </strong>
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
            <span className={styles.headerIcon}>
              <ReceiptText size={20} />
            </span>

            <div>
              <h2>Chi tiết đơn hàng</h2>

              <p>Order #{order.id}</p>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        {/* ==================================================
            ORDER SUMMARY
        ================================================== */}

        <section className={styles.orderSummary}>
          {/* =========================
              TABLE INFO
          ========================= */}

          <div className={styles.tableInfo}>
            <div className={styles.tableAvatar}>
              {String(order.tableNumber || "?")
                .replace("-", "")
                .slice(0, 3)}
            </div>

            <div>
              <span>Đơn tại chỗ</span>

              <h3>Bàn {order.tableNumber}</h3>

              <p>
                Phục vụ:{" "}
                <strong>
                  {order.staffName || order.waiterName || "Nhân viên"}
                </strong>
              </p>
            </div>
          </div>

          {/* =========================
              PROGRESS
          ========================= */}

          <div className={styles.progressArea}>
            <div
              className={styles.progressCircle}
              style={{
                "--progress": `${progress}%`,
              }}
            >
              <div className={styles.progressInner}>
                <strong>{progress}%</strong>

                <span>phục vụ</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            STATUS SUMMARY
        ================================================== */}

        <div className={styles.statusSummary}>
          <div>
            <span className={styles.processingDot} />

            <div>
              <strong>{preparingQuantity}</strong>

              <span>Đang chế biến</span>
            </div>
          </div>

          <div>
            <span className={styles.readyDot} />

            <div>
              <strong>{readyQuantity}</strong>

              <span>Sẵn sàng</span>
            </div>
          </div>

          <div>
            <span className={styles.servedDot} />

            <div>
              <strong>{servedQuantity}</strong>

              <span>Đã phục vụ</span>
            </div>
          </div>
        </div>

        {/* ==================================================
            BODY
        ================================================== */}

        <div className={styles.body}>
          {/* ==================================================
              READY
          ================================================== */}

          {readyItems.length > 0 && (
            <section className={styles.itemSection}>
              <div className={`${styles.sectionHeader} ${styles.readyHeader}`}>
                <div>
                  <CheckCircle2 size={17} />

                  <strong>Sẵn sàng phục vụ</strong>
                </div>

                <span>{readyQuantity} món</span>
              </div>

              <div className={styles.sectionItems}>
                {readyItems.map((item) => renderItem(item, true))}
              </div>
            </section>
          )}

          {/* ==================================================
              PREPARING
          ================================================== */}

          {preparingItems.length > 0 && (
            <section className={styles.itemSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <ChefHat size={17} />

                  <strong>Đang chế biến</strong>
                </div>

                <span>{preparingQuantity} món</span>
              </div>

              <div className={styles.sectionItems}>
                {preparingItems.map((item) => renderItem(item))}
              </div>
            </section>
          )}

          {/* ==================================================
              SERVED
          ================================================== */}

          {servedItems.length > 0 && (
            <section className={styles.itemSection}>
              <div className={`${styles.sectionHeader} ${styles.servedHeader}`}>
                <div>
                  <CheckCircle2 size={17} />

                  <strong>Đã phục vụ</strong>
                </div>

                <span>{servedQuantity} món</span>
              </div>

              <div className={styles.sectionItems}>
                {servedItems.map((item) => renderItem(item))}
              </div>
            </section>
          )}

          {/* ==================================================
              EMPTY
          ================================================== */}

          {order.items.length === 0 && (
            <div className={styles.empty}>
              <UtensilsCrossed size={28} />

              <span>Đơn chưa có món ăn.</span>
            </div>
          )}
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className={styles.footer}>
          <div className={styles.footerStatus}>
            {allServed ? (
              <>
                <CheckCircle2 size={18} />

                <span>Tất cả món đã được phục vụ</span>
              </>
            ) : (
              <>
                <Clock3 size={18} />

                <span>
                  Còn {totalQuantity - servedQuantity} món chưa phục vụ
                </span>
              </>
            )}
          </div>

          <div className={styles.total}>
            <span>Tổng đơn</span>

            <strong>{order.totalAmount.toLocaleString("vi-VN")}đ</strong>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default WaiterOrderDetailModal;
