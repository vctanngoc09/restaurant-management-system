import { Plus } from "lucide-react";

import DashboardTabs from "../../../../../components/common/DashboardTabs/DashboardTabs";

import styles from "./CashierTabs.module.css";

function CashierTabs({
  activeTab,
  onTabChange,
  tableCount,
  orderCount,
  readyItemCount = 0,
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

          // Có READY -> hiện dot
          notification: readyItemCount > 0,
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
