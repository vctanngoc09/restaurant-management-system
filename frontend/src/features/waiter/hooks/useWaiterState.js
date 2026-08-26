import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { CASHIER_ORDERS } from "../../../data/cashierMockData";

import waiterMenuService from "../services/waiterMenuService";

import waiterTableService from "../services/waiterTableService";

import waiterOrderService from "../services/waiterOrderService";

// ==================================================
// VIRTUAL ORDERS
//
// TAKE AWAY + DELIVERY hiện chưa có Backend
// nên tạm thời vẫn giữ mock.
//
// DINE IN sẽ lấy hoàn toàn từ Backend.
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
    // ACTIVE ORDER INFORMATION
    //
    // Ban đầu chưa có.
    // loadActiveOrders() sẽ bổ sung.
    // =========================

    guestCount: 0,

    itemCount: 0,

    currentTotal: 0,

    currentOrderId: null,
  };
}

// ==================================================
// NORMALIZE ORDER TYPE
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
//
// Backend:
// productName
// productId
//
// UI hiện tại:
// name
// menuItemId
// ==================================================

function normalizeOrderItem(item) {
  const itemStatus = normalizeOrderItemStatus(item.status);

  return {
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

    price: item.price || 0,

    quantity: item.quantity || 0,

    lineTotal: item.lineTotal || (item.price || 0) * (item.quantity || 0),

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
  const items = Array.isArray(order.items)
    ? order.items.map(normalizeOrderItem)
    : [];

  const orderStatus = normalizeOrderStatus(order.status);

  const totalPrice = order.totalPrice || 0;

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
    // Backend hiện tại totalPrice
    // chính là tổng OrderItem.
    //
    // Chưa cộng VAT ở đây để dữ liệu
    // trên TableCard khớp database.
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

    /*
     * Cloudinary URL
     */
    urlImg: product.urlImg || null,

    /*
     * CATEGORY
     */
    categoryId: product.categoryId,

    categoryName: product.categoryName || "Chưa phân loại",

    /*
     * UI STATUS
     */
    status: normalizeProductStatus(product.status),

    /*
     * Giữ raw status
     * nếu sau này cần.
     */
    productStatus: product.status,
  };
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
  // DINE IN:
  // Backend
  //
  // TAKE AWAY / DELIVERY:
  // Mock
  // ==================================================

  const [orders, setOrders] = useState(INITIAL_VIRTUAL_ORDERS);

  // ==================================================
  // MENU
  // TẠM THỜI MOCK
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
         * Filter thêm lần nữa
         * để phòng dữ liệu lỗi.
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
     * Chỉ bàn OCCUPIED mới cần
     * lấy Active Order.
     *
     * AVAILABLE không gọi API
     * để tránh nhận 404.
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
    // SUCCESSFUL ORDERS
    // =========================

    const activeOrders = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        activeOrders.push(result.value.order);

        return;
      }

      /*
       * Có trường hợp DB/table
       * đang OCCUPIED nhưng
       * không có active Order.
       *
       * Không toast từng bàn
       * để tránh spam giao diện.
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
    // Virtual orders
    // +
    // Dine-in orders từ Backend
    // =========================

    setOrders([...INITIAL_VIRTUAL_ORDERS, ...activeOrders]);

    // =========================
    // ENRICH TABLE DATA
    //
    // Thêm:
    //
    // itemCount
    // currentTotal
    // currentOrderId
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
  // THEN LOAD ACTIVE ORDERS
  // ==================================================

  const loadTables = useCallback(async () => {
    try {
      // =========================
      // START
      // =========================

      setTablesLoading(true);

      setTablesError(null);

      // =========================
      // GET TABLES
      // =========================

      const response = await waiterTableService.getAll({
        page: 0,

        size: 50,
      });

      console.log("GET TABLES RESPONSE:", response);

      // =========================
      // PAGE DATA
      // =========================

      const pageData = response?.data;

      const tableList = pageData?.content || pageData?.items || [];

      // =========================
      // NORMALIZE TABLES
      // =========================

      const normalizedTables = tableList.map(normalizeTable);

      console.log("NORMALIZED TABLES:", normalizedTables);

      // =========================
      // SET TABLE FIRST
      // =========================

      setTables(normalizedTables);

      // =========================
      // LOAD ORDERS
      // FOR OCCUPIED TABLES
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
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadTables();
  }, [loadTables]);

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
  // HIỆN TẠI CHƯA NỐI POST API.
  //
  // PHẦN NÀY VẪN UPDATE LOCAL STATE
  // NHƯ CODE CŨ CỦA BẠN.
  // ==================================================

  const sendToKitchen = ({ orderType, tableNumber, guestCount, cartItems }) => {
    // =========================
    // VALIDATE
    // =========================

    if (!cartItems || cartItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một món trước khi gửi bếp.");

      return null;
    }

    /*
     * Hiện tại WaiterDashboard
     * truyền table.id vào
     * property tableNumber.
     *
     * Nên tạm convert lại.
     */
    const tableId = tableNumber;

    // =========================
    // FIND EXISTING ORDER
    // =========================

    const existingOrder = findActiveOrder(orderType, tableId);

    // =========================
    // NEW ITEMS
    // =========================

    const newOrderItems = cartItems.map((item, index) => ({
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

    // ==================================================
    // EXISTING ORDER
    // GỌI THÊM
    // ==================================================

    if (existingOrder) {
      const combinedItems = [...existingOrder.items, ...newOrderItems];

      const subtotal = combinedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      /*
       * Backend hiện chưa xử lý VAT
       * trong Order.totalPrice.
       *
       * Tạm thời local vẫn giữ
       * logic UI cũ.
       */
      const vatAmount = Math.round(subtotal * 0.08);

      const totalAmount = subtotal + vatAmount;

      const updatedOrder = {
        ...existingOrder,

        items: combinedItems,

        subtotal,

        vatAmount,

        totalAmount,

        status: "cooking",

        progressPercentage: 40,

        progressLabel: "Đang chế biến",
      };

      // =========================
      // UPDATE ORDER
      // =========================

      setOrders((prev) =>
        prev.map((order) =>
          order.id === existingOrder.id ? updatedOrder : order,
        ),
      );

      // =========================
      // UPDATE TABLE
      // =========================

      if (orderType === "dine_in") {
        setTables((prev) =>
          prev.map((table) => {
            if (table.id !== tableId) {
              return table;
            }

            return {
              ...table,

              status: "occupied",

              guestCount,

              itemCount: combinedItems.reduce(
                (sum, item) => sum + item.quantity,
                0,
              ),

              currentTotal: totalAmount,

              currentOrderId: existingOrder.id,
            };
          }),
        );
      }

      const selectedTable = tables.find((table) => table.id === tableId);

      toast.success(
        orderType === "dine_in"
          ? `Đã gửi thêm món xuống bếp cho Bàn ${
              selectedTable?.number || tableId
            }.`
          : "Đã gửi thêm món xuống bếp.",
      );

      return updatedOrder;
    }

    // ==================================================
    // CREATE NEW LOCAL ORDER
    //
    // TẠM THỜI CHƯA NỐI POST /api/orders
    // ==================================================

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
      const selectedTable = tables.find((table) => table.id === tableId);

      tableName = selectedTable
        ? `Bàn ${selectedTable.number}`
        : `Bàn ${tableId}`;
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

      tableId: orderType === "dine_in" ? tableId : null,

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

    // =========================
    // TABLE -> OCCUPIED
    // =========================

    if (orderType === "dine_in") {
      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== tableId) {
            return table;
          }

          return {
            ...table,

            status: "occupied",

            guestCount,

            itemCount: newOrderItems.reduce(
              (sum, item) => sum + item.quantity,
              0,
            ),

            currentTotal: totalAmount,

            currentOrderId: newOrder.id,
          };
        }),
      );
    }

    toast.success("Đã tạo đơn và gửi xuống bếp thành công.");

    return newOrder;
  };

  // ==================================================
  // REQUEST PAYMENT
  // TẠM THỜI LOCAL
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
    // TABLE
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
