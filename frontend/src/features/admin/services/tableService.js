import api from "../../../services/api";

const TABLE_URL = "/api/admin/tables";

const tableService = {
  // =========================
  // GET ALL
  // =========================

  async getAll({
                 page = 0,
                 size = 8,
                 keyword,
                 areaId,
                 status,
               } = {}) {
    const params = {
      page,
      size,
    };

    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }

    if (areaId) {
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

  // =========================
  // GET BY ID
  // =========================

  async getById(id) {
    const response = await api.get(
        `${TABLE_URL}/${id}`,
    );

    return response.data;
  },

  // =========================
  // CREATE
  // =========================

  async create(data) {
    const response = await api.post(
        TABLE_URL,
        data,
    );

    return response.data;
  },

  // =========================
  // UPDATE
  // =========================

  async update(id, data) {
    const response = await api.put(
        `${TABLE_URL}/${id}`,
        data,
    );

    return response.data;
  },

  // =========================
  // SOFT DELETE
  // =========================

  async deactivate(id) {
    const response = await api.delete(
        `${TABLE_URL}/${id}`,
    );

    return response.data;
  },

  // =========================
  // RESTORE
  // =========================

  async restore(id) {
    const response = await api.patch(
        `${TABLE_URL}/${id}/restore`,
    );

    return response.data;
  },
};

export default tableService;