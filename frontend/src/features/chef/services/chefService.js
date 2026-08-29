import api from "../../../services/api";

const CHEF_URL = "/api/chef";

const chefService = {
  // ==================================================
  // GET KDS BOARD
  //
  // GET /api/chef/tickets
  //
  // response.data:
  // {
  //   waiting: [],
  //   processing: [],
  //   ready: []
  // }
  // ==================================================

  async getBoard() {
    const response = await api.get(`${CHEF_URL}/tickets`);

    return response.data;
  },

  // ==================================================
  // START TICKET
  //
  // WAITING -> PROCESSING
  //
  // PATCH /api/chef/tickets/{ticketId}/start
  // ==================================================

  async startTicket(ticketId) {
    const response = await api.patch(`${CHEF_URL}/tickets/${ticketId}/start`);

    return response.data;
  },

  // ==================================================
  // UPDATE ITEM STATUS
  //
  // PENDING -> COOKING
  // COOKING -> READY
  //
  // PATCH /api/chef/items/{itemId}/status
  // ==================================================

  async updateItemStatus(orderItemId, status) {
    const response = await api.patch(
      `${CHEF_URL}/items/${orderItemId}/status`,
      {
        status,
      },
    );

    return response.data;
  },

  async completeTicket(ticketId) {
    const response = await api.patch(`${CHEF_URL}/tickets/${ticketId}/ready`);

    return response.data;
  },
};

export default chefService;
