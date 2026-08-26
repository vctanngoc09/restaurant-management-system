import api from "../../../services/api";

const TABLE_URL = "/api/tables";

const waiterTableService = {
  // =========================
  // GET TABLES FOR WAITER
  // =========================

  async getAll({ page = 0, size = 50, keyword, areaId, status } = {}) {
    const params = {
      page,
      size,
    };

    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }

    if (areaId !== undefined && areaId !== null && areaId !== "") {
      params.areaId = areaId;
    }

    if (status) {
      params.status = status;
    }

    const response = await api.get(TABLE_URL, {
      params,
    });

    return response.data;
  },
};

export default waiterTableService;
