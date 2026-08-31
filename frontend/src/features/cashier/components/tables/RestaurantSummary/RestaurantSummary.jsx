import { Bike, Plus, ShoppingBag } from "lucide-react";

import styles from "./RestaurantSummary.module.css";

function RestaurantSummary({
  tables,
  takeawayCount,
  deliveryCount,
  onNewOrder,
}) {
  const occupiedCount = tables.filter(
    (table) => table.status === "occupied",
  ).length;

  const availableCount = tables.filter(
    (table) => table.status === "empty",
  ).length;

  return (
    <aside className={styles.restaurantSummary}>
      <h3>Tổng quan về nhà hàng</h3>

      <div className={styles.summaryTableBox}>
        <div className={styles.summaryTotal}>
          <span>Tổng số bàn</span>
          <strong>{tables.length}</strong>
        </div>

        <div className={styles.summaryNumbers}>
          <div>
            <span>Bàn trống</span>
            <strong>{availableCount}</strong>
          </div>

          <div>
            <span>Đang có khách</span>
            <strong>{occupiedCount}</strong>
          </div>
        </div>
      </div>

      <div className={styles.summaryChannel}>
        <div>
          <ShoppingBag size={17} />
          <span>Mang về</span>
        </div>

        <strong>{takeawayCount}</strong>
      </div>

      <div className={styles.summaryChannel}>
        <div>
          <Bike size={17} />
          <span>Giao hàng</span>
        </div>

        <strong>{deliveryCount}</strong>
      </div>

      <button
        type="button"
        className={styles.summaryCreateButton}
        onClick={onNewOrder}
      >
        <Plus size={18} />
        Tạo đơn hàng mới
      </button>
    </aside>
  );
}

export default RestaurantSummary;
