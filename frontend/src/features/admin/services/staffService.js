import api from "../../../services/api";

const STAFF_URL = "/api/admin/staff";

const staffService = {
  async getAll() {
    const response = await api.get(STAFF_URL);

    return response.data;
  },

  async getById(id) {
    const response = await api.get(`${STAFF_URL}/${id}`);

    return response.data;
  },

  async create(data) {
    const response = await api.post(STAFF_URL, data);

    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`${STAFF_URL}/${id}`, data);

    return response.data;
  },

  async deactivate(id) {
    const response = await api.delete(`${STAFF_URL}/${id}`);

    return response.data;
  },

  async restore(id) {
    const response = await api.patch(`${STAFF_URL}/${id}/restore`);

    return response.data;
  },
};

export default staffService;
