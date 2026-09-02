import { Bike, ShoppingBag } from "lucide-react";

import styles from "./RestaurantSummary.module.css";

function RestaurantSummary({
  tables,
  takeawayCount,
  deliveryCount,
  onQuickChannelClick,
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

      {/* ==================================================
          TABLE SUMMARY
      ================================================== */}

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

      {/* ==================================================
          TAKE AWAY
      ================================================== */}

      <button
        type="button"
        className={styles.summaryChannel}
        onClick={() => onQuickChannelClick("take_away")}
      >
        <div>
          <ShoppingBag size={17} />

          <span>Mang về</span>
        </div>

        <strong>{takeawayCount}</strong>
      </button>

      {/* ==================================================
          DELIVERY
      ================================================== */}

      <button
        type="button"
        className={styles.summaryChannel}
        onClick={() => onQuickChannelClick("delivery")}
      >
        <div>
          <Bike size={17} />

          <span>Giao hàng</span>
        </div>

        <strong>{deliveryCount}</strong>
      </button>
    </aside>
  );
}

export default RestaurantSummary;
