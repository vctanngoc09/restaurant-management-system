import { Plus, Search } from "lucide-react";

import styles from "./OrderFilters.module.css";
function OrderFilters({
  search,
  onSearchChange,

  typeFilter,
  onTypeFilterChange,

  statusFilter,
  onStatusFilterChange,

  onNewOrder,
}) {
  return (
    <div className={styles.orderFilterCard}>
      <div className={styles.orderSearchRow}>
        <div className={styles.orderSearch}>
          <Search size={16} />

          <input
            type="text"
            value={search}
            placeholder="Tìm kiếm mã đơn, tên khách..."
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={onNewOrder}
        >
          <Plus size={17} />
          Tạo đơn mới
        </button>
      </div>

      <div className={styles.orderFilterBottom}>
        <div className={styles.filterGroup}>
          <button
            type="button"
            className={typeFilter === "all" ? styles.filterActive : ""}
            onClick={() => onTypeFilterChange("all")}
          >
            Tất cả
          </button>

          <button
            type="button"
            className={typeFilter === "dine_in" ? styles.filterActive : ""}
            onClick={() => onTypeFilterChange("dine_in")}
          >
            Tại chỗ
          </button>

          <button
            type="button"
            className={typeFilter === "take_away" ? styles.filterActive : ""}
            onClick={() => onTypeFilterChange("take_away")}
          >
            Mang về
          </button>

          <button
            type="button"
            className={typeFilter === "delivery" ? styles.filterActive : ""}
            onClick={() => onTypeFilterChange("delivery")}
          >
            Giao đi
          </button>
        </div>

        <div className={styles.filterGroup}>
          <button
            type="button"
            className={statusFilter === "all" ? styles.filterActive : ""}
            onClick={() => onStatusFilterChange("all")}
          >
            Tất cả
          </button>

          <button
            type="button"
            className={statusFilter === "processing" ? styles.filterActive : ""}
            onClick={() => onStatusFilterChange("processing")}
          >
            Đang xử lý
          </button>

          <button
            type="button"
            className={
              statusFilter === "pending_payment"
                ? styles.filterPrimaryActive
                : ""
            }
            onClick={() => onStatusFilterChange("pending_payment")}
          >
            Chờ thanh toán
          </button>

          <button
            type="button"
            className={statusFilter === "completed" ? styles.filterActive : ""}
            onClick={() => onStatusFilterChange("completed")}
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderFilters;
