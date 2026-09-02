import api from "../../../services/api";

const CASHIER_ORDER_URL = "/api/cashier/orders";

const cashierOrderService = {
  async createOrder(payload) {
    const response = await api.post(CASHIER_ORDER_URL, payload);

    return response.data;
  },

  async getActiveByTable(tableId) {
    const response = await api.get(
      `${CASHIER_ORDER_URL}/table/${tableId}/active`,
    );

    return response.data;
  },

  async getActiveByType(orderType) {
    const response = await api.get(
      `${CASHIER_ORDER_URL}/type/${orderType}/active`,
    );

    return response.data;
  },

  async addItems(orderId, items) {
    const response = await api.post(`${CASHIER_ORDER_URL}/${orderId}/items`, {
      items,
    });

    return response.data;
  },

  async serveItem(orderItemId) {
    const response = await api.patch(
      `${CASHIER_ORDER_URL}/items/${orderItemId}/serve`,
    );

    return response.data;
  },

  async requestPayment(orderId) {
    const response = await api.patch(
      `${CASHIER_ORDER_URL}/${orderId}/request-payment`,
    );

    return response.data;
  },

  async payCash(orderId, payload) {
    const response = await api.post(
      `${CASHIER_ORDER_URL}/${orderId}/payments/cash`,
      payload,
    );

    return response.data;
  },

  // ==================================================
  // GET RECEIPT
  //
  // GET
  // /api/cashier/orders/{orderId}/receipt
  // ==================================================

  async getReceipt(orderId) {
    const response = await api.get(`${CASHIER_ORDER_URL}/${orderId}/receipt`);

    return response.data;
  },
};

export default cashierOrderService;
