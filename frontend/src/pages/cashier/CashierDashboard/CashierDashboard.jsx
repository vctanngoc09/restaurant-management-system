import { useEffect, useState } from "react";

import useAuth from "../../../hooks/useAuth";

import useCashierState from "../../../features/cashier/hooks/useCashierState";

import CashierTabs from "../../../features/cashier/components/common/CashierTabs/CashierTabs";

import TableView from "../../../features/cashier/components/tables/TableView/TableView";

import OrderView from "../../../features/cashier/components/orders/OrderView/OrderView";

import NewOrderModal from "../../../features/cashier/components/modals/NewOrderModal/NewOrderModal";

import OrderingModal from "../../../features/cashier/components/modals/OrderingModal/OrderingModal";

import BillingModal from "../../../features/cashier/components/modals/BillingModal/BillingModal";

import ReceiptPrintModal from "../../../features/cashier/components/modals/ReceiptPrintModal/ReceiptPrintModal";

import styles from "./CashierDashboard.module.css";

function CashierDashboard() {
  // ==================================================
  // AUTH
  // ==================================================

  const { user } = useAuth();

  // ==================================================
  // CASHIER STATE
  // ==================================================

  const cashier = useCashierState();

  // ==================================================
  // SERVING ITEM
  //
  // Chặn double click READY -> SERVED
  // ==================================================

  const [servingItemId, setServingItemId] = useState(null);

  // ==================================================
  // ACTIVE ORDERS
  // ==================================================

  const activeOrders = cashier.orders.filter(
    (order) => order.status !== "completed" && order.status !== "cancelled",
  );

  const activeOrderCount = activeOrders.length;

  // ==================================================
  // READY COUNT
  // ==================================================

  const readyItemCount = activeOrders.reduce((total, order) => {
    return total + order.items.filter((item) => item.status === "ready").length;
  }, 0);

  // ==================================================
  // CURRENT USER
  // ==================================================

  const currentUserName = user?.fullName || user?.username || "Thu ngân";

  // ==================================================
  // POLLING
  //
  // Khi đang ở tab Đơn Hàng:
  // refresh 5 giây / lần
  //
  // để nhận trạng thái READY từ bếp.
  // ==================================================

  useEffect(() => {
    if (cashier.activeTab !== "orders") {
      return undefined;
    }

    const reload = () => {
      cashier.reloadTables();

      cashier.reloadTakeAwayOrders?.();
    };

    reload();

    const interval = setInterval(reload, 5000);

    return () => clearInterval(interval);
  }, [cashier.activeTab, cashier.reloadTables, cashier.reloadTakeAwayOrders]);

  // ==================================================
  // READY -> SERVED
  // ==================================================

  const handleServeItem = async (orderItemId) => {
    if (!orderItemId || servingItemId) {
      return null;
    }

    try {
      setServingItemId(orderItemId);

      return await cashier.serveItem(orderItemId);
    } finally {
      setServingItemId(null);
    }
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.cashierPage}>
      {/* ==================================================
          TABS
      ================================================== */}

      <CashierTabs
        activeTab={cashier.activeTab}
        onTabChange={cashier.setActiveTab}
        tableCount={cashier.tables.length}
        orderCount={activeOrderCount}
        readyItemCount={readyItemCount}
        onNewOrder={cashier.openNewOrder}
      />

      {/* ==================================================
          TABLES
      ================================================== */}

      {cashier.activeTab === "tables" && (
        <TableView
          tables={cashier.tables}
          orders={cashier.orders}
          onTableClick={cashier.openTable}
          onQuickChannelClick={cashier.openQuickChannel}
          onNewOrder={cashier.openNewOrder}
        />
      )}

      {/* ==================================================
          ORDERS
      ================================================== */}

      {cashier.activeTab === "orders" && (
        <OrderView
          orders={cashier.orders}
          servingItemId={servingItemId}
          onServeItem={handleServeItem}
          onViewDetail={cashier.openOrderDetails}
          onPayment={cashier.openBilling}
        />
      )}

      {/* ==================================================
          NEW ORDER
      ================================================== */}

      <NewOrderModal
        open={cashier.activeModal === "newOrder"}
        tables={cashier.tables}
        onClose={cashier.closeModal}
        onStart={cashier.startNewOrder}
      />

      {/* ==================================================
          ORDERING
      ================================================== */}

      <OrderingModal
        open={cashier.activeModal === "ordering"}
        selectedTable={cashier.selectedTable}
        selectedOrder={cashier.selectedOrder}
        orderType={cashier.draftOrderType}
        guestCount={cashier.draftGuestCount}
        shippingDetail={cashier.draftShippingDetail}
        menuItems={cashier.menuItems}
        restaurantSetting={cashier.restaurantSetting}
        promotions={cashier.promotions}
        onClose={cashier.closeModal}
        onSave={cashier.saveOrderItems}
        onCreatePrepaidOrder={cashier.createPrepaidOrder}
        onPayCash={cashier.payCash}
      />

      {/* ==================================================
          BILLING
      ================================================== */}

      <BillingModal
        open={cashier.activeModal === "billing"}
        selectedOrder={cashier.selectedOrder}
        onClose={cashier.closeModal}
        onComplete={cashier.completePayment}
      />

      {/* ==================================================
          RECEIPT
      ================================================== */}

      <ReceiptPrintModal
        open={cashier.activeModal === "receipt"}
        selectedOrder={cashier.selectedOrder}
        currentUserName={currentUserName}
        restaurantSetting={cashier.restaurantSetting}
        onClose={cashier.closeModal}
      />
    </div>
  );
}

export default CashierDashboard;
