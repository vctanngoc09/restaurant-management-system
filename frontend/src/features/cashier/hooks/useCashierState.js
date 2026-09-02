import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import cashierMenuService from "../services/cashierMenuService";
import cashierTableService from "../services/cashierTableService";
import cashierOrderService from "../services/cashierOrderService";

import restaurantSettingService from "../../../services/restaurantSettingService";

import promotionService from "../../../services/promotionService";

// ==================================================
// NORMALIZE PRODUCT STATUS
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
// NORMALIZE MENU ITEM
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
// NORMALIZE TABLE STATUS
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
// NORMALIZE AREA
// ==================================================

function normalizeArea(areaName) {
  const value = areaName?.trim().toLowerCase() || "";

  if (value.includes("ngoài")) {
    return "outdoor";
  }

  return "indoor";
}

// ==================================================
// NORMALIZE TABLE
// ==================================================

function normalizeTable(table) {
  return {
    id: table.id,

    number: table.tableNumber,

    status: normalizeTableStatus(table.status),

    areaId: table.areaId,

    areaName: table.areaName || "Chưa phân khu",

    area: normalizeArea(table.areaName),

    qrToken: table.qrToken,

    // Backend chưa có guestCount.
    guestCount: table.guestCount || 0,

    itemCount: 0,

    currentTotal: 0,

    currentOrderId: null,

    activeOrder: null,
  };
}

// ==================================================
// NORMALIZE ORDER STATUS
// ==================================================

function normalizeOrderStatus(status) {
  switch (status) {
    case "PENDING":
      return "new";

    case "PROCESSING":
      return "cooking";

    case "AWAITING_PAYMENT":
      return "pending_payment";

    case "COMPLETED":
      return "completed";

    case "CANCELLED":
      return "cancelled";

    default:
      return status?.toLowerCase() || "new";
  }
}

// ==================================================
// NORMALIZE ORDER TYPE
// ==================================================

function normalizeOrderType(type) {
  switch (type) {
    case "DINE_IN":
      return "dine_in";

    case "TAKE_AWAY":
      return "take_away";

    case "DELIVERY":
      return "delivery";

    default:
      return type?.toLowerCase() || "dine_in";
  }
}

// ==================================================
// NORMALIZE ORDER ITEM
// ==================================================

function normalizeOrderItem(item) {
  const price = Number(item?.price) || 0;

  const quantity = Number(item?.quantity) || 0;

  return {
    id: item?.id,

    productId: item?.productId,

    menuItemId: item?.productId,

    name: item?.productName || "Món ăn",

    price,

    quantity,

    note: item?.note || "",

    status: item?.status?.toLowerCase() || "pending",

    lineTotal: Number(item?.lineTotal) || price * quantity,
  };
}

// ==================================================
// BUILD ORDER PROGRESS
// ==================================================

function getOrderProgress(status) {
  switch (status) {
    case "new":
      return {
        progressPercentage: 20,
        progressLabel: "20% Mới tạo",
      };

    case "cooking":
      return {
        progressPercentage: 60,
        progressLabel: "60% Đang xử lý",
      };

    case "pending_payment":
      return {
        progressPercentage: 90,
        progressLabel: "90% Chờ thanh toán",
      };

    case "completed":
      return {
        progressPercentage: 100,
        progressLabel: "100% Hoàn thành",
      };

    case "cancelled":
      return {
        progressPercentage: 0,
        progressLabel: "Đã hủy",
      };

    default:
      return {
        progressPercentage: 10,
        progressLabel: "10% Mới tạo",
      };
  }
}

// ==================================================
// NORMALIZE ORDER
// ==================================================

function normalizeOrder(order) {
  if (!order) {
    return null;
  }

  const items = Array.isArray(order.items)
    ? order.items.map(normalizeOrderItem)
    : [];

  const totalPrice = Number(order.totalPrice) || 0;

  const orderType = normalizeOrderType(order.orderType);

  const status = normalizeOrderStatus(order.status);

  const { progressPercentage, progressLabel } = getOrderProgress(status);

  let orderPrefix = "DI";

  if (orderType === "take_away") {
    orderPrefix = "TA";
  }

  if (orderType === "delivery") {
    orderPrefix = "DL";
  }

  return {
    // ==================================================
    // IDS
    // ==================================================

    id: `#${orderPrefix}${String(order.id).padStart(3, "0")}`,

    backendId: order.id,

    // ==================================================
    // GENERAL
    // ==================================================

    createdAt: order.createdAt,

    orderType,

    status,

    progressPercentage,

    progressLabel,

    note: order.note || "",

    // ==================================================
    // TABLE
    // ==================================================

    tableId: order.tableId,

    tableNumber: order.tableNumber,

    tableName: order.tableNumber
      ? `Bàn ${order.tableNumber}`
      : orderType === "take_away"
        ? "Mang về"
        : orderType === "delivery"
          ? "Giao hàng"
          : "Tại chỗ",

    // ==================================================
    // STAFF
    // ==================================================

    waiterName: order.staffName || "Chưa xác định",

    staffName: order.staffName || "Chưa xác định",

    staffId: order.staffId,

    // ==================================================
    // CUSTOMER
    // ==================================================

    customerName: order.shippingDetail?.customerName || "",

    shippingDetail: order.shippingDetail || null,

    // Backend hiện chưa có.
    guestCount: order.guestCount || 0,

    // ==================================================
    // MONEY
    //
    // Backend totalPrice hiện là
    // tổng tiền items.
    // ==================================================

    subtotal: totalPrice,

    vatAmount: 0,

    totalAmount: totalPrice,

    // ==================================================
    // ITEMS
    // ==================================================

    items,
  };
}

