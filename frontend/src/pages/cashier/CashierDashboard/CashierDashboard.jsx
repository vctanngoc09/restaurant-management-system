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
  const { user } = useAuth();

  const cashier = useCashierState();

  const activeOrderCount = cashier.orders.filter(
    (order) => order.status !== "completed",
  ).length;

  const currentUserName = user?.fullName || user?.username || "Thu ngân";

  return (
    <div className={styles.cashierPage}>
      <CashierTabs
        activeTab={cashier.activeTab}
        onTabChange={cashier.setActiveTab}
        tableCount={cashier.tables.length}
        orderCount={activeOrderCount}
        onNewOrder={cashier.openNewOrder}
      />

      {cashier.activeTab === "tables" && (
        <TableView
          tables={cashier.tables}
          orders={cashier.orders}
          onTableClick={cashier.openTable}
          onQuickChannelClick={cashier.openQuickChannel}
          onNewOrder={cashier.openNewOrder}
        />
      )}

      {cashier.activeTab === "orders" && (
        <OrderView
          orders={cashier.orders}
          onNewOrder={cashier.openNewOrder}
          onViewDetail={cashier.openOrderDetails}
          onPayment={cashier.openBilling}
        />
      )}

      <NewOrderModal
        open={cashier.activeModal === "newOrder"}
        tables={cashier.tables}
        onClose={cashier.closeModal}
        onStart={cashier.startNewOrder}
      />

      <OrderingModal
        open={cashier.activeModal === "ordering"}
        selectedTable={cashier.selectedTable}
        selectedOrder={cashier.selectedOrder}
        orderType={cashier.draftOrderType}
        guestCount={cashier.draftGuestCount}
        menuItems={cashier.menuItems}
        onClose={cashier.closeModal}
        onSave={cashier.saveOrderItems}
      />

      <BillingModal
        open={cashier.activeModal === "billing"}
        selectedOrder={cashier.selectedOrder}
        onClose={cashier.closeModal}
        onComplete={cashier.completePayment}
      />

      <ReceiptPrintModal
        open={cashier.activeModal === "receipt"}
        selectedOrder={cashier.selectedOrder}
        currentUserName={currentUserName}
        onClose={cashier.closeModal}
      />
    </div>
  );
}

export default CashierDashboard;
