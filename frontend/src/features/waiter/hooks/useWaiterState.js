import { useState } from "react";
import { toast } from "react-toastify";

import {
  CASHIER_MENU_ITEMS,
  CASHIER_ORDERS,
  CASHIER_TABLES,
} from "../../../data/cashierMockData";

function useWaiterState() {
  const [tables, setTables] = useState(CASHIER_TABLES);

  const [orders, setOrders] = useState(CASHIER_ORDERS);

  const [menuItems] = useState(CASHIER_MENU_ITEMS);

  const findActiveOrder = (orderType, tableNumber) => {
    return orders.find((order) => {
      if (order.status === "completed" || order.status === "cancelled") {
        return false;
      }

      if (orderType === "take_away") {
        return order.orderType === "take_away";
      }

      if (orderType === "delivery") {
        return order.orderType === "delivery";
      }

      return order.orderType === "dine_in" && order.tableId === tableNumber;
    });
  };

  const sendToKitchen = ({ orderType, tableNumber, guestCount, cartItems }) => {
    if (!cartItems.length) {
      toast.warning("Vui lòng chọn ít nhất một món trước khi gửi bếp.");

      return null;
    }

    const existingOrder = findActiveOrder(orderType, tableNumber);

    const newOrderItems = cartItems.map((item, index) => ({
      id: `OI-${Date.now()}-${index}`,

      menuItemId: item.menuItem.id,

      name: item.menuItem.name,

      price: item.menuItem.price,

      quantity: item.quantity,

      note: item.note || "",

      kdsStatus: "pending",
    }));

    /*
     * ================================
     * THÊM MÓN VÀO ĐƠN ĐANG TỒN TẠI
     * ================================
     */
    if (existingOrder) {
      const combinedItems = [...existingOrder.items, ...newOrderItems];

      const subtotal = combinedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      const vatAmount = Math.round(subtotal * 0.08);

      const totalAmount = subtotal + vatAmount;

      const updatedOrder = {
        ...existingOrder,

        items: combinedItems,

        subtotal,
        vatAmount,
        totalAmount,

        status: "cooking",

        progressPercentage: 30,

        progressLabel: "Đang chế biến",
      };

      setOrders((prev) =>
        prev.map((order) =>
          order.id === existingOrder.id ? updatedOrder : order,
        ),
      );

      if (orderType === "dine_in") {
        setTables((prev) =>
          prev.map((table) =>
            table.id === tableNumber
              ? {
                  ...table,

                  status: "occupied",

                  guestCount,

                  itemCount: combinedItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  ),

                  currentTotal: totalAmount,

                  currentOrderId: existingOrder.id,
                }
              : table,
          ),
        );
      }

      toast.success(
        orderType === "dine_in"
          ? `Đã gửi thêm món xuống bếp cho Bàn ${tableNumber}.`
          : "Đã gửi thêm món xuống bếp.",
      );

      return updatedOrder;
    }

    /*
     * ================================
     * TẠO ĐƠN MỚI
     * ================================
     */

    const prefix =
      orderType === "take_away" ? "TA" : orderType === "delivery" ? "DL" : "DI";

    const orderId = `#${prefix}${String(Date.now()).slice(-4)}`;

    const subtotal = newOrderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const vatAmount = Math.round(subtotal * 0.08);

    const totalAmount = subtotal + vatAmount;

    let tableName = "";

    if (orderType === "dine_in") {
      tableName = `Bàn ${tableNumber}`;
    }

    if (orderType === "take_away") {
      tableName = "Mang Về";
    }

    if (orderType === "delivery") {
      tableName = "Giao Hàng";
    }

    const newOrder = {
      id: orderId,

      orderType,

      tableId: orderType === "dine_in" ? tableNumber : null,

      tableName,

      customerName: "",

      guestCount,

      waiterName: "Phục vụ",

      createdAt: new Date().toLocaleString("vi-VN"),

      status: "cooking",

      progressPercentage: 30,

      progressLabel: "Đang chế biến",

      items: newOrderItems,

      subtotal,
      vatAmount,
      totalAmount,
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (orderType === "dine_in") {
      setTables((prev) =>
        prev.map((table) =>
          table.id === tableNumber
            ? {
                ...table,

                status: "occupied",

                guestCount,

                itemCount: newOrderItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                ),

                currentTotal: totalAmount,

                currentOrderId: newOrder.id,
              }
            : table,
        ),
      );
    }

    toast.success("Đã tạo đơn và gửi xuống bếp thành công.");

    return newOrder;
  };

  const requestPayment = (orderId) => {
    if (!orderId) {
      toast.warning("Chưa có đơn hàng để yêu cầu thanh toán.");

      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,

              status: "pending_payment",

              progressPercentage: 100,

              progressLabel: "Chờ thanh toán",
            }
          : order,
      ),
    );

    toast.success("Đã gửi yêu cầu thanh toán tới Thu Ngân.");
  };

  return {
    tables,
    orders,
    menuItems,

    findActiveOrder,

    sendToKitchen,
    requestPayment,
  };
}

export default useWaiterState;