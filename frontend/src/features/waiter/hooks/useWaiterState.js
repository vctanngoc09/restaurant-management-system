import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { CASHIER_ORDERS } from "../../../data/cashierMockData";

import waiterMenuService from "../services/waiterMenuService";

import waiterTableService from "../services/waiterTableService";

import waiterOrderService from "../services/waiterOrderService";

// ==================================================
// VIRTUAL ORDERS
//
// TAKE_AWAY + DELIVERY hiện chưa có Backend.
//
// DINE_IN sẽ dùng hoàn toàn Backend.
// ==================================================

const INITIAL_VIRTUAL_ORDERS = CASHIER_ORDERS.filter(
  (order) => order.orderType !== "dine_in",
);

// ==================================================
// NORMALIZE TABLE STATUS
// BACKEND -> FRONTEND
// ==================================================

function normalizeTableStatus(status) {
  switch (status) {
    case "AVAILABLE":
      return "empty";

    case "OCCUPIED":
      return "occupied";

    case "MAINTENANCE":
      return "maintenance";

    case "INACTIVE":
      return "inactive";

    default:
      return status?.toLowerCase() || "empty";
  }
}

// ==================================================
// NORMALIZE TABLE
// BACKEND -> WAITER UI
// ==================================================

function normalizeTable(table) {
  return {
    // =========================
    // TABLE
    // =========================

    id: table.id,

    number: table.tableNumber,

    status: normalizeTableStatus(table.status),

    // =========================
    // AREA
    // =========================

    areaId: table.areaId,

    areaName: table.areaName || "Chưa phân khu",

    // =========================
    // QR
    // =========================

    qrToken: table.qrToken,

    // =========================
    // ACTIVE ORDER INFO
    //
    // loadActiveOrders()
    // sẽ bổ sung sau.
    // =========================

    guestCount: 0,

    itemCount: 0,

    currentTotal: 0,

    currentOrderId: null,
  };
}

// ==================================================
// NORMALIZE ORDER TYPE
// BACKEND -> FRONTEND
// ==================================================

function normalizeOrderType(orderType) {
  switch (orderType) {
    case "DINE_IN":
      return "dine_in";

    case "TAKE_AWAY":
      return "take_away";

    case "DELIVERY":
      return "delivery";

    default:
      return orderType?.toLowerCase() || "dine_in";
  }
}

// ==================================================
// NORMALIZE ORDER STATUS
//
// BACKEND
// PENDING
// PROCESSING
// AWAITING_PAYMENT
// COMPLETED
// CANCELLED
//
// FRONTEND
// pending
// cooking
// pending_payment
// completed
// cancelled
// ==================================================

function normalizeOrderStatus(status) {
  switch (status) {
    case "PENDING":
      return "pending";

    case "PROCESSING":
      return "cooking";

    case "AWAITING_PAYMENT":
      return "pending_payment";

    case "COMPLETED":
      return "completed";

    case "CANCELLED":
      return "cancelled";

    default:
      return status?.toLowerCase() || "pending";
  }
}

// ==================================================
// NORMALIZE ORDER ITEM STATUS
// ==================================================

function normalizeOrderItemStatus(status) {
  switch (status) {
    case "PENDING":
      return "pending";

    case "COOKING":
      return "cooking";

    case "READY":
      return "ready";

    case "SERVED":
      return "served";

    case "OUT_OF_STOCK":
      return "out_of_stock";

    default:
      return status?.toLowerCase() || "pending";
  }
}

// ==================================================
// NORMALIZE ORDER ITEM
// BACKEND -> WAITER UI
// ==================================================

function normalizeOrderItem(item) {
  const itemStatus = normalizeOrderItemStatus(item.status);

  return {
    // =========================
    // ORDER ITEM
    // =========================

    id: item.id,

    // =========================
    // PRODUCT
    // =========================

    productId: item.productId,

    menuItemId: item.productId,

    name: item.productName,

    // =========================
    // PRICE
    // =========================

    price: Number(item.price) || 0,

    quantity: Number(item.quantity) || 0,

    lineTotal:
      Number(item.lineTotal) || Number(item.price) * Number(item.quantity),

    // =========================
    // NOTE
    // =========================

    note: item.note || "",

    // =========================
    // STATUS
    // =========================

    status: itemStatus,

    kdsStatus: itemStatus,
  };
}

