import api from "../../../services/api";

// ==================================================
// PROMOTION API
// ==================================================

const PROMOTION_URL = "/api/admin/promotions";

const promotionService = {
  // ==================================================
  // GET ALL
  // ==================================================

  async getAll() {
    const response = await api.get(PROMOTION_URL);

    return response.data;
  },

  // ==================================================
  // GET BY ID
  // ==================================================

  async getById(id) {
    const response = await api.get(`${PROMOTION_URL}/${id}`);

    return response.data;
  },

  // ==================================================
  // CREATE
  // ==================================================

  async create(data) {
    const response = await api.post(PROMOTION_URL, data);

    return response.data;
  },

  // ==================================================
  // UPDATE
  // ==================================================

  async update(id, data) {
    const response = await api.put(`${PROMOTION_URL}/${id}`, data);

    return response.data;
  },

  // ==================================================
  // ENABLE / DISABLE
  // ==================================================

  async setActive(id, active) {
    const response = await api.patch(`${PROMOTION_URL}/${id}/active`, null, {
      params: {
        active,
      },
    });

    return response.data;
  },
};

export default promotionService;
