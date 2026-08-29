import { useEffect, useState } from "react";

import { ClipboardList, LayoutGrid } from "lucide-react";

import useAuth from "../../../hooks/useAuth";

import useWaiterState from "../../../features/waiter/hooks/useWaiterState";

import WaiterTableMap from "../../../features/waiter/components/WaiterTableMap/WaiterTableMap";

import WaiterOrderView from "../../../features/waiter/components/WaiterOrderView/WaiterOrderView";

import WaiterOrdersView from "../../../features/waiter/components/WaiterOrdersView/WaiterOrdersView";

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
  // VIEW MODE
  //
  // table_map
  // orders
  // order
  // ==================================================

  const [viewMode, setViewMode] = useState("table_map");

  // ==================================================
  // SELECTED TABLE
  //
  // Lưu table.id.
  // ==================================================

  const [selectedTableId, setSelectedTableId] = useState(null);

  // ==================================================
  // DETAIL MODAL
  // ==================================================

  const [selectedDetailOrderId, setSelectedDetailOrderId] = useState(null);

  // ==================================================
  // SERVING
  //
  // Chặn click nhiều lần
  // trên cùng item.
  // ==================================================

  const [servingItemId, setServingItemId] = useState(null);

  // ==================================================
  // CURRENT USER
  // ==================================================

  const currentUserName =
    user?.fullName || user?.username || "Nhân viên phục vụ";

  // ==================================================
  // ACTIVE TABLE
  // ==================================================

  const activeTable =
    waiter.tables.find((table) => table.id === selectedTableId) || null;

  // ==================================================
  // ACTIVE ORDER OF SELECTED TABLE
  // ==================================================

  const existingOrder = selectedTableId
    ? waiter.findActiveOrder("dine_in", selectedTableId)
    : null;

  // ==================================================
  // DETAIL ORDER
  //
  // Không lưu nguyên object.
  //
  // Chỉ lưu ID để sau khi READY -> SERVED
  // waiter.orders update thì modal
  // tự nhận Order mới.
  // ==================================================

  const detailOrder =
    waiter.orders.find((order) => order.id === selectedDetailOrderId) || null;

  // ==================================================
  // READY ITEM COUNT
  //
  // Badge trên tab Đơn hàng.
  // ==================================================

  const readyItemCount = waiter.orders.reduce((total, order) => {
    const readyItems = order.items.filter((item) => item.status === "ready");

    return total + readyItems.length;
  }, 0);

  // ==================================================
  // REFRESH ORDER LIST
  //
  // Vì hiện tại chưa dùng WebSocket,
  // khi đang mở tab Đơn hàng:
  //
  // refresh mỗi 5 giây để nhận
  // trạng thái READY từ Chef.
  // ==================================================

  useEffect(() => {
    if (viewMode !== "orders") {
      return undefined;
    }

    // Load ngay khi mở tab.
    waiter.reloadTables();

    const interval = setInterval(() => {
      waiter.reloadTables();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [viewMode, waiter.reloadTables]);

  // ==================================================
  // SELECT TABLE
  //
  // TABLE MAP -> ORDER VIEW
  // ==================================================

  const handleSelectTable = (table) => {
    setSelectedTableId(table.id);

    setViewMode("order");
  };

  // ==================================================
  // BACK FROM ORDER
  // ==================================================

  const handleBackFromOrder = () => {
    setSelectedTableId(null);

    setViewMode("table_map");
  };

  // ==================================================
  // SEND TO KITCHEN
  //
  // WAITER chỉ DINE_IN.
  // ==================================================

  const handleSendToKitchen = async (data) => {
    if (!selectedTableId) {
      return null;
    }

    const result = await waiter.sendToKitchen({
      ...data,

      orderType: "dine_in",

      /*
       * Hook hiện tại sử dụng
       * property tableNumber
       * nhưng thực chất value
       * đang là table.id.
       */
      tableNumber: selectedTableId,
    });

    if (!result) {
      return null;
    }

    return result;
  };

  // ==================================================
  // SERVE ITEM
  //
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
  // VIEW DETAIL
  // ==================================================

  const handleViewDetail = (orderId) => {
    setSelectedDetailOrderId(orderId);
  };

  // ==================================================
  // CLOSE DETAIL
  // ==================================================

  const handleCloseDetail = () => {
    setSelectedDetailOrderId(null);
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.waiterPage}>
      {/* ==================================================
          TOP NAVIGATION

          Không hiện khi đang ở màn
          gọi món cho một bàn.
      ================================================== */}

      {viewMode !== "order" && (
        <nav className={styles.viewTabs}>
          {/* =========================
              TABLE MAP
          ========================= */}

          <button
            type="button"
            className={viewMode === "table_map" ? styles.activeTab : ""}
            onClick={() => setViewMode("table_map")}
          >
            <LayoutGrid size={16} />

            <span>Sơ đồ bàn</span>
          </button>

          {/* =========================
              ORDER LIST
          ========================= */}

          <button
            type="button"
            className={viewMode === "orders" ? styles.activeTab : ""}
            onClick={() => setViewMode("orders")}
          >
            <ClipboardList size={16} />

            <span>Đơn hàng</span>

            {readyItemCount > 0 && (
              <strong className={styles.readyBadge}>{readyItemCount}</strong>
            )}
          </button>
        </nav>
      )}

      {/* ==================================================
          TABLE MAP
      ================================================== */}

      {viewMode === "table_map" && (
        <div className={styles.mapView}>
          <WaiterTableMap
            tables={waiter.tables}
            orders={waiter.orders}
            currentUserName={currentUserName}
            onSelectTable={handleSelectTable}
          />
        </div>
      )}

      {/* ==================================================
          ORDER LIST
      ================================================== */}

      {viewMode === "orders" && (
        <div className={styles.ordersView}>
          <WaiterOrdersView
            orders={waiter.orders}
            servingItemId={servingItemId}
            onServeItem={handleServeItem}
            onViewDetail={handleViewDetail}
          />
        </div>
      )}

      {/* ==================================================
          ORDER CREATE / ADD ITEMS
      ================================================== */}

      {viewMode === "order" && (
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
      )}

      {/* ==================================================
          ORDER DETAIL MODAL
      ================================================== */}

      <WaiterOrderDetailModal
        order={detailOrder}
        servingItemId={servingItemId}
        onServeItem={handleServeItem}
        onClose={handleCloseDetail}
      />
    </div>
  );
}

export default WaiterDashboard;
