import { Bike, Home, Search, ShoppingBag } from "lucide-react";

import styles from "./KitchenFilters.module.css";

function KitchenFilters({
  activeOrders,

  orderTypeFilter,
  onOrderTypeChange,

  searchQuery,
  onSearchChange,
}) {
  const dineInCount = activeOrders.filter(
    (order) => order.orderType === "dine_in",
  ).length;

  const takeawayCount = activeOrders.filter(
    (order) => order.orderType === "take_away",
  ).length;

  const deliveryCount = activeOrders.filter(
    (order) => order.orderType === "delivery",
  ).length;

  return (
    <section className={styles.filters}>
      <div className={styles.typeTabs}>
        <button
          type="button"
          className={orderTypeFilter === "all" ? styles.active : ""}
          onClick={() => onOrderTypeChange("all")}
        >
          Tất Cả ({activeOrders.length})
        </button>

        <button
          type="button"
          className={orderTypeFilter === "dine_in" ? styles.active : ""}
          onClick={() => onOrderTypeChange("dine_in")}
        >
          <Home size={14} />
          Tại Bàn ({dineInCount})
        </button>

        <button
          type="button"
          className={orderTypeFilter === "take_away" ? styles.active : ""}
          onClick={() => onOrderTypeChange("take_away")}
        >
          <ShoppingBag size={14} />
          Mang Về ({takeawayCount})
        </button>

        <button
          type="button"
          className={orderTypeFilter === "delivery" ? styles.active : ""}
          onClick={() => onOrderTypeChange("delivery")}
        >
          <Bike size={14} />
          Giao Hàng ({deliveryCount})
        </button>
      </div>

      <div className={styles.search}>
        <Search size={16} />

        <input
          type="text"
          value={searchQuery}
          placeholder="Tìm theo bàn, món..."
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </section>
  );
}

export default KitchenFilters;
