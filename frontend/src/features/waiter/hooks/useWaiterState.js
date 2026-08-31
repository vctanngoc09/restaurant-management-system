import { useCallback, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import waiterMenuService from "../services/waiterMenuService";
import waiterTableService from "../services/waiterTableService";
import waiterOrderService from "../services/waiterOrderService";

// ==================================================
// TABLE STATUS
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
// TABLE
// ==================================================

function normalizeTable(table) {
  return {
    id: table.id,

    number: table.tableNumber,

    status: normalizeTableStatus(table.status),

    areaId: table.areaId,

    areaName: table.areaName || "Chưa phân khu",

    qrToken: table.qrToken,

    guestCount: 0,

    itemCount: 0,

    currentTotal: 0,

    currentOrderId: null,
  };
}

// ==================================================
// ORDER STATUS
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
// ORDER ITEM STATUS
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
// ORDER ITEM
// ==================================================

function normalizeOrderItem(item) {
  const itemStatus = normalizeOrderItemStatus(item.status);

  return {
    id: item.id,

    productId: item.productId,

    menuItemId: item.productId,

    name: item.productName,

    price: Number(item.price) || 0,

    quantity: Number(item.quantity) || 0,

    lineTotal:
      Number(item.lineTotal) || Number(item.price) * Number(item.quantity),

    note: item.note || "",

    status: itemStatus,

    kdsStatus: itemStatus,
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
// ORDER
// ==================================================

function normalizeOrder(order) {
  const items = Array.isArray(order?.items)
    ? order.items.map(normalizeOrderItem)
    : [];

  const orderStatus = normalizeOrderStatus(order?.status);

  const totalPrice = Number(order?.totalPrice) || 0;

  return {
    id: order.id,

    createdAt: order.createdAt,

    orderType: "dine_in",

    status: orderStatus,

    note: order.note || "",

    // ==================================================
    // TABLE
    // ==================================================

    tableId: order.tableId,

    tableNumber: order.tableNumber,

    tableName: `Bàn ${order.tableNumber || ""}`,

    // ==================================================
    // STAFF
    // ==================================================

    staffId: order.staffId,

    staffName: order.staffName,

    waiterName: order.staffName || "Phục vụ",

    // ==================================================
    // ITEMS
    // ==================================================

    items,

    // ==================================================
    // TOTAL
    //
    // Backend totalPrice hiện là tổng món.
    // ==================================================

    subtotal: totalPrice,

    vatAmount: 0,

    totalAmount: totalPrice,

    // ==================================================
    // PROGRESS
    // ==================================================

    progressPercentage: getProgressPercentage(orderStatus),

    progressLabel: getProgressLabel(orderStatus),
  };
}

// ==================================================
// PRODUCT STATUS
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
// MENU ITEM
// ==================================================

function normalizeMenuItem(product) {
  return {
    id: product.id,

    name: product.name,

    price: Number(product.price) || 0,

    urlImg: product.urlImg || null,

    categoryId: product.categoryId,

    categoryName: product.categoryName || "Chưa phân loại",

    status: normalizeProductStatus(product.status),

    productStatus: product.status,
  };
}

// ==================================================
// CART -> BACKEND ITEM REQUEST
// ==================================================

function buildOrderItemsRequest(cartItems) {
  return cartItems.map((item) => ({
    productId: item.menuItem.id,

    quantity: item.quantity,

    note: item.note?.trim() || null,
  }));
}

// ==================================================
// WAITER STATE
// ==================================================

function useWaiterState() {
  // ==================================================
  // TABLE
  // ==================================================

  const [tables, setTables] = useState([]);

  const [tablesLoading, setTablesLoading] = useState(true);

  const [tablesError, setTablesError] = useState(null);

  // ==================================================
  // ORDERS
  //
  // WAITER:
  // DINE_IN ONLY
  // ==================================================

  const [orders, setOrders] = useState([]);

  // ==================================================
  // MENU
  // ==================================================

  const [menuItems, setMenuItems] = useState([]);

  const [menuLoading, setMenuLoading] = useState(true);

  const [menuError, setMenuError] = useState(null);

  // ==================================================
  // PREVENT DOUBLE SUBMIT
  // ==================================================

  const sendingRef = useRef(false);

  // ==================================================
  // LOAD MENU
  // ==================================================

  const loadMenu = useCallback(async () => {
    try {
      setMenuLoading(true);

      setMenuError(null);

      const response = await waiterMenuService.getAll();

      const productList = Array.isArray(response?.data) ? response.data : [];

      const normalizedMenu = productList

        .map(normalizeMenuItem)

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
  // LOAD ACTIVE DINE IN ORDERS
  // ==================================================

  const loadActiveOrders = useCallback(async (currentTables) => {
    const occupiedTables = currentTables.filter(
      (table) => table.status === "occupied",
    );

    // ==================================================
    // NO OCCUPIED TABLE
    // ==================================================

    if (occupiedTables.length === 0) {
      setOrders([]);

      return {
        orders: [],
        tables: currentTables,
      };
    }

    // ==================================================
    // CALL ACTIVE ORDER API
    // ==================================================

    const results = await Promise.allSettled(
      occupiedTables.map(async (table) => {
        const response = await waiterOrderService.getActiveByTable(table.id);

        return {
          tableId: table.id,

          order: normalizeOrder(response.data),
        };
      }),
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    const activeOrders = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        activeOrders.push(result.value.order);

        return;
      }

      const table = occupiedTables[index];

      console.warn(
        `Không lấy được active order của bàn ${table.number}:`,
        result.reason,
      );
    });

    setOrders(activeOrders);

    // ==================================================
    // ENRICH TABLE
    // ==================================================

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
  // ==================================================

  const loadTables = useCallback(async () => {
    try {
      setTablesLoading(true);

      setTablesError(null);

      const response = await waiterTableService.getAll({
        page: 0,
        size: 50,
      });

      const pageData = response?.data;

      const tableList = pageData?.content || pageData?.items || [];

      const normalizedTables = tableList.map(normalizeTable);

      setTables(normalizedTables);

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
  //
  // Giữ signature cũ để
  // WaiterDashboard chưa cần sửa.
  // ==================================================

  const findActiveOrder = (orderType, tableId) => {
    if (orderType !== "dine_in") {
      return null;
    }

    return orders.find(
      (order) =>
        order.orderType === "dine_in" &&
        order.tableId === tableId &&
        order.status !== "completed" &&
        order.status !== "cancelled",
    );
  };

  // ==================================================
  // SYNC ORDER -> UI STATE
  // ==================================================

  const syncOrderState = (updatedOrder, tableId) => {
    setOrders((prev) => [
      updatedOrder,

      ...prev.filter((order) => order.id !== updatedOrder.id),
    ]);

    const itemCount = updatedOrder.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    setTables((prev) =>
      prev.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        return {
          ...table,

          status: "occupied",

          itemCount,

          currentTotal: updatedOrder.totalAmount,

          currentOrderId: updatedOrder.id,
        };
      }),
    );
  };

  // ==================================================
  // SEND TO KITCHEN
  //
  // WAITER = DINE_IN ONLY
  // ==================================================

  const sendToKitchen = async ({
    orderType,

    tableNumber,

    cartItems,

    orderNote,
  }) => {
    // ==================================================
    // ROLE GUARD
    // ==================================================

    if (orderType !== "dine_in") {
      toast.error("Nhân viên phục vụ chỉ được tạo đơn tại bàn.");

      return null;
    }

    // ==================================================
    // VALIDATE TABLE
    // ==================================================

    /*
     * tableNumber trong
     * WaiterDashboard hiện đang
     * chứa table.id.
     */
    const tableId = tableNumber;

    if (!tableId) {
      toast.error("Không xác định được bàn.");

      return null;
    }

    // ==================================================
    // VALIDATE CART
    // ==================================================

    if (!cartItems || cartItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một món.");

      return null;
    }

    // ==================================================
    // PREVENT DOUBLE CLICK
    // ==================================================

    if (sendingRef.current) {
      return null;
    }

    sendingRef.current = true;

    try {
      const existingOrder = findActiveOrder(orderType, tableId);

      const items = buildOrderItemsRequest(cartItems);

      // ==================================================
      // EXISTING ORDER
      //
      // CREATE NEW KITCHEN TICKET
      // BACKEND tự xử lý.
      // ==================================================

      if (existingOrder) {
        const response = await waiterOrderService.addItemsToOrder(
          existingOrder.id,
          items,
        );

        const updatedOrder = normalizeOrder(response.data);

        syncOrderState(updatedOrder, tableId);

        const selectedTable = tables.find((table) => table.id === tableId);

        toast.success(
          `Đã gọi thêm món cho Bàn ${selectedTable?.number || tableId}.`,
        );

        return updatedOrder;
      }

      // ==================================================
      // CREATE NEW DINE IN ORDER
      // ==================================================

      const request = {
        orderType: "DINE_IN",

        tableId,

        note: orderNote?.trim() || null,

        items,
      };

      const response = await waiterOrderService.createOrder(request);

      const createdOrder = normalizeOrder(response.data);

      syncOrderState(createdOrder, tableId);

      const selectedTable = tables.find((table) => table.id === tableId);

      toast.success(
        `Đã tạo đơn cho Bàn ${selectedTable?.number || tableId} thành công.`,
      );

      return createdOrder;
    } catch (error) {
      console.error("WAITER ORDER ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Không thể gửi đơn xuống bếp.";

      toast.error(message);

      return null;
    } finally {
      sendingRef.current = false;
    }
  };

  // ==================================================
  // SERVE ORDER ITEM
  //
  // READY -> SERVED
  // ==================================================

  const serveItem = async (orderItemId) => {
    if (!orderItemId) {
      return null;
    }

    try {
      const response = await waiterOrderService.serveItem(orderItemId);

      const updatedOrder = normalizeOrder(response.data);

      // ==================================================
      // UPDATE ORDER STATE
      // ==================================================

      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );

      // ==================================================
      // UPDATE TABLE SUMMARY
      // ==================================================

      setTables((prev) =>
        prev.map((table) => {
          if (table.id !== updatedOrder.tableId) {
            return table;
          }

          return {
            ...table,

            itemCount: updatedOrder.items.reduce(
              (total, item) => total + item.quantity,
              0,
            ),

            currentTotal: updatedOrder.totalAmount,

            currentOrderId: updatedOrder.id,
          };
        }),
      );

      toast.success("Đã xác nhận món được phục vụ.");

      return updatedOrder;
    } catch (error) {
      console.error("SERVE ITEM ERROR:", error);

      toast.error(
        error.response?.data?.message || "Không thể xác nhận phục vụ món.",
      );

      return null;
    }
  };

  // ==================================================
  // REQUEST PAYMENT
  //
  // Backend API chưa làm.
  //
  // Không fake trạng thái local nữa,
  // vì refresh trang sẽ bị sai dữ liệu.
  // ==================================================

  const requestPayment = async (orderId) => {
    // ==================================================
    // VALIDATE ID
    // ==================================================

    if (!orderId) {
      toast.warning("Chưa có đơn hàng để yêu cầu thanh toán.");
      return null;
    }

    // ==================================================
    // FIND CURRENT ORDER
    // ==================================================

    const currentOrder = orders.find(
      (order) => String(order.id) === String(orderId),
    );

    if (!currentOrder) {
      toast.error("Không tìm thấy đơn hàng.");
      return null;
    }

    // ==================================================
    // DINE IN ONLY
    // ==================================================

    if (currentOrder.orderType !== "dine_in") {
      toast.warning("Chỉ đơn tại bàn mới có thể yêu cầu thanh toán.");
      return null;
    }

    // ==================================================
    // ALREADY WAITING PAYMENT
    // ==================================================

    if (currentOrder.status === "pending_payment") {
      toast.info("Đơn hàng đã ở trạng thái chờ thanh toán.");
      return currentOrder;
    }

    // ==================================================
    // PROCESSING ONLY
    //
    // Backend PROCESSING
    // ->
    // frontend cooking
    // ==================================================

    if (currentOrder.status !== "cooking") {
      toast.warning(
        "Đơn hàng phải đang trong trạng thái xử lý mới có thể yêu cầu thanh toán.",
      );

      return null;
    }

    // ==================================================
    // ALL ITEMS MUST BE SERVED
    // ==================================================

    const allServed =
      currentOrder.items.length > 0 &&
      currentOrder.items.every((item) => item.status === "served");

    if (!allServed) {
      toast.warning(
        "Vui lòng phục vụ tất cả món trước khi yêu cầu thanh toán.",
      );

      return null;
    }

    // ==================================================
    // CALL API
    // ==================================================

    try {
      const response = await waiterOrderService.requestPayment(orderId);

      // response:
      //
      // {
      //   status: 200,
      //   message: "...",
      //   data: OrderResponse
      // }

      const updatedOrder = normalizeOrder(response?.data);

      if (!updatedOrder) {
        throw new Error(
          "Backend không trả về thông tin đơn hàng sau khi yêu cầu thanh toán.",
        );
      }

      // ==================================================
      // UPDATE ORDER + TABLE
      //
      // Dùng helper đang có sẵn trong hook.
      // ==================================================

      syncOrderState(updatedOrder, updatedOrder.tableId);

      // ==================================================
      // SUCCESS
      // ==================================================

      toast.success(
        response?.message || "Đã gửi yêu cầu thanh toán tới thu ngân.",
      );

      return updatedOrder;
    } catch (error) {
      console.error("REQUEST PAYMENT ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Không thể gửi yêu cầu thanh toán.";

      toast.error(message);

      return null;
    }
  };

  // ==================================================
  // RETURN
  // ==================================================

  return {
    // TABLE

    tables,

    tablesLoading,

    tablesError,

    reloadTables: loadTables,

    // ORDER

    orders,

    findActiveOrder,

    sendToKitchen,

    serveItem,

    requestPayment,

    // MENU

    menuItems,

    menuLoading,

    menuError,

    reloadMenu: loadMenu,
  };
}

export default useWaiterState;
