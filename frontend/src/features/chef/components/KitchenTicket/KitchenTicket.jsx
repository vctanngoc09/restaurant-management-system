import {
  Bike,
  Check,
  CheckCircle2,
  Clock,
  Home,
  ShoppingBag,
  Trees,
} from "lucide-react";

import styles from "./KitchenTicket.module.css";

function formatElapsed(seconds = 0) {
  const minutes = Math.floor(seconds / 60);

  const remainSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainSeconds).padStart(
    2,
    "0",
  )}`;
}

function KitchenTicket({
  type,

  order,
  elapsed,

  menuItems,

  onToggleStock,
  onItemAction,
}) {
  const pending = type === "pending";

  const overtime = elapsed > 300;

  const getOrderIcon = () => {
    if (order.orderType === "take_away") {
      return <ShoppingBag size={17} />;
    }

    if (order.orderType === "delivery") {
      return <Bike size={17} />;
    }

    if (order.tableName?.startsWith("N-")) {
      return <Trees size={17} />;
    }

    return <Home size={17} />;
  };

  const getOrderName = () => {
    if (order.orderType === "take_away") {
      return "Mang Về";
    }

    if (order.orderType === "delivery") {
      return "Giao Hàng";
    }

    return `Bàn ${order.tableName || order.tableId}`;
  };

  return (
    <article className={styles.ticket}>
      <div className={styles.ticketHeader}>
        <div className={styles.orderIdentity}>
          <strong>
            {getOrderIcon()}
            {getOrderName()}
          </strong>

          <span>#{order.id}</span>
        </div>

        {pending ? (
          <div
            className={`${styles.timer} ${
              overtime ? styles.timerOvertime : ""
            }`}
          >
            <Clock size={14} />

            <span>{formatElapsed(elapsed)}</span>

            {overtime && <strong>TRỄ</strong>}
          </div>
        ) : (
          <span className={styles.waiter}>
            Phục vụ: <strong>{order.waiterName}</strong>
          </span>
        )}
      </div>

      <div className={styles.items}>
        {order.visibleItems.map((item) => {
          const menuItem = menuItems.find(
            (menu) => menu.id === item.menuItemId || menu.name === item.name,
          );

          const outOfStock = menuItem?.status === "out_of_stock";

          return (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemContent}>
                <span className={styles.quantity}>{item.quantity}x</span>

                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>

                  {item.note && <p>Ghi chú: {item.note}</p>}

                  {pending && outOfStock && (
                    <span className={styles.outOfStockText}>
                      Đã báo hết món với phục vụ
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.itemActions}>
                {pending && (
                  <button
                    type="button"
                    className={`${styles.stockAction} ${
                      outOfStock ? styles.stockActionDisabled : ""
                    }`}
                    onClick={() => {
                      if (menuItem) {
                        onToggleStock(menuItem.id);
                      }
                    }}
                  >
                    {outOfStock ? "Đã Hết" : "Báo Hết"}
                  </button>
                )}

                <button
                  type="button"
                  className={pending ? styles.doneButton : styles.servedButton}
                  onClick={() => onItemAction(order, item)}
                >
                  {pending ? (
                    <>
                      <Check size={17} />
                      Xong
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Đã giao cho phục vụ
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default KitchenTicket;
