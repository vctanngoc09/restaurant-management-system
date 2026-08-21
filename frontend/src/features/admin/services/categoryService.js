import api from "../../../services/api";

const CATEGORY_URL = "/api/admin/categories";

const categoryService = {
  // =========================
  // GET ALL
  // =========================

  async getAll() {
    const response = await api.get(CATEGORY_URL);

    return response.data;
  },

  // =========================
  // GET BY ID
  // =========================

  async getById(id) {
    const response = await api.get(`${CATEGORY_URL}/${id}`);

    return response.data;
  },

  // =========================
  // CREATE
  // =========================

  async create(data) {
    const response = await api.post(CATEGORY_URL, data);

    return response.data;
  },

  // =========================
  // UPDATE
  // =========================

  async update(id, data) {
    const response = await api.put(`${CATEGORY_URL}/${id}`, data);

    return response.data;
  },

  // =========================
  // DELETE
  // =========================

  async remove(id) {
    const response = await api.delete(`${CATEGORY_URL}/${id}`);

    return response.data;
  },
};

export default categoryService;
