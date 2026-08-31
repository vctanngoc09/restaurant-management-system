import api from "../../../services/api";

// ==================================================
// RESTAURANT SETTING API
// ==================================================

const RESTAURANT_SETTING_URL = "/api/restaurant-settings";

const restaurantSettingService = {
  // ==================================================
  // GET CURRENT SETTING
  // ==================================================

  async getCurrent() {
    const response = await api.get(RESTAURANT_SETTING_URL);

    return response.data;
  },

  // ==================================================
  // CREATE SETTING
  // ==================================================

  async create(data) {
    const response = await api.post(RESTAURANT_SETTING_URL, data);

    return response.data;
  },

  // ==================================================
  // UPDATE SETTING
  // ==================================================

  async update(data) {
    const response = await api.put(RESTAURANT_SETTING_URL, data);

    return response.data;
  },
};

export default restaurantSettingService;