// ==================================================
// NORMALIZE ORDER
// BACKEND -> WAITER UI
// ==================================================

function normalizeOrder(order) {
  const items = Array.isArray(order?.items)
    ? order.items.map(normalizeOrderItem)
    : [];

  const orderStatus = normalizeOrderStatus(order?.status);

  const totalPrice = Number(order?.totalPrice) || 0;

  return {
    // =========================
    // ORDER
    // =========================

    id: order.id,

    createdAt: order.createdAt,

    orderType: normalizeOrderType(order.orderType),

    status: orderStatus,

    note: order.note || "",

    // =========================
    // TABLE
    // =========================

    tableId: order.tableId,

    tableNumber: order.tableNumber,

    tableName: `Bàn ${order.tableNumber || ""}`,

    // =========================
    // STAFF
    // =========================

    staffId: order.staffId,

    staffName: order.staffName,

    waiterName: order.staffName || "Phục vụ",

    // =========================
    // ITEMS
    // =========================

    items,

    // =========================
    // TOTAL
    //
    // Backend totalPrice hiện
    // chưa tính VAT.
    // =========================

    subtotal: totalPrice,

    vatAmount: 0,

    totalAmount: totalPrice,

    // =========================
    // UI PROGRESS
    // =========================

    progressPercentage: getProgressPercentage(orderStatus),

    progressLabel: getProgressLabel(orderStatus),
  };
}

// ==================================================
// ORDER PROGRESS
// ==================================================

function getProgressPercentage(status) {
  switch (status) {
    case "pending":
      return 10;

    case "cooking":
      return 40;

    case "pending_payment":
      return 100;

    case "completed":
      return 100;

    default:
      return 0;
  }
}

// ==================================================
// ORDER PROGRESS LABEL
// ==================================================

function getProgressLabel(status) {
  switch (status) {
    case "pending":
      return "Chờ bếp nhận";

    case "cooking":
      return "Đang chế biến";

    case "pending_payment":
      return "Chờ thanh toán";

    case "completed":
      return "Hoàn thành";

    case "cancelled":
      return "Đã hủy";

    default:
      return "";
  }
}

// ==================================================
// NORMALIZE PRODUCT STATUS
// BACKEND -> WAITER UI
// ==================================================

function normalizeProductStatus(status) {
  switch (status) {
    case "AVAILABLE":
      return "in_stock";

    case "OUT_OF_STOCK":
      return "out_of_stock";

    case "INACTIVE":
      return "inactive";

    default:
      return "out_of_stock";
  }
}

// ==================================================
// NORMALIZE PRODUCT
// BACKEND -> WAITER MENU
// ==================================================

function normalizeMenuItem(product) {
  return {
    id: product.id,

    name: product.name,

    price: Number(product.price) || 0,

    // =========================
    // CLOUDINARY IMAGE
    // =========================

    urlImg: product.urlImg || null,

    // =========================
    // CATEGORY
    // =========================

    categoryId: product.categoryId,

    categoryName: product.categoryName || "Chưa phân loại",

    // =========================
    // STATUS
    // =========================

    status: normalizeProductStatus(product.status),

    productStatus: product.status,
  };
}

// ==================================================
// BUILD ORDER ITEM REQUEST
//
// Cart frontend
// ->
// OrderItemRequest backend
// ==================================================

function buildOrderItemsRequest(cartItems) {
  return cartItems.map((item) => ({
    productId: item.menuItem.id,

    quantity: item.quantity,

    note: item.note?.trim() || null,
  }));
}

// ==================================================
// BUILD LOCAL VIRTUAL ITEM
//
// Chỉ dùng TAKE_AWAY / DELIVERY
// khi Backend chưa làm.
// ==================================================

function buildVirtualOrderItems(cartItems) {
  return cartItems.map((item, index) => ({
    id: `OI-${Date.now()}-${index}`,

    productId: item.menuItem.id,

    menuItemId: item.menuItem.id,

    name: item.menuItem.name,

    price: item.menuItem.price,

    quantity: item.quantity,

    note: item.note || "",

    status: "pending",

    kdsStatus: "pending",

    lineTotal: item.menuItem.price * item.quantity,
  }));
}

// ==================================================
// WAITER STATE
// ==================================================

