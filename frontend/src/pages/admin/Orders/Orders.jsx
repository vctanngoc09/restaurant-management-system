import { useMemo, useState } from "react";

import { toast } from "react-toastify";

import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import OrderFilters from "../../../features/admin/components/orders/OrderFilters/OrderFilters";

import OrderTable from "../../../features/admin/components/orders/OrderTable/OrderTable";

import OrderDetailsModal from "../../../features/admin/components/orders/OrderDetailsModal/OrderDetailsModal";

import { ORDER_STATUS } from "../../../constants/orderStatus";

import { INITIAL_ORDERS } from "../../../data/adminOrdersMock";

import styles from "./Orders.module.css";

function Orders() {
  // ====================================
  // DATA
  // ====================================

  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // ====================================
  // FILTER STATE
  // ====================================

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [typeFilter, setTypeFilter] = useState("all");

  // ====================================
  // MODAL
  // ====================================

  const [selectedOrder, setSelectedOrder] = useState(null);

  // ====================================
  // FILTER ORDERS
  // ====================================

  const filteredOrders = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !keyword ||
        order.id.toLowerCase().includes(keyword) ||
        order.tableName?.toLowerCase().includes(keyword) ||
        order.customerName?.toLowerCase().includes(keyword) ||
        order.waiterName.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesType =
        typeFilter === "all" || order.orderType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, searchQuery, statusFilter, typeFilter]);

  // ====================================
  // VIEW
  // ====================================

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  // ====================================
  // PRINT
  // ====================================

  const handlePrintOrder = (order) => {
    /*
      Mock tạm thời.

      Sau này có thể:
      - mở ReceiptModal
      - tạo PDF
      - window.print()
      - gọi API hóa đơn
    */

    toast.info(`Mock: Chuẩn bị in hóa đơn ${order.id}`);
  };

  // ====================================
  // CANCEL
  // ====================================

  const handleCancelOrder = (order) => {
    if (order.status === ORDER_STATUS.COMPLETED) {
      toast.error("Đơn đã hoàn thành không thể hủy.");

      return;
    }

    const reason = window.prompt(
      `Nhập lý do hủy đơn ${order.id}:`,
      "Khách đổi ý",
    );

    if (reason === null) {
      return;
    }

    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do hủy đơn.");

      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.id === order.id
          ? {
              ...currentOrder,

              status: ORDER_STATUS.CANCELLED,

              progressPercentage: 0,

              progressLabel: "Đã hủy đơn",

              cancelReason: reason.trim(),
            }
          : currentOrder,
      ),
    );

    /*
      Nếu modal của đơn đang mở
      thì cập nhật luôn dữ liệu modal.
    */

    setSelectedOrder((currentOrder) =>
      currentOrder?.id === order.id
        ? {
            ...currentOrder,

            status: ORDER_STATUS.CANCELLED,

            progressPercentage: 0,

            progressLabel: "Đã hủy đơn",

            cancelReason: reason.trim(),
          }
        : currentOrder,
    );

    toast.success(`Đã hủy đơn ${order.id}`);
  };

  return (
    <div className={styles.page}>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <AdminPageHeader title="Danh Sách Quản Lý Đơn Hàng" />

      {/* =========================
          ORDER PANEL
      ========================= */}

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Quản Lý Tất Cả Đơn Hàng</h2>

            <p>Tra cứu, xem chi tiết, in hóa đơn hoặc xử lý hủy đơn hàng</p>
          </div>

          <OrderFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>

        <div className={styles.resultInfo}>
          <span>
            Hiển thị <strong>{filteredOrders.length}</strong> / {orders.length}{" "}
            đơn hàng
          </span>
        </div>

        <OrderTable
          orders={filteredOrders}
          onView={handleViewOrder}
          onPrint={handlePrintOrder}
          onCancel={handleCancelOrder}
        />
      </section>

      {/* =========================
          DETAILS MODAL
      ========================= */}

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onPrint={handlePrintOrder}
      />
    </div>
  );
}

export default Orders;
