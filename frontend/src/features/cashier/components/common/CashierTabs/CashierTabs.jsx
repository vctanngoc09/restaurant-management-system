import { Plus } from "lucide-react";

import styles from "./CashierTabs.module.css";

function CashierTabs({
  activeTab,
  onTabChange,
  tableCount,
  orderCount,
  onNewOrder,
}) {
  return (
    <div className={styles.cashierTabs}>
      <div className={styles.cashierTabsLeft}>
        <button
          type="button"
          className={`${styles.cashierTab} ${
            activeTab === "tables" ? styles.cashierTabActive : ""
          }`}
          onClick={() => onTabChange("tables")}
        >
          <span>Phòng Bàn</span>

          <span className={styles.tabCount}>{tableCount}</span>
        </button>

        <button
          type="button"
          className={`${styles.cashierTab} ${
            activeTab === "orders" ? styles.cashierTabActive : ""
          }`}
          onClick={() => onTabChange("orders")}
        >
          <span>Đơn Hàng</span>

          <span className={styles.tabCount}>{orderCount}</span>
        </button>
      </div>

      <button
        type="button"
        className={styles.primaryButton}
        onClick={onNewOrder}
      >
        <Plus size={17} />
        <span>Tạo đơn hàng mới</span>
      </button>
    </div>
  );
}

export default CashierTabs;
