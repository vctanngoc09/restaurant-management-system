import { useEffect, useState } from "react";

import useAuth from "../../../hooks/useAuth";

import useWaiterState from "../../../features/waiter/hooks/useWaiterState";

import WaiterTableMap from "../../../features/waiter/components/WaiterTableMap/WaiterTableMap";

import WaiterOrderView from "../../../features/waiter/components/WaiterOrderView/WaiterOrderView";

import WaiterOrdersView from "../../../features/waiter/components/WaiterOrdersView/WaiterOrdersView";

import DashboardTabs from "../../../components/common/DashboardTabs/DashboardTabs";

import WaiterOrderDetailModal from "../../../features/waiter/components/WaiterOrderDetailModal/WaiterOrderDetailModal";

import styles from "./WaiterDashboard.module.css";

function WaiterDashboard() {
  // ==================================================
  // AUTH
  // ==================================================

  const { user } = useAuth();

  // ==================================================
  // WAITER STATE
  // ==================================================

  const waiter = useWaiterState();

  // ==================================================
  // VIEW
  //
  // tables
  // orders
  // order
  // ==================================================

  const [viewMode, setViewMode] = useState("tables");

  // ==================================================
  // SELECTED TABLE
  // ==================================================

  const [selectedTableId, setSelectedTableId] = useState(null);

  // ==================================================
  // DETAIL ORDER
  // ==================================================

  const [selectedDetailOrderId, setSelectedDetailOrderId] = useState(null);

  // ==================================================
  // SERVING ITEM
  // ==================================================

  const [servingItemId, setServingItemId] = useState(null);

  // ==================================================
  // USER
  // ==================================================

  const currentUserName =
    user?.fullName || user?.username || "Nhân viên phục vụ";

  // ==================================================
  // ACTIVE TABLE
  // ==================================================

  const activeTable =
    waiter.tables.find((table) => table.id === selectedTableId) || null;

  // ==================================================
  // ACTIVE ORDER OF TABLE
  // ==================================================

  const existingOrder = selectedTableId
    ? waiter.findActiveOrder("dine_in", selectedTableId)
    : null;

  // ==================================================
  // DETAIL ORDER
  // ==================================================

  const detailOrder =
    waiter.orders.find((order) => order.id === selectedDetailOrderId) || null;

  // ==================================================
  // ACTIVE ORDERS
  // ==================================================

  const activeOrders = waiter.orders.filter(
    (order) =>
      order.orderType === "dine_in" &&
      order.status !== "completed" &&
      order.status !== "cancelled",
  );

  // ==================================================
  // TABLE COUNT
  // ==================================================

  const tableCount = waiter.tables.filter(
    (table) => table.status !== "inactive",
  ).length;

  // ==================================================
  // READY ITEMS
  // ==================================================

  const readyItemCount = activeOrders.reduce((total, order) => {
    return total + order.items.filter((item) => item.status === "ready").length;
  }, 0);

  // ==================================================
  // POLLING
  //
  // Khi ở màn quản lý Order,
  // refresh 5 giây/lần để nhận READY.
  // ==================================================

  useEffect(() => {
    if (viewMode !== "orders") {
      return undefined;
    }

    waiter.reloadTables();

    const interval = setInterval(() => {
      waiter.reloadTables();
    }, 5000);

    return () => clearInterval(interval);
  }, [viewMode, waiter.reloadTables]);

  // ==================================================
  // SELECT TABLE
  // ==================================================

  const handleSelectTable = (table) => {
    setSelectedTableId(table.id);

    setViewMode("order");
  };

  // ==================================================
  // BACK
  // ==================================================

  const handleBackFromOrder = () => {
    setSelectedTableId(null);

    setViewMode("tables");
  };

  // ==================================================
  // SEND TO KITCHEN
  // ==================================================

  const handleSendToKitchen = async (data) => {
    if (!selectedTableId) {
      return null;
    }

    return waiter.sendToKitchen({
      ...data,

      orderType: "dine_in",

      /*
       * Hook hiện tại đang dùng
       * tableNumber để chứa table.id.
       */
      tableNumber: selectedTableId,
    });
  };

  // ==================================================
  // READY -> SERVED
  // ==================================================

  const handleServeItem = async (orderItemId) => {
    if (!orderItemId || servingItemId) {
      return null;
    }

    try {
      setServingItemId(orderItemId);

      return await waiter.serveItem(orderItemId);
    } finally {
      setServingItemId(null);
    }
  };

  // ==================================================
  // DETAIL
  // ==================================================

  const handleViewDetail = (orderId) => {
    setSelectedDetailOrderId(orderId);
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.waiterPage}>
      {viewMode !== "order" && (
        <DashboardTabs
          activeTab={viewMode}
          onTabChange={setViewMode}
          tabs={[
            {
              id: "tables",

              label: "Phòng Bàn",

              count: tableCount,
            },

            {
              id: "orders",

              label: "Đơn Hàng",

              count: activeOrders.length,
              notification: readyItemCount > 0,
            },
          ]}
        />
      )}

      {/* ==================================================
          TABLE VIEW
      ================================================== */}

      {viewMode === "tables" && (
        <div className={styles.dashboardContent}>
          <WaiterTableMap
            tables={waiter.tables}
            orders={waiter.orders}
            onSelectTable={handleSelectTable}
          />
        </div>
      )}

      {/* ==================================================
          ORDER LIST
      ================================================== */}

      {viewMode === "orders" && (
        <div className={styles.dashboardContent}>
          <WaiterOrdersView
            orders={waiter.orders}
            servingItemId={servingItemId}
            onServeItem={handleServeItem}
            onViewDetail={handleViewDetail}
            onRequestPayment={(orderId) => waiter.requestPayment(orderId)}
          />
        </div>
      )}

      {/* ==================================================
          ORDERING
      ================================================== */}

      {viewMode === "order" && (
        <div className={styles.orderingPage}>
          <WaiterOrderView
            table={activeTable}
            existingOrder={existingOrder}
            orderType="dine_in"
            menuItems={waiter.menuItems}
            currentUserName={currentUserName}
            onBack={handleBackFromOrder}
            onSendToKitchen={handleSendToKitchen}
            onRequestPayment={() => waiter.requestPayment(existingOrder?.id)}
          />
        </div>
      )}

      {/* ==================================================
          DETAIL MODAL
      ================================================== */}

      <WaiterOrderDetailModal
        order={detailOrder}
        servingItemId={servingItemId}
        onServeItem={handleServeItem}
        onClose={() => setSelectedDetailOrderId(null)}
      />
    </div>
  );
}

export default WaiterDashboard;
