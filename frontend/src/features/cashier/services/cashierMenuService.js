import api from "../../../services/api";

const MENU_URL = "/api/menu/products";

const cashierMenuService = {
  async getAll() {
    const response = await api.get(MENU_URL);

    return response.data;
  },
};

export default cashierMenuService;
