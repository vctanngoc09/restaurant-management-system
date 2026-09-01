import api from "./api";

const RESTAURANT_SETTING_URL = "/api/restaurant-settings";

const restaurantSettingService = {
  async getCurrent() {
    const response = await api.get(RESTAURANT_SETTING_URL);

    return response.data;
  },
};

export default restaurantSettingService;
