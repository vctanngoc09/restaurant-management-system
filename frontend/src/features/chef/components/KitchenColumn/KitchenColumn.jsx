import { CheckCircle2, PackageCheck } from "lucide-react";

import KitchenTicket from "../KitchenTicket/KitchenTicket";

import styles from "./KitchenColumn.module.css";

function KitchenColumn({
  type,
  title,

  itemCount,
  orders,

  timers,

  menuItems,

  onToggleStock,
  onItemAction,
}) {
  const pending = type === "pending";

  return (
    <section className={styles.column}>
      <div className={styles.columnHeader}>
        <h2>
          <span
            className={`${styles.dot} ${
              pending ? styles.pendingDot : styles.readyDot
            }`}
          />
          {title} ({itemCount})
        </h2>

        <span>
          {orders.length} {pending ? "Đơn gọi" : "Đơn ready"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          {pending ? (
            <CheckCircle2 size={34} className={styles.emptySuccess} />
          ) : (
            <PackageCheck size={34} className={styles.emptyIcon} />
          )}

          <h3>{pending ? "Bếp Trống" : "Chưa Có Món Chờ Lấy"}</h3>

          <p>
            {pending
              ? "Tất cả món ăn đã được chế biến hoàn tất!"
              : "Món ăn chế biến xong sẽ xuất hiện tại đây để phục vụ mang tới bàn."}
          </p>
        </div>
      ) : (
        <div className={styles.tickets}>
          {orders.map((order) => (
            <KitchenTicket
              key={order.id}
              type={type}
              order={order}
              elapsed={timers[order.id] || 0}
              menuItems={menuItems}
              onToggleStock={onToggleStock}
              onItemAction={onItemAction}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default KitchenColumn;
