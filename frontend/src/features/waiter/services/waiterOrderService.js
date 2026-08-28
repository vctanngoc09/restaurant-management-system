import api from "../../../services/api";

// ==================================================
// WAITER ORDER API
// ==================================================

const WAITER_ORDER_URL = "/api/waiter/orders";

const waiterOrderService = {
  async createOrder(data) {
    const response = await api.post(WAITER_ORDER_URL, data);

    return response.data;
  },


  async getActiveByTable(tableId) {
    const response = await api.get(
      `${WAITER_ORDER_URL}/table/${tableId}/active`,
    );

    return response.data;
  },


  async addItemsToOrder(orderId, items) {
    const response = await api.post(`${WAITER_ORDER_URL}/${orderId}/items`, {
      items,
    });

    return response.data;
  },


  async serveItem(orderItemId) {
    const response = await api.patch(
      `${WAITER_ORDER_URL}/items/${orderItemId}/serve`,
    );

    return response.data;
  },
};

export default waiterOrderService;
