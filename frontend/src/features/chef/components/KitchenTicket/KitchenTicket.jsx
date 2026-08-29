import {
  Bike,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Home,
  LoaderCircle,
  Play,
  ShoppingBag,
} from "lucide-react";

import styles from "./KitchenTicket.module.css";

// ==================================================
// TIMER
// ==================================================

function formatElapsed(seconds = 0) {
  const minutes = Math.floor(seconds / 60);

  const remainSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainSeconds).padStart(
    2,
    "0",
  )}`;
}

// ==================================================
// ITEM STATUS
// ==================================================

const ITEM_STATUS = {
  pending: {
    label: "Chờ bắt đầu",

    className: "pendingItemStatus",
  },

  cooking: {
    label: "Đang nấu",

    className: "cookingItemStatus",
  },

  ready: {
    label: "Sẵn sàng",

    className: "readyItemStatus",
  },

  served: {
    label: "Đã phục vụ",

    className: "servedItemStatus",
  },
};

// ==================================================
// COMPONENT
// ==================================================

function KitchenTicket({
  type,

  ticket,

  elapsed,

  actionKey,

  onStartTicket,

  onItemAction,

  onCompleteTicket,
}) {
  const overtime = type !== "ready" && elapsed > 300;

  // ==================================================
  // ORDER ICON
  // ==================================================

  const getOrderIcon = () => {
    if (ticket.orderType === "take_away") {
      return <ShoppingBag size={17} />;
    }

    if (ticket.orderType === "delivery") {
      return <Bike size={17} />;
    }

    return <Home size={17} />;
  };

  // ==================================================
  // ORDER NAME
  // ==================================================

  const getOrderName = () => {
    if (ticket.orderType === "take_away") {
      return "Mang Về";
    }

    if (ticket.orderType === "delivery") {
      return "Giao Hàng";
    }

    return `Bàn ${ticket.tableNumber || ticket.tableId || "-"}`;
  };

  // ==================================================
  // START LOADING
  // ==================================================

  const starting = actionKey === `ticket:${ticket.id}`;
  const completing = actionKey === `complete:${ticket.id}`;

  return (
    <article className={styles.ticket}>
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className={styles.ticketHeader}>
        {/* ==================================================
      ORDER INFO
  ================================================== */}

        <div className={styles.orderIdentity}>
          <strong>
            {getOrderIcon()}

            {getOrderName()}
          </strong>

          <span>
            Order #{ticket.orderId} • Lần {ticket.batchNumber}
          </span>
        </div>

        {/* ==================================================
      RIGHT ACTIONS
  ================================================== */}

        <div className={styles.headerActions}>
          {/* =========================
        TIMER
    ========================= */}

          <div
            className={`${styles.timer} ${
              overtime ? styles.timerOvertime : ""
            }`}
          >
            <Clock size={14} />

            <span>{formatElapsed(elapsed)}</span>

            {overtime && <strong>TRỄ</strong>}
          </div>

          {/* =========================
        WAITING -> PROCESSING
    ========================= */}

          {type === "waiting" && (
            <button
              type="button"
              className={styles.headerStartButton}
              disabled={starting}
              onClick={() => onStartTicket(ticket)}
            >
              {starting ? <LoaderCircle size={13} /> : <Play size={13} />}

              <span>Bắt đầu</span>
            </button>
          )}

          {type === "processing" && (
            <button
              type="button"
              className={styles.completeTicketButton}
              disabled={completing}
              onClick={() => onCompleteTicket(ticket)}
            >
              {completing ? (
                <LoaderCircle size={13} />
              ) : (
                <CheckCircle2 size={13} />
              )}

              <span>Xong tất cả</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================================================
          STAFF
      ================================================== */}

      <div className={styles.ticketMeta}>
        <span>Phiếu #{ticket.id}</span>

        <span>
          Phục vụ: <strong>{ticket.staffName || "Nhân viên"}</strong>
        </span>
      </div>

      {/* ==================================================
          ITEMS
      ================================================== */}

      <div className={styles.items}>
        {ticket.items.map((item) => {
          const status = ITEM_STATUS[item.status] || ITEM_STATUS.pending;

          const cookingKey = `item:${item.id}:COOKING`;

          const readyKey = `item:${item.id}:READY`;

          const itemLoading =
            actionKey === cookingKey || actionKey === readyKey;

          return (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemContent}>
                <span className={styles.quantity}>{item.quantity}x</span>

                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>

                  {item.note && <p>Ghi chú: {item.note}</p>}

                  <span
                    className={`${styles.itemStatus} ${
                      styles[status.className]
                    }`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              {/* ==================================================
                    PROCESSING ACTIONS
                ================================================== */}

              {type === "processing" && (
                <div className={styles.itemActions}>
                  {item.status === "pending" && (
                    <button
                      type="button"
                      className={styles.startItemButton}
                      disabled={itemLoading}
                      onClick={() => onItemAction(item, "COOKING")}
                    >
                      {itemLoading ? (
                        <LoaderCircle size={16} />
                      ) : (
                        <Flame size={16} />
                      )}
                      Bắt đầu món
                    </button>
                  )}

                  {item.status === "cooking" && (
                    <button
                      type="button"
                      className={styles.doneButton}
                      disabled={itemLoading}
                      onClick={() => onItemAction(item, "READY")}
                    >
                      {itemLoading ? (
                        <LoaderCircle size={16} />
                      ) : (
                        <Check size={17} />
                      )}
                      Xong món
                    </button>
                  )}

                  {item.status === "ready" && (
                    <span className={styles.readyText}>
                      <CheckCircle2 size={16} />
                      Sẵn sàng
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ==================================================
          READY
      ================================================== */}

      {type === "ready" && (
        <div className={styles.readyFooter}>
          <CheckCircle2 size={17} />

          <span>Món đã hoàn thành • Chờ nhân viên phục vụ lấy món</span>
        </div>
      )}
    </article>
  );
}

export default KitchenTicket;
