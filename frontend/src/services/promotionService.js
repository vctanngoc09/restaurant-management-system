import api from "./api";

const PROMOTION_URL = "/api/admin/promotions";

const promotionService = {
  async getAll() {
    const response = await api.get(PROMOTION_URL);

    return response.data;
  },
};

export default promotionService;
