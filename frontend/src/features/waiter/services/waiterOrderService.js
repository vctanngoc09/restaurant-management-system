import api from "../../../services/api";

const ORDER_URL = "/api/orders";

const waiterOrderService = {
  // ==================================================
  // CREATE ORDER
  // ==================================================

  async createOrder(data) {
    const response = await api.post(ORDER_URL, data);

    return response.data;
  },

  // ==================================================
  // GET ACTIVE ORDER BY TABLE
  // ==================================================

  async getActiveByTable(tableId) {
    const response = await api.get(`${ORDER_URL}/table/${tableId}/active`);

    return response.data;
  },

  // ==================================================
  // ADD ITEMS TO ORDER
  // ==================================================

  async addItemsToOrder(orderId, items) {
    const response = await api.post(`${ORDER_URL}/${orderId}/items`, {
      items,
    });

    return response.data;
  },
};

export default waiterOrderService;
