import { Bike, Home, Search, ShoppingBag } from "lucide-react";

import styles from "./KitchenFilters.module.css";

function KitchenFilters({
  tickets,

  orderTypeFilter,
  onOrderTypeChange,

  searchQuery,
  onSearchChange,
}) {
  const dineInCount = tickets.filter(
    (ticket) => ticket.orderType === "dine_in",
  ).length;

  const takeawayCount = tickets.filter(
    (ticket) => ticket.orderType === "take_away",
  ).length;

  const deliveryCount = tickets.filter(
    (ticket) => ticket.orderType === "delivery",
  ).length;

  return (
    <section className={styles.filters}>
      <div className={styles.typeTabs}>
        <button
          type="button"
          className={orderTypeFilter === "all" ? styles.active : ""}
          onClick={() => onOrderTypeChange("all")}
        >
          Tất Cả ({tickets.length})
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
          placeholder="Tìm bàn, mã đơn, món ăn..."
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </section>
  );
}

export default KitchenFilters;