function useWaiterState() {
  // ==================================================
  // TABLES
  // BACKEND
  // ==================================================

  const [tables, setTables] = useState([]);

  const [tablesLoading, setTablesLoading] = useState(true);

  const [tablesError, setTablesError] = useState(null);

  // ==================================================
  // ORDERS
  //
  // DINE_IN:
  // Backend
  //
  // TAKE_AWAY / DELIVERY:
  // Local mock
  // ==================================================

  const [orders, setOrders] = useState(INITIAL_VIRTUAL_ORDERS);

  // ==================================================
  // MENU
  // BACKEND
  // ==================================================

  const [menuItems, setMenuItems] = useState([]);

  const [menuLoading, setMenuLoading] = useState(true);

  const [menuError, setMenuError] = useState(null);

  // ==================================================
  // LOAD MENU
  // ==================================================

  const loadMenu = useCallback(async () => {
    try {
      // =========================
      // START
      // =========================

      setMenuLoading(true);

      setMenuError(null);

      // =========================
      // API
      // =========================

      const response = await waiterMenuService.getAll();

      const productList = Array.isArray(response?.data) ? response.data : [];

      // =========================
      // NORMALIZE
      // =========================

      const normalizedMenu = productList

        .map(normalizeMenuItem)

        /*
         * Backend đã loại INACTIVE.
         *
         * Filter thêm để frontend
         * an toàn hơn.
         */
        .filter((item) => item.productStatus !== "INACTIVE");

      setMenuItems(normalizedMenu);
    } catch (error) {
      console.error("LOAD WAITER MENU ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải thực đơn.";

      setMenuError(message);

      setMenuItems([]);

      toast.error(message);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  // ==================================================
  // LOAD ACTIVE ORDERS
  // ==================================================

  const loadActiveOrders = useCallback(async (currentTables) => {
    /*
     * Chỉ bàn OCCUPIED mới
     * cần tìm Active Order.
     */
    const occupiedTables = currentTables.filter(
      (table) => table.status === "occupied",
    );

    // =========================
    // KHÔNG CÓ BÀN OCCUPIED
    // =========================

    if (occupiedTables.length === 0) {
      setOrders(INITIAL_VIRTUAL_ORDERS);

      return {
        orders: [],

        tables: currentTables,
      };
    }

    // =========================
    // CALL API SONG SONG
    // =========================

    const results = await Promise.allSettled(
      occupiedTables.map(async (table) => {
        const response = await waiterOrderService.getActiveByTable(table.id);

        return {
          tableId: table.id,

          order: normalizeOrder(response.data),
        };
      }),
    );

    // =========================
    // SUCCESS ORDERS
    // =========================

    const activeOrders = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        activeOrders.push(result.value.order);

        return;
      }

      /*
       * DB có thể bị lệch:
       *
       * Table = OCCUPIED
       * nhưng không có Order.
       *
       * Không toast để tránh spam.
       */
      const table = occupiedTables[index];

      console.warn(
        `Không lấy được active order của bàn ${table.number}:`,
        result.reason,
      );
    });

    // =========================
    // UPDATE ORDER STATE
    //
    // Virtual
    // +
    // Backend DINE_IN
    // =========================

    setOrders([...INITIAL_VIRTUAL_ORDERS, ...activeOrders]);

    // =========================
    // ENRICH TABLE
    // =========================

    const updatedTables = currentTables.map((table) => {
      const activeOrder = activeOrders.find(
        (order) => order.tableId === table.id,
      );

      if (!activeOrder) {
        return {
          ...table,

          itemCount: 0,

          currentTotal: 0,

          currentOrderId: null,
        };
      }

      const itemCount = activeOrder.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );

      return {
        ...table,

        itemCount,

        currentTotal: activeOrder.totalAmount,

        currentOrderId: activeOrder.id,
      };
    });

    setTables(updatedTables);

    return {
      orders: activeOrders,

      tables: updatedTables,
    };
  }, []);

  // ==================================================
  // LOAD TABLES
  // THEN ACTIVE ORDERS
  // ==================================================

  const loadTables = useCallback(async () => {
    try {
      // =========================
      // START
      // =========================

      setTablesLoading(true);

      setTablesError(null);

      // =========================
      // API
      // =========================

      const response = await waiterTableService.getAll({
        page: 0,

        size: 50,
      });

      // =========================
      // PAGE DATA
      // =========================

      const pageData = response?.data;

      const tableList = pageData?.content || pageData?.items || [];

      // =========================
      // NORMALIZE
      // =========================

      const normalizedTables = tableList.map(normalizeTable);

      // =========================
      // SET TABLES FIRST
      // =========================

      setTables(normalizedTables);

      // =========================
      // LOAD ACTIVE ORDERS
      // =========================

      await loadActiveOrders(normalizedTables);
    } catch (error) {
      console.error("LOAD WAITER DATA ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải sơ đồ bàn.";

      setTablesError(message);

      toast.error(message);
    } finally {
      setTablesLoading(false);
    }
  }, [loadActiveOrders]);

  // ==================================================
  // INITIAL LOAD TABLES
  // ==================================================

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  // ==================================================
  // INITIAL LOAD MENU
  // ==================================================

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // ==================================================
  // FIND ACTIVE ORDER
  // ==================================================

  const findActiveOrder = (orderType, tableId) => {
    return orders.find((order) => {
      // =========================
      // IGNORE FINISHED
      // =========================

      if (order.status === "completed" || order.status === "cancelled") {
        return false;
      }

      // =========================
      // TAKE AWAY
      // =========================

      if (orderType === "take_away") {
        return order.orderType === "take_away";
      }

      // =========================
      // DELIVERY
      // =========================

      if (orderType === "delivery") {
        return order.orderType === "delivery";
      }

      // =========================
      // DINE IN
      // =========================

      return order.orderType === "dine_in" && order.tableId === tableId;
    });
  };

  // ==================================================
  // SEND TO KITCHEN
  //
  // DINE_IN:
  //
  // chưa có Order
  // -> POST /api/orders
  //
  // đã có Order
  // -> POST /api/orders/{id}/items
  //
  // TAKE_AWAY / DELIVERY:
  // local tạm thời
  // ==================================================

  const sendToKitchen = async ({
    orderType,
    tableNumber,
    guestCount,
    cartItems,
  }) => {
    // =========================
    // VALIDATE CART
    // =========================

    if (!cartItems || cartItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một món trước khi gửi bếp.");

      return null;
    }

    /*
     * WaiterDashboard hiện truyền:
     *
     * selectedTableNumber
     *
     * nhưng giá trị thực tế là:
     *
     * table.id
     *
     * Giữ lại để chưa phải
     * sửa nhiều component.
     */
    const tableId = tableNumber;

    // =========================
    // FIND EXISTING ORDER
    // =========================

    const existingOrder = findActiveOrder(orderType, tableId);

    // ==================================================
    // DINE IN
    // EXISTING ORDER
    //
    // GỌI THÊM MÓN
    // ==================================================

    if (existingOrder && orderType === "dine_in") {
      // =========================
      // BUILD REQUEST
      // =========================

      const items = buildOrderItemsRequest(cartItems);

      try {
        // =========================
        // API
        // =========================

        const response = await waiterOrderService.addItemsToOrder(
          existingOrder.id,
          items,
        );

        const updatedOrder = normalizeOrder(response.data);

        // =========================
        // UPDATE ORDER STATE
        // =========================

        setOrders((prev) =>
          prev.map((order) =>
            order.id === existingOrder.id ? updatedOrder : order,
          ),
        );

        // =========================
        // UPDATE TABLE
        // =========================

        setTables((prev) =>
          prev.map((table) => {
            if (table.id !== tableId) {
              return table;
            }

            const itemCount = updatedOrder.items.reduce(
              (total, item) => total + item.quantity,
              0,
            );

            return {
              ...table,

              status: "occupied",

              itemCount,

              currentTotal: updatedOrder.totalAmount,

              currentOrderId: updatedOrder.id,
            };
          }),
        );

        // =========================
        // SUCCESS
        // =========================

        const selectedTable = tables.find((table) => table.id === tableId);

        toast.success(
          `Đã gọi thêm món cho Bàn ${selectedTable?.number || tableId}.`,
        );

        return updatedOrder;
      } catch (error) {
        console.error("ADD ITEMS TO ORDER ERROR:", error);

        const message =
          error.response?.data?.message ||
          error.message ||
          "Không thể gọi thêm món.";

        toast.error(message);

        return null;
      }
    }

    // ==================================================
    // DINE IN
    // CREATE NEW ORDER
    //
    // POST /api/orders
    // ==================================================

    if (!existingOrder && orderType === "dine_in") {
      // =========================
      // CHECK TABLE ID
      // =========================

      if (!tableId) {
        toast.error("Không xác định được bàn để tạo đơn.");

        return null;
      }

      // =========================
      // ITEMS
      // =========================

      const items = buildOrderItemsRequest(cartItems);

      // =========================
      // REQUEST BODY
      // =========================

      const request = {
        orderType: "DINE_IN",

        tableId: tableId,

        /*
         * Hiện frontend chưa có
         * ghi chú toàn Order.
         */
        note: null,

        items,
      };

      try {
        // =========================
        // CREATE ORDER API
        // =========================

        const response = await waiterOrderService.createOrder(request);

        // =========================
        // NORMALIZE RESPONSE
        // =========================

        const createdOrder = normalizeOrder(response.data);

        // =========================
        // UPDATE ORDERS
        // =========================

        setOrders((prev) => [
          createdOrder,

          ...prev.filter((order) => order.id !== createdOrder.id),
        ]);

        // =========================
        // UPDATE TABLE
        //
        // Backend đã đổi DB:
        //
        // AVAILABLE
        // ->
        // OCCUPIED
        //
        // Frontend đổi state ngay
        // để không phải reload.
        // =========================

        setTables((prev) =>
          prev.map((table) => {
            if (table.id !== tableId) {
              return table;
            }

            const itemCount = createdOrder.items.reduce(
              (total, item) => total + item.quantity,
              0,
            );

            return {
              ...table,

              status: "occupied",

              itemCount,

              currentTotal: createdOrder.totalAmount,

              currentOrderId: createdOrder.id,
            };
          }),
        );

        // =========================
        // SUCCESS
        // =========================

        const selectedTable = tables.find((table) => table.id === tableId);

        toast.success(
          `Đã tạo đơn cho Bàn ${selectedTable?.number || tableId} thành công.`,
        );

        return createdOrder;
      } catch (error) {
        console.error("CREATE DINE-IN ORDER ERROR:", error);

        const message =
          error.response?.data?.message ||
          error.message ||
          "Không thể tạo đơn tại bàn.";

        toast.error(message);

        return null;
      }
    }

    // ==================================================
    // TAKE AWAY / DELIVERY
    //
    // BACKEND CHƯA LÀM
    //
    // TẠM THỜI GIỮ LOCAL
    // ==================================================

    const newOrderItems = buildVirtualOrderItems(cartItems);

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

    if (orderType === "take_away") {
      tableName = "Mang Về";
    }

    if (orderType === "delivery") {
      tableName = "Giao Hàng";
    }

    // =========================
    // LOCAL ORDER
    // =========================

    const newOrder = {
      id: orderId,

      orderType,

      tableId: null,

      tableName,

      customerName: "",

      guestCount,

      waiterName: "Phục vụ",

      createdAt: new Date().toLocaleString("vi-VN"),

      status: "cooking",

      progressPercentage: 40,

      progressLabel: "Đang chế biến",

      items: newOrderItems,

      subtotal,

      vatAmount,

      totalAmount,
    };

    setOrders((prev) => [newOrder, ...prev]);

    toast.success("Đã tạo đơn tạm thời thành công.");

    return newOrder;
  };

  // ==================================================
  // REQUEST PAYMENT
  //
  // HIỆN TẠI LOCAL
  //
  // Sau này nối:
  //
  // PROCESSING
  // ->
  // AWAITING_PAYMENT
  // ==================================================

  const requestPayment = (orderId) => {
    if (!orderId) {
      toast.warning("Chưa có đơn hàng để yêu cầu thanh toán.");

      return;
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        return {
          ...order,

          status: "pending_payment",

          progressPercentage: 100,

          progressLabel: "Chờ thanh toán",
        };
      }),
    );

    toast.success("Đã gửi yêu cầu thanh toán tới Thu Ngân.");
  };

  // ==================================================
  // RETURN
  // ==================================================

  return {
    // =========================
    // TABLES
    // =========================

    tables,

    tablesLoading,

    tablesError,

    reloadTables: loadTables,

    // =========================
    // ORDERS
    // =========================

    orders,

    findActiveOrder,

    sendToKitchen,

    requestPayment,

    // =========================
    // MENU
    // =========================

    menuItems,

    menuLoading,

    menuError,

    reloadMenu: loadMenu,
  };
}

export default useWaiterState;
