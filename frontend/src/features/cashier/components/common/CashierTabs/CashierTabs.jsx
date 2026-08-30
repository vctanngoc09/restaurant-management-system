import { Plus } from "lucide-react";

import DashboardTabs from "../../../../../components/common/DashboardTabs/DashboardTabs";

import styles from "./CashierTabs.module.css";

function CashierTabs({
  activeTab,

  onTabChange,

  tableCount,

  orderCount,

  onNewOrder,
}) {
  return (
    <DashboardTabs
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabs={[
        {
          id: "tables",

          label: "Phòng Bàn",

          count: tableCount,
        },

        {
          id: "orders",

          label: "Đơn Hàng",

          count: orderCount,
        },
      ]}
      rightContent={
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onNewOrder}
        >
          <Plus size={17} />

          <span>Tạo đơn hàng mới</span>
        </button>
      }
    />
  );
}

export default CashierTabs;
