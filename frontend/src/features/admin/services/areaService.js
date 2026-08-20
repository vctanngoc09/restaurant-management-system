import api from "../../../services/api";

const AREA_URL = "/api/admin/areas";

const areaService = {
  // GET ALL
  async getAll() {
    const response = await api.get(AREA_URL);

    return response.data;
  },

  // GET BY ID
  async getById(id) {
    const response = await api.get(`${AREA_URL}/${id}`);

    return response.data;
  },

  // CREATE
  async create(data) {
    const response = await api.post(AREA_URL, data);

    return response.data;
  },

  // UPDATE
  async update(id, data) {
    const response = await api.put(`${AREA_URL}/${id}`, data);

    return response.data;
  },

  // DELETE
  async remove(id) {
    const response = await api.delete(`${AREA_URL}/${id}`);

    return response.data;
  },
};

export default areaService;