// ==================================================
// BUILD ORDER ITEM REQUEST
//
// ĐẶT NGOÀI normalizeOrder()
// ==================================================

function buildOrderItemsRequest(cartItems) {
  return cartItems.map((item) => ({
    productId: item.menuItem.id,

    quantity: item.quantity,

    note: item.note?.trim() || null,
  }));
}

// ==================================================
// FRONTEND TYPE -> BACKEND TYPE
//
// ĐẶT NGOÀI normalizeOrder()
// ==================================================

function toBackendOrderType(orderType) {
  switch (orderType) {
    case "dine_in":
      return "DINE_IN";

    case "take_away":
      return "TAKE_AWAY";

    case "delivery":
      return "DELIVERY";

    default:
      return null;
  }
}

// ==================================================
// CASHIER STATE
// ==================================================

const useCashierState = () => {
  // ==================================================
  // TAB
  // ==================================================

  const [activeTab, setActiveTab] = useState("tables");

  // ==================================================
  // TABLE
  // ==================================================

  const [tables, setTables] = useState([]);

  const [tablesLoading, setTablesLoading] = useState(true);

  const [tablesError, setTablesError] = useState(null);

  // ==================================================
  // ORDERS
  // ==================================================

  const [orders, setOrders] = useState([]);

  // ==================================================
  // MENU
  // ==================================================

  const [menuItems, setMenuItems] = useState([]);

  const [menuLoading, setMenuLoading] = useState(true);

  const [menuError, setMenuError] = useState(null);

  // ==================================================
  // RESTAURANT SETTING
  // ==================================================

  const [restaurantSetting, setRestaurantSetting] = useState(null);

  // ==================================================
  // PROMOTIONS
  // ==================================================

  const [promotions, setPromotions] = useState([]);

  // ==================================================
  // MODAL
  // ==================================================

  const [activeModal, setActiveModal] = useState("none");

  const [selectedTable, setSelectedTable] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [billingPreparing, setBillingPreparing] = useState(false);

  // ==================================================
  // SELECTED RECEIPT
  // ==================================================

  // ==================================================
  // DRAFT
  // ==================================================

  const [draftOrderType, setDraftOrderType] = useState("dine_in");

  const [draftGuestCount, setDraftGuestCount] = useState(2);

  const [draftShippingDetail, setDraftShippingDetail] = useState(null);

  const loadRestaurantSetting = useCallback(async () => {
    try {
      const response = await restaurantSettingService.getCurrent();

      setRestaurantSetting(response?.data || null);
    } catch (error) {
      console.error("LOAD RESTAURANT SETTING ERROR:", error);

      toast.error(
        error.response?.data?.message || "Không thể tải cấu hình nhà hàng.",
      );
    }
  }, []);

  const loadPromotions = useCallback(async () => {
    try {
      const response = await promotionService.getAll();

      const list = Array.isArray(response?.data) ? response.data : [];

      setPromotions(list);
    } catch (error) {
      console.error("LOAD PROMOTIONS ERROR:", error);

      setPromotions([]);
    }
  }, []);
  // ==================================================
  // LOAD ACTIVE DINE-IN ORDERS
  // ==================================================

  const loadActiveOrders = useCallback(async (currentTables) => {
    const occupiedTables = currentTables.filter(
      (table) => table.status === "occupied",
    );

    // ==================================================
    // NO OCCUPIED TABLE
    // ==================================================

    if (occupiedTables.length === 0) {
      /*
       * Chỉ xóa dine-in.
       *
       * Không xóa TAKE_AWAY
       * đã load từ API.
       */
      setOrders((prev) =>
        prev.filter((order) => order.orderType !== "dine_in"),
      );

      setTables(currentTables);

      return;
    }

    // ==================================================
    // LOAD ACTIVE ORDER FOR EACH TABLE
    // ==================================================

    const results = await Promise.allSettled(
      occupiedTables.map(async (table) => {
        const response = await cashierOrderService.getActiveByTable(table.id);

        const order = normalizeOrder(response?.data);

        return {
          tableId: table.id,

          order,
        };
      }),
    );

    // ==================================================
    // BUILD ORDERS
    // ==================================================

    const activeOrders = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.order) {
        activeOrders.push(result.value.order);

        return;
      }

      const table = occupiedTables[index];

      console.warn(
        `Không lấy được active order của bàn ${table.number}:`,
        result.status === "rejected" ? result.reason : "Order rỗng",
      );
    });

    // ==================================================
    // REPLACE ONLY DINE-IN
    // ==================================================

    setOrders((prev) => [
      ...activeOrders,

      ...prev.filter((order) => order.orderType !== "dine_in"),
    ]);

    // ==================================================
    // ENRICH TABLE
    // ==================================================

    const updatedTables = currentTables.map((table) => {
      const activeOrder = activeOrders.find(
        (order) => String(order.tableId) === String(table.id),
      );

      if (!activeOrder) {
        return {
          ...table,

          itemCount: 0,

          currentTotal: 0,

          currentOrderId: null,

          activeOrder: null,
        };
      }

      const itemCount = activeOrder.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );

      return {
        ...table,

        status: "occupied",

        itemCount,

        currentTotal: activeOrder.totalAmount,

        currentOrderId: activeOrder.id,

        activeOrder,
      };
    });

    setTables(updatedTables);
  }, []);

  // ==================================================
  // LOAD ACTIVE TAKE AWAY
  //
  // GET
  // /api/cashier/orders/type/TAKE_AWAY/active
  // ==================================================

  const loadTakeAwayOrders = useCallback(async () => {
    try {
      const [takeAwayResult, deliveryResult] = await Promise.allSettled([
        cashierOrderService.getActiveByType("TAKE_AWAY"),

        cashierOrderService.getActiveByType("DELIVERY"),
      ]);

      const takeAwayList =
        takeAwayResult.status === "fulfilled" &&
        Array.isArray(takeAwayResult.value?.data)
          ? takeAwayResult.value.data
          : [];

      const deliveryList =
        deliveryResult.status === "fulfilled" &&
        Array.isArray(deliveryResult.value?.data)
          ? deliveryResult.value.data
          : [];

      const normalizedOrders = [...takeAwayList, ...deliveryList]
        .map(normalizeOrder)
        .filter(Boolean);

      setOrders((prev) => [
        ...prev.filter(
          (order) =>
            order.orderType !== "take_away" && order.orderType !== "delivery",
        ),

        ...normalizedOrders,
      ]);
    } catch (error) {
      console.error("LOAD TAKE AWAY / DELIVERY ORDERS ERROR:", error);
    }
  }, []);

  // ==================================================
  // LOAD MENU
  // ==================================================

  const loadMenu = useCallback(async () => {
    try {
      setMenuLoading(true);

      setMenuError(null);

      const response = await cashierMenuService.getAll();

      const productList = Array.isArray(response?.data) ? response.data : [];

      const normalizedMenu = productList
        .map(normalizeMenuItem)
        .filter((item) => item.productStatus !== "INACTIVE");

      setMenuItems(normalizedMenu);
    } catch (error) {
      console.error("LOAD CASHIER MENU ERROR:", error);

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
  // LOAD TABLES
  // ==================================================

  const loadTables = useCallback(async () => {
    try {
      setTablesLoading(true);

      setTablesError(null);

      const response = await cashierTableService.getAll({
        page: 0,
        size: 50,
      });

      const pageData = response?.data;

      const tableList = Array.isArray(pageData)
        ? pageData
        : pageData?.content || pageData?.items || [];

      const normalizedTables = tableList
        .map(normalizeTable)
        .filter((table) => table.status !== "inactive");

      setTables(normalizedTables);

      await loadActiveOrders(normalizedTables);
    } catch (error) {
      console.error("LOAD CASHIER TABLES ERROR:", error);

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

    loadMenu();

    loadTakeAwayOrders();

    loadRestaurantSetting();

    loadPromotions();
  }, [
    loadTables,
    loadMenu,
    loadTakeAwayOrders,
    loadRestaurantSetting,
    loadPromotions,
  ]);

  // ==================================================
  // CLOSE MODAL
  // ==================================================

  const closeModal = () => {
    setActiveModal("none");

    setBillingPreparing(false);
  };

  // ==================================================
  // OPEN NEW ORDER
  // ==================================================

  const openNewOrder = () => {
    setSelectedTable(null);

    setSelectedOrder(null);

    setDraftOrderType("dine_in");

    setDraftGuestCount(2);

    setActiveModal("newOrder");

    setDraftShippingDetail(null);
  };

  // ==================================================
  // START NEW ORDER
  //
  // NewOrderModal
  // ->
  // OrderingModal
  // ==================================================

  const startNewOrder = ({
    orderType,
    tableId = null,
    guestCount = 1,
    shippingDetail = null,
  }) => {
    setDraftOrderType(orderType);

    setDraftGuestCount(guestCount);

    setDraftShippingDetail(shippingDetail);

    setSelectedOrder(null);

    if (orderType === "dine_in") {
      const table = tables.find((item) => String(item.id) === String(tableId));

      if (!table) {
        toast.error("Không tìm thấy bàn đã chọn.");

        return;
      }

      if (table.status !== "empty") {
        toast.warning(`Bàn ${table.number} hiện không còn trống.`);

        return;
      }

      setSelectedTable(table);
    } else {
      setSelectedTable(null);
    }

    setActiveModal("ordering");
  };

  // ==================================================
  // OPEN TABLE
  // ==================================================

  const openTable = (table) => {
    // Không mở bàn maintenance/inactive.
    if (table.status === "maintenance" || table.status === "inactive") {
      toast.warning(`Bàn ${table.number} hiện không khả dụng.`);

      return;
    }

    setSelectedTable(table);

    // ==================================================
    // EMPTY TABLE
    // ==================================================

    if (table.status !== "occupied") {
      setSelectedOrder(null);

      setDraftOrderType("dine_in");

      setDraftGuestCount(table.guestCount || 2);

      setActiveModal("ordering");

      return;
    }

    // ==================================================
    // FIND ACTIVE ORDER
    // ==================================================

    const order =
      table.activeOrder ||
      orders.find(
        (item) =>
          item.status !== "completed" &&
          String(item.tableId) === String(table.id),
      );

    if (!order) {
      toast.error(`Không tìm thấy đơn đang hoạt động của bàn ${table.number}.`);

      return;
    }

    setSelectedOrder(order);

    setDraftOrderType("dine_in");

    setDraftGuestCount(order.guestCount || table.guestCount || 2);

    // ==================================================
    // WAITING PAYMENT
    // ==================================================

    if (order.status === "pending_payment") {
      setActiveModal("billing");

      return;
    }

    // ==================================================
    // PENDING / PROCESSING
    // ==================================================

    if (order.status === "new" || order.status === "cooking") {
      setActiveModal("ordering");

      return;
    }

    toast.warning("Trạng thái đơn hiện tại không cho phép gọi thêm món.");
  };

  // ==================================================
  // OPEN QUICK CHANNEL
  //
  // TAKE AWAY / DELIVERY
  // ==================================================

  const openQuickChannel = (orderType) => {
    // ==================================================
    // RESET OLD SELECTION
    // ==================================================

    setSelectedTable(null);

    setSelectedOrder(null);

    setDraftOrderType(orderType);

    setDraftGuestCount(1);

    setDraftShippingDetail(null);

    // ==================================================
    // TAKE AWAY
    // ==================================================

    if (orderType === "take_away") {
      setActiveModal("ordering");

      return;
    }

    // ==================================================
    // DELIVERY
    //
    // cần nhập:
    // customerName
    // phone
    // address
    // ...
    // ==================================================

    if (orderType === "delivery") {
      setActiveModal("newOrder");

      return;
    }

    toast.warning("Loại đơn hàng không hợp lệ.");
  };

  // ==================================================
  // OPEN ORDER DETAIL
  // ==================================================

  const openOrderDetails = (order) => {
    if (!order) {
      toast.warning("Không tìm thấy đơn hàng.");

      return;
    }

    setSelectedOrder(order);

    // ==================================================
    // TABLE
    // ==================================================

    if (order.tableId) {
      const table = tables.find(
        (item) => String(item.id) === String(order.tableId),
      );

      setSelectedTable(table || null);
    } else {
      setSelectedTable(null);
    }

    setDraftOrderType(order.orderType);

    setDraftGuestCount(order.guestCount || 1);

    // ==================================================
    // LUÔN MỞ DETAIL
    //
    // Không tự nhảy sang:
    // - billing
    // - ordering
    // ==================================================

    setActiveModal("orderDetail");
  };

  // ==================================================
  // OPEN ADD ITEMS
  //
  // CashierOrderDetailModal
  // -> Gọi món
  // -> OrderingModal
  // ==================================================

  const openAddItems = (order) => {
    if (!order) {
      toast.warning("Không tìm thấy đơn hàng.");

      return;
    }

    // ==================================================
    // DINE IN ONLY
    // ==================================================

    if (order.orderType !== "dine_in") {
      toast.warning("Chỉ đơn tại bàn mới được gọi thêm món.");

      return;
    }

    // ==================================================
    // WAITING PAYMENT
    // ==================================================

    if (order.status === "pending_payment") {
      toast.warning("Đơn đã yêu cầu thanh toán, không thể gọi thêm món.");

      return;
    }

    // ==================================================
    // STATUS
    // ==================================================

    if (order.status !== "new" && order.status !== "cooking") {
      toast.warning("Trạng thái đơn hiện tại không cho phép gọi thêm món.");

      return;
    }

    // ==================================================
    // SELECT ORDER
    // ==================================================

    setSelectedOrder(order);

    setDraftOrderType("dine_in");

    setDraftGuestCount(order.guestCount || 1);

    // ==================================================
    // TABLE
    // ==================================================

    const table = tables.find(
      (item) => String(item.id) === String(order.tableId),
    );

    if (!table) {
      toast.error("Không tìm thấy bàn của đơn hàng.");

      return;
    }

    setSelectedTable(table);

    // ==================================================
    // OPEN ORDERING
    // ==================================================

    setActiveModal("ordering");
  };

  // ==================================================
  // OPEN BILLING
  // ==================================================

  const openReceipt = (order) => {
    if (!order?.backendId) {
      toast.error("Không tìm thấy mã đơn hàng.");

      return;
    }

    setSelectedOrder(order);

    setActiveModal("receipt");
  };

  // ==================================================
  // OPEN BILLING
  //
  // DINE_IN:
  //
  // CASE 1
  // PROCESSING + ALL SERVED
  // -> mở BillingModal ngay
  // -> PATCH request-payment
  // -> AWAITING_PAYMENT
  //
  // CASE 2
  // AWAITING_PAYMENT
  // -> mở BillingModal luôn
  //
  // TAKE_AWAY / DELIVERY
  // -> không dùng flow này
  // ==================================================

  const openBilling = async (order) => {
    // ==================================================
    // VALIDATE ORDER
    // ==================================================

    if (!order) {
      toast.warning("Không tìm thấy đơn hàng.");

      return;
    }

    // ==================================================
    // DINE IN ONLY
    // ==================================================

    if (order.orderType !== "dine_in") {
      toast.warning("Đơn mang về hoặc giao hàng đã thanh toán trước.");

      return;
    }

    // ==================================================
    // ALL SERVED
    // ==================================================

    const allServed =
      Array.isArray(order.items) &&
      order.items.length > 0 &&
      order.items.every((item) => item.status === "served");

    if (!allServed) {
      toast.warning("Cần phục vụ tất cả món trước khi thanh toán.");

      return;
    }

    // ==================================================
    // SELECT ORDER
    // ==================================================

    setSelectedOrder(order);

    // ==================================================
    // TABLE
    // ==================================================

    if (order.tableId) {
      const table = tables.find(
        (item) => String(item.id) === String(order.tableId),
      );

      setSelectedTable(table || null);
    } else {
      setSelectedTable(null);
    }

    // ==================================================
    // OPEN BILLING IMMEDIATELY
    // ==================================================

    setActiveModal("billing");

    // ==================================================
    // ALREADY AWAITING PAYMENT
    //
    // Waiter đã request trước đó.
    // Không PATCH lần nữa.
    // ==================================================

    if (order.status === "pending_payment") {
      setBillingPreparing(false);

      return;
    }

    // ==================================================
    // MUST BE PROCESSING
    //
    // Frontend:
    // cooking = Backend PROCESSING
    // ==================================================

    if (order.status !== "cooking") {
      setBillingPreparing(false);

      setActiveModal("none");

      toast.warning("Trạng thái đơn hiện tại chưa thể thanh toán.");

      return;
    }

    // ==================================================
    // PROCESSING
    // ->
    // AWAITING_PAYMENT
    // ==================================================

    setBillingPreparing(true);

    try {
      const response = await cashierOrderService.requestPayment(
        order.backendId,
      );

      // ApiResponse<OrderResponse>
      const updatedOrder = normalizeOrder(response?.data);

      if (!updatedOrder) {
        throw new Error("Backend không trả về thông tin đơn hàng.");
      }

      // ==================================================
      // EXPECT AWAITING_PAYMENT
      // ==================================================

      if (updatedOrder.status !== "pending_payment") {
        throw new Error("Đơn hàng chưa chuyển sang trạng thái chờ thanh toán.");
      }

      // ==================================================
      // UPDATE ORDER LIST
      // ==================================================

      setOrders((prev) =>
        prev.map((currentOrder) =>
          String(currentOrder.backendId) === String(updatedOrder.backendId)
            ? updatedOrder
            : currentOrder,
        ),
      );

      // ==================================================
      // UPDATE SELECTED ORDER
      //
      // BillingModal từ đây nhận order:
      // status = pending_payment
      // ==================================================

      setSelectedOrder(updatedOrder);

      // ==================================================
      // UPDATE TABLE ACTIVE ORDER
      // ==================================================

      if (updatedOrder.tableId) {
        const itemCount = updatedOrder.items.reduce(
          (total, item) => total + Number(item.quantity || 0),

          0,
        );

        setTables((prev) =>
          prev.map((table) =>
            String(table.id) === String(updatedOrder.tableId)
              ? {
                  ...table,

                  status: "occupied",

                  itemCount,

                  currentTotal: updatedOrder.totalAmount,

                  currentOrderId: updatedOrder.id,

                  activeOrder: updatedOrder,
                }
              : table,
          ),
        );
      }
    } catch (error) {
      console.error("CASHIER REQUEST PAYMENT ERROR:", error);

      // PATCH thất bại thì không cho
      // tiếp tục thanh toán.
      setActiveModal("none");

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Không thể chuyển đơn sang chờ thanh toán.",
      );
    } finally {
      setBillingPreparing(false);
    }
  };

  // ==================================================
  // SAVE ORDER ITEMS
  //
  // EXISTING DINE-IN
  // -> ADD ITEMS
  //
  // NEW ORDER
  // -> CREATE ORDER
  // ==================================================

  const saveOrderItems = async (cartItems, orderNote = "") => {
    // ==================================================
    // VALIDATE
    // ==================================================

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      toast.warning(
        selectedOrder
          ? "Vui lòng chọn ít nhất một món muốn gọi thêm."
          : "Vui lòng chọn ít nhất một món.",
      );

      return;
    }

    // ==================================================
    // EXISTING ORDER
    //
    // ADD ITEMS - DINE IN ONLY
    // ==================================================

    if (selectedOrder) {
      if (selectedOrder.orderType !== "dine_in") {
        toast.error("Chức năng gọi thêm món chỉ áp dụng cho đơn tại bàn.");

        return;
      }

      // ==================================================
      // WAITING PAYMENT
      // ==================================================

      if (selectedOrder.status === "pending_payment") {
        toast.warning("Đơn đang chờ thanh toán, không thể gọi thêm món.");

        setActiveModal("billing");

        return;
      }

      // ==================================================
      // STATUS VALIDATION
      // ==================================================

      if (
        selectedOrder.status !== "new" &&
        selectedOrder.status !== "cooking"
      ) {
        toast.warning("Trạng thái đơn hiện tại không cho phép gọi thêm món.");

        return;
      }

      const orderId = selectedOrder.backendId;

      if (!orderId) {
        toast.error("Không tìm thấy ID thật của đơn hàng.");

        return;
      }

      const requestItems = buildOrderItemsRequest(cartItems);

      try {
        const response = await cashierOrderService.addItems(
          orderId,
          requestItems,
        );

        const updatedOrder = normalizeOrder(response?.data);

        if (!updatedOrder) {
          throw new Error("Backend không trả về thông tin đơn hàng.");
        }

        // ==================================================
        // UPDATE ORDER LIST
        // ==================================================

        setOrders((prev) =>
          prev.map((order) =>
            String(order.backendId) === String(updatedOrder.backendId)
              ? updatedOrder
              : order,
          ),
        );

        // ==================================================
        // SELECTED ORDER
        // ==================================================

        setSelectedOrder(updatedOrder);

        // ==================================================
        // UPDATE TABLE
        // ==================================================

        if (updatedOrder.tableId) {
          const itemCount = updatedOrder.items.reduce(
            (total, item) => total + item.quantity,
            0,
          );

          setTables((prev) =>
            prev.map((table) =>
              String(table.id) === String(updatedOrder.tableId)
                ? {
                    ...table,

                    status: "occupied",

                    itemCount,

                    currentTotal: updatedOrder.totalAmount,

                    currentOrderId: updatedOrder.id,

                    activeOrder: updatedOrder,
                  }
                : table,
            ),
          );
        }

        toast.success("Gọi thêm món thành công.");

        closeModal();

        return;
      } catch (error) {
        console.error("ADD CASHIER ORDER ITEMS ERROR:", error);

        const message =
          error.response?.data?.message ||
          error.message ||
          "Không thể gọi thêm món.";

        toast.error(message);

        return;
      }
    }

    // ==================================================
    // NEW ORDER
    // ==================================================

    const backendOrderType = toBackendOrderType(draftOrderType);

    if (!backendOrderType) {
      toast.error("Loại đơn hàng không hợp lệ.");

      return;
    }

    // ==================================================
    // DELIVERY
    //
    // Chưa làm trong bước này.
    // ==================================================

    if (draftOrderType === "delivery") {
      toast.info("Đơn giao hàng sẽ được tích hợp ở bước tiếp theo.");

      return;
    }

    // ==================================================
    // DINE IN VALIDATION
    // ==================================================

    if (draftOrderType === "dine_in" && !selectedTable?.id) {
      toast.warning("Vui lòng chọn bàn trước khi tạo đơn.");

      return;
    }

    // ==================================================
    // REQUEST ITEMS
    // ==================================================

    const requestItems = buildOrderItemsRequest(cartItems);

    // ==================================================
    // CREATE REQUEST
    // ==================================================

    const createRequest = {
      orderType: backendOrderType,

      tableId: draftOrderType === "dine_in" ? Number(selectedTable.id) : null,

      note: orderNote?.trim() || null,

      items: requestItems,

      shippingDetail: null,
    };

    console.log("CREATE CASHIER ORDER REQUEST:", createRequest);

    // ==================================================
    // CREATE
    // ==================================================

    try {
      const response = await cashierOrderService.createOrder(createRequest);

      console.log("CREATE CASHIER ORDER RESPONSE:", response);

      const createdOrder = normalizeOrder(response?.data);

      if (!createdOrder) {
        throw new Error("Backend không trả về đơn hàng vừa tạo.");
      }

      // ==================================================
      // ADD INTO ORDER LIST
      // ==================================================

      setOrders((prev) => [
        createdOrder,

        ...prev.filter(
          (order) => String(order.backendId) !== String(createdOrder.backendId),
        ),
      ]);

      // ==================================================
      // DINE IN
      //
      // Backend đã:
      // AVAILABLE -> OCCUPIED
      // Order -> PENDING
      // KitchenTicket -> created
      // ==================================================

      if (createdOrder.orderType === "dine_in") {
        const itemCount = createdOrder.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        setTables((prev) =>
          prev.map((table) =>
            String(table.id) === String(createdOrder.tableId)
              ? {
                  ...table,

                  status: "occupied",

                  itemCount,

                  currentTotal: createdOrder.totalAmount,

                  currentOrderId: createdOrder.id,

                  activeOrder: createdOrder,
                }
              : table,
          ),
        );

        setSelectedOrder(createdOrder);

        toast.success(
          `Đã tạo đơn ${createdOrder.id} cho ${createdOrder.tableName}.`,
        );

        closeModal();

        return;
      }

      // ==================================================
      // TAKE AWAY
      //
      // Backend:
      // AWAITING_PAYMENT
      // ==================================================

      if (createdOrder.orderType === "take_away") {
        setSelectedOrder(createdOrder);

        toast.success(`Đã tạo đơn mang về ${createdOrder.id}.`);

        /*
         * Chuyển qua màn đơn hàng.
         *
         * Payment API làm sau.
         */
        setActiveTab("orders");

        closeModal();

        return;
      }

      closeModal();
    } catch (error) {
      console.error("CREATE CASHIER ORDER ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Không thể tạo đơn hàng.";

      toast.error(message);
    }
  };

  const createPrepaidOrder = async ({
    orderType,
    cartItems,
    orderNote = "",
    shippingDetail = null,
  }) => {
    if (orderType !== "take_away" && orderType !== "delivery") {
      toast.error("Chỉ áp dụng cho đơn mang về hoặc giao hàng.");

      return null;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một món.");

      return null;
    }

    const backendOrderType = toBackendOrderType(orderType);

    const requestItems = buildOrderItemsRequest(cartItems);

    const createRequest = {
      orderType: backendOrderType,

      tableId: null,

      note: orderNote?.trim() || null,

      items: requestItems,

      shippingDetail: orderType === "delivery" ? shippingDetail : null,
    };

    try {
      console.log("CREATE PREPAID ORDER REQUEST:", createRequest);

      const response = await cashierOrderService.createOrder(createRequest);

      const createdOrder = normalizeOrder(response?.data);

      if (!createdOrder) {
        throw new Error("Backend không trả về đơn hàng vừa tạo.");
      }

      // ==============================================
      // Backend phải tạo TAKE_AWAY / DELIVERY
      // ở AWAITING_PAYMENT
      //
      // FE normalize:
      // AWAITING_PAYMENT -> pending_payment
      // ==============================================

      if (createdOrder.status !== "pending_payment") {
        throw new Error("Đơn hàng chưa ở trạng thái chờ thanh toán.");
      }

      // ==============================================
      // UPDATE ORDER LIST
      // ==============================================

      setOrders((prev) => [
        createdOrder,

        ...prev.filter(
          (order) => String(order.backendId) !== String(createdOrder.backendId),
        ),
      ]);

      toast.success(
        createdOrder.orderType === "delivery"
          ? `Đã tạo đơn giao hàng ${createdOrder.id}.`
          : `Đã tạo đơn mang về ${createdOrder.id}.`,
      );

      return createdOrder;
    } catch (error) {
      console.error("CREATE PREPAID ORDER ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Không thể tạo đơn hàng.",
      );

      return null;
    }
  };

  // ==================================================
  // CASH PAYMENT
  //
  // POST
  // /api/cashier/orders/{orderId}/payments/cash
  //
  // Dùng chung:
  // - DINE_IN
  // - TAKE_AWAY
  // - DELIVERY
  // ==================================================

  const payCash = async ({
    orderId,

    promotionCode = null,

    cashReceived,

    keepBillingOpen = false,
  }) => {
    // ==================================================
    // ORDER ID
    // ==================================================

    if (!orderId) {
      toast.error("Không tìm thấy ID đơn hàng.");

      return null;
    }

    // ==================================================
    // CASH RECEIVED
    // ==================================================

    const received = Number(cashReceived);

    if (!Number.isFinite(received) || received <= 0) {
      toast.warning("Vui lòng nhập số tiền khách đưa.");

      return null;
    }

    // ==================================================
    // REQUEST
    //
    // FE KHÔNG gửi:
    // - subtotal
    // - VAT
    // - discountAmount
    // - final total
    //
    // Backend tự tính.
    // ==================================================

    const payload = {
      promotionCode: promotionCode?.trim()
        ? promotionCode.trim().toUpperCase()
        : null,

      cashReceived: received,
    };

    try {
      console.log("CASH PAYMENT REQUEST:", {
        orderId,
        payload,
      });

      // ==================================================
      // API
      // ==================================================

      const response = await cashierOrderService.payCash(orderId, payload);

      const receipt = response?.data;

      if (!receipt) {
        throw new Error("Backend không trả về thông tin thanh toán.");
      }

      // ==================================================
      // SUCCESS
      // ==================================================

      if (receipt.paymentStatus !== "SUCCESS") {
        throw new Error("Thanh toán chưa thành công.");
      }

      // ==================================================
      // RELOAD DINE IN
      //
      // CASH DINE_IN thành công:
      // Order -> COMPLETED
      // Table -> AVAILABLE
      //
      // loadTables() sẽ lấy lại state thật từ BE.
      // ==================================================

      await loadTables();

      // ==================================================
      // RELOAD TAKE AWAY / DELIVERY
      // ==================================================

      await loadTakeAwayOrders();

      // ==================================================
      // TAKE AWAY / DELIVERY FLOW
      //
      // Giữ hành vi cũ.
      // ==================================================

      if (!keepBillingOpen) {
        setSelectedOrder(null);

        setSelectedTable(null);

        setDraftShippingDetail(null);

        setActiveTab("orders");
      }

      /*
       * DINE_IN:
       *
       * keepBillingOpen = true
       *
       * Không clear selectedOrder,
       * vì BillingModal cần giữ màn
       * "Thanh toán thành công".
       */

      toast.success("Thanh toán tiền mặt thành công.");

      return receipt;
    } catch (error) {
      console.error("CASH PAYMENT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Không thể thanh toán tiền mặt.",
      );

      return null;
    }
  };

  // ==================================================
  // SERVE ITEM
  //
  // READY
  // ->
  // SERVED
  // ==================================================

  const serveItem = async (orderItemId) => {
    if (!orderItemId) {
      return null;
    }

    try {
      // ==================================================
      // API
      // ==================================================

      const response = await cashierOrderService.serveItem(orderItemId);

      // response:
      //
      // {
      //   status,
      //   message,
      //   data: OrderResponse
      // }

      const updatedOrder = normalizeOrder(response?.data);

      if (!updatedOrder) {
        throw new Error("Backend không trả về thông tin đơn hàng.");
      }

      // ==================================================
      // UPDATE ORDERS
      // ==================================================

      setOrders((prev) =>
        prev.map((order) =>
          String(order.backendId) === String(updatedOrder.backendId)
            ? updatedOrder
            : order,
        ),
      );

      // ==================================================
      // UPDATE SELECTED ORDER
      // ==================================================

      setSelectedOrder((prev) => {
        if (!prev) {
          return prev;
        }

        return String(prev.backendId) === String(updatedOrder.backendId)
          ? updatedOrder
          : prev;
      });

      // ==================================================
      // UPDATE TABLE CARD
      //
      // TAKE_AWAY không có tableId
      // nên tự bỏ qua đoạn này.
      // ==================================================

      if (updatedOrder.tableId) {
        const itemCount = updatedOrder.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        setTables((prev) =>
          prev.map((table) =>
            String(table.id) === String(updatedOrder.tableId)
              ? {
                  ...table,
                  status: "occupied",
                  itemCount,
                  currentTotal: updatedOrder.totalAmount,
                  currentOrderId: updatedOrder.id,
                  activeOrder: updatedOrder,
                }
              : table,
          ),
        );
      }

      toast.success("Đã xác nhận món được phục vụ.");

      return updatedOrder;
    } catch (error) {
      console.error("CASHIER SERVE ITEM ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Không thể xác nhận phục vụ món.",
      );

      return null;
    }
  };

  // ==================================================
  // RETURN
  // ==================================================

  return {
    activeTab,
    setActiveTab,

    tables,
    tablesLoading,
    tablesError,
    reloadTables: loadTables,

    orders,

    menuItems,
    menuLoading,
    menuError,
    reloadMenu: loadMenu,

    restaurantSetting,
    promotions,

    activeModal,
    selectedTable,
    selectedOrder,

    billingPreparing,

    draftOrderType,
    draftGuestCount,
    draftShippingDetail,

    closeModal,
    openNewOrder,
    startNewOrder,
    openTable,
    openQuickChannel,

    openOrderDetails,
    openAddItems,
    openBilling,
    openReceipt,

    saveOrderItems,

    createPrepaidOrder,
    payCash,

    serveItem,

    reloadTakeAwayOrders: loadTakeAwayOrders,
  };
};

export default useCashierState;
