import { useState } from "react";

import useAuth from "../../../hooks/useAuth";

import useWaiterState from "../../../features/waiter/hooks/useWaiterState";

import WaiterTableMap from "../../../features/waiter/components/WaiterTableMap/WaiterTableMap";

import WaiterOrderView from "../../../features/waiter/components/WaiterOrderView/WaiterOrderView";

import styles from "./WaiterDashboard.module.css";

function WaiterDashboard() {
  const { user } = useAuth();

  const waiter = useWaiterState();

  const [viewMode, setViewMode] = useState("table_map");

  const [selectedTableNumber, setSelectedTableNumber] = useState(null);

  const [selectedOrderType, setSelectedOrderType] = useState("dine_in");

  const currentUserName =
    user?.fullName || user?.username || "Nhân viên phục vụ";

  const activeTable =
    selectedOrderType === "dine_in"
      ? waiter.tables.find((table) => table.id === selectedTableNumber)
      : null;

  const existingOrder = waiter.findActiveOrder(
    selectedOrderType,
    selectedTableNumber,
  );

  const handleSelectTable = (table) => {
    setSelectedTableNumber(table.id);

    setSelectedOrderType("dine_in");

    setViewMode("order");
  };

  const handleSelectVirtual = (type) => {
    setSelectedTableNumber(null);

    setSelectedOrderType(type);

    setViewMode("order");
  };

  return (
    <div className={styles.waiterPage}>
      {viewMode === "table_map" && (
        <WaiterTableMap
          tables={waiter.tables}
          orders={waiter.orders}
          currentUserName={currentUserName}
          onSelectTable={handleSelectTable}
          onSelectVirtual={handleSelectVirtual}
        />
      )}

      {viewMode === "order" && (
        <WaiterOrderView
          table={activeTable}
          existingOrder={existingOrder}
          orderType={selectedOrderType}
          menuItems={waiter.menuItems}
          currentUserName={currentUserName}
          onBack={() => setViewMode("table_map")}
          onSendToKitchen={(data) =>
            waiter.sendToKitchen({
              ...data,

              orderType: selectedOrderType,

              tableNumber: selectedTableNumber,
            })
          }
          onRequestPayment={() => waiter.requestPayment(existingOrder?.id)}
        />
      )}
    </div>
  );
}

export default WaiterDashboard;
