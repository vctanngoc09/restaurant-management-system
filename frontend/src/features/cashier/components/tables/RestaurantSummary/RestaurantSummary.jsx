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
      <h3>Restaurant Summary</h3>

      <div className={styles.summaryTableBox}>
        <div className={styles.summaryTotal}>
          <span>Total Tables</span>
          <strong>{tables.length}</strong>
        </div>

        <div className={styles.summaryNumbers}>
          <div>
            <span>AVAILABLE</span>
            <strong>{availableCount}</strong>
          </div>

          <div>
            <span>OCCUPIED</span>
            <strong>{occupiedCount}</strong>
          </div>
        </div>
      </div>

      <div className={styles.summaryChannel}>
        <div>
          <ShoppingBag size={17} />
          <span>Take Away</span>
        </div>

        <strong>{takeawayCount}</strong>
      </div>

      <div className={styles.summaryChannel}>
        <div>
          <Bike size={17} />
          <span>Delivery</span>
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
