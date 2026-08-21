import { useState } from "react";
import { toast } from "react-toastify";

import {
  CASHIER_MENU_ITEMS,
  CASHIER_ORDERS,
  CASHIER_TABLES,
} from "../../../data/cashierMockData";

const useCashierState = () => {
  const [activeTab, setActiveTab] = useState("tables");

  const [tables, setTables] = useState(CASHIER_TABLES);
  const [orders, setOrders] = useState(CASHIER_ORDERS);
  const [menuItems] = useState(CASHIER_MENU_ITEMS);

  const [activeModal, setActiveModal] = useState("none");

  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [draftOrderType, setDraftOrderType] = useState("dine_in");
  const [draftGuestCount, setDraftGuestCount] = useState(2);

  const closeModal = () => {
    setActiveModal("none");
  };

  const openNewOrder = () => {
    setSelectedTable(null);
    setSelectedOrder(null);

    setDraftOrderType("dine_in");
    setDraftGuestCount(2);

    setActiveModal("newOrder");
  };

  const startNewOrder = ({ orderType, tableId = null, guestCount = 1 }) => {
    setDraftOrderType(orderType);
    setDraftGuestCount(guestCount);

    setSelectedOrder(null);

    if (orderType === "dine_in") {
      const table = tables.find((item) => item.id === tableId);

      setSelectedTable(table || null);
    } else {
      setSelectedTable(null);
    }

    setActiveModal("ordering");
  };

  const openTable = (table) => {
    setSelectedTable(table);

    if (table.status === "occupied") {
      const order = orders.find(
        (item) =>
          item.status !== "completed" &&
          (item.id === table.currentOrderId || item.tableId === table.id),
      );

      if (order) {
        setSelectedOrder(order);
        setActiveModal("billing");
        return;
      }
    }

    setSelectedOrder(null);

    setDraftOrderType("dine_in");
    setDraftGuestCount(table.guestCount || 2);

    setActiveModal("ordering");
  };

  const openQuickChannel = (orderType) => {
    const order = orders.find(
      (item) => item.orderType === orderType && item.status !== "completed",
    );

    setSelectedTable(null);
    setDraftOrderType(orderType);
    setDraftGuestCount(1);

    if (order) {
      setSelectedOrder(order);
    } else {
      setSelectedOrder(null);
    }

    setActiveModal("ordering");
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);

    if (order.tableId) {
      const table = tables.find((item) => item.id === order.tableId);

      setSelectedTable(table || null);
    } else {
      setSelectedTable(null);
    }

    setDraftOrderType(order.orderType);
    setDraftGuestCount(order.guestCount || 1);

    setActiveModal("ordering");
  };

  const openBilling = (order) => {
    setSelectedOrder(order);

    if (order.tableId) {
      const table = tables.find((item) => item.id === order.tableId);

      setSelectedTable(table || null);
    } else {
      setSelectedTable(null);
    }

    setActiveModal("billing");
  };

  const saveOrderItems = (cartItems) => {
    if (!cartItems.length) {
      toast.warning("Vui lòng chọn ít nhất một món.");
      return;
    }

    const items = cartItems.map((item, index) => ({
      id: item.id || `OI-${Date.now()}-${index}`,
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
      note: item.note || "",
    }));

    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const vatAmount = Math.round(subtotal * 0.08);
    const totalAmount = subtotal + vatAmount;

    // ==============================
    // UPDATE ORDER
    // ==============================
    if (selectedOrder) {
      const updatedOrder = {
        ...selectedOrder,
        items,
        subtotal,
        vatAmount,
        totalAmount,
      };

      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? updatedOrder : order,
        ),
      );

      if (selectedOrder.tableId) {
        setTables((prev) =>
          prev.map((table) =>
            table.id === selectedOrder.tableId
              ? {
                  ...table,
                  itemCount: items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  ),
                  currentTotal: totalAmount,
                }
              : table,
          ),
        );
      }

      setSelectedOrder(updatedOrder);

      toast.success(`Đã cập nhật đơn ${updatedOrder.id}.`);

      closeModal();

      return;
    }

    // ==============================
    // CREATE ORDER
    // ==============================
    const orderPrefix =
      draftOrderType === "take_away"
        ? "TA"
        : draftOrderType === "delivery"
          ? "DL"
          : "DI";

    const newOrderId = `#${orderPrefix}${String(Date.now()).slice(-4)}`;

    let tableName = "Đơn hàng mới";

    if (draftOrderType === "dine_in") {
      tableName = selectedTable ? `Bàn ${selectedTable.number}` : "Tại chỗ";
    }

    if (draftOrderType === "take_away") {
      tableName = "Mang về";
    }

    if (draftOrderType === "delivery") {
      tableName = "Giao hàng";
    }

    const now = new Date();

    const newOrder = {
      id: newOrderId,
      orderType: draftOrderType,
      tableId: draftOrderType === "dine_in" ? selectedTable?.id || null : null,
      tableName,
      customerName: "",
      guestCount: draftGuestCount,
      waiterName: "Thu ngân",
      createdAt: now.toLocaleString("vi-VN"),
      status: "new",
      progressPercentage: 10,
      progressLabel: "10% Mới tạo",
      subtotal,
      vatAmount,
      totalAmount,
      items,
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (draftOrderType === "dine_in" && selectedTable) {
      setTables((prev) =>
        prev.map((table) =>
          table.id === selectedTable.id
            ? {
                ...table,
                status: "occupied",
                guestCount: draftGuestCount,
                itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
                currentOrderId: newOrder.id,
                currentTotal: totalAmount,
              }
            : table,
        ),
      );
    }

    toast.success(`Đã tạo đơn ${newOrder.id}.`);

    closeModal();
  };

  const completePayment = ({
    paymentMethod,
    discountPercent,
    cashReceived,
  }) => {
    if (!selectedOrder) {
      return;
    }

    const discountAmount = Math.round(
      (selectedOrder.subtotal * discountPercent) / 100,
    );

    const finalTotal = Math.max(
      0,
      selectedOrder.subtotal + selectedOrder.vatAmount - discountAmount,
    );

    const received =
      paymentMethod === "cash" ? cashReceived || finalTotal : finalTotal;

    const now = new Date();

    const updatedOrder = {
      ...selectedOrder,
      status: "completed",
      progressPercentage: 100,
      progressLabel: "100% Hoàn thành",
      discountAmount,
      totalAmount: finalTotal,
      paymentMethod,
      cashReceived: received,
      changeGiven: Math.max(0, received - finalTotal),
      paidAt: now.toLocaleString("vi-VN"),
    };

    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );

    if (updatedOrder.tableId) {
      setTables((prev) =>
        prev.map((table) =>
          table.id === updatedOrder.tableId
            ? {
                ...table,
                status: "empty",
                guestCount: 0,
                itemCount: 0,
                currentOrderId: null,
                currentTotal: 0,
              }
            : table,
        ),
      );
    }

    setSelectedOrder(updatedOrder);

    toast.success("Thanh toán thành công.");

    setActiveModal("receipt");
  };

  return {
    activeTab,
    setActiveTab,

    tables,
    orders,
    menuItems,

    activeModal,

    selectedTable,
    selectedOrder,

    draftOrderType,
    draftGuestCount,

    closeModal,
    openNewOrder,
    startNewOrder,

    openTable,
    openQuickChannel,

    openOrderDetails,
    openBilling,

    saveOrderItems,
    completePayment,
  };
};

export default useCashierState;
