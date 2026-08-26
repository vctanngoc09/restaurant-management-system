import api from "../../../services/api";

const PRODUCT_URL = "/api/admin/products";

// =========================
// BUILD FORM DATA
// =========================

const buildProductFormData = (data) => {
  const formData = new FormData();

  formData.append("name", data.name);

  formData.append("price", String(data.price));

  formData.append("categoryId", String(data.categoryId));

  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  if (data.removeImage === true) {
    formData.append("removeImage", "true");
  }

  return formData;
};

const productService = {
  // =========================
  // GET ALL + PAGINATION
  // =========================

  async getAll({ page = 0, size = 8, keyword, categoryId, status } = {}) {
    const params = {
      page,
      size,
    };

    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }

    if (categoryId) {
      params.categoryId = categoryId;
    }

    if (status) {
      params.status = status;
    }

    const response = await api.get(PRODUCT_URL, {
      params,
    });

    return response.data;
  },

  // =========================
  // GET BY ID
  // =========================

  async getById(id) {
    const response = await api.get(`${PRODUCT_URL}/${id}`);

    return response.data;
  },

  // =========================
  // CREATE
  // multipart/form-data
  // =========================

  async create(data) {
    const formData = buildProductFormData(data);

    const response = await api.post(PRODUCT_URL, formData);

    return response.data;
  },

  // =========================
  // UPDATE
  // multipart/form-data
  // =========================

  async update(id, data) {
    const formData = buildProductFormData(data);

    const response = await api.put(`${PRODUCT_URL}/${id}`, formData);

    return response.data;
  },

  // =========================
  // SOFT DELETE
  // =========================

  async deactivate(id) {
    const response = await api.delete(`${PRODUCT_URL}/${id}`);

    return response.data;
  },

  // =========================
  // RESTORE
  // =========================

  async restore(id) {
    const response = await api.patch(`${PRODUCT_URL}/${id}/restore`);

    return response.data;
  },

  // =========================
  // AVAILABLE <-> OUT_OF_STOCK
  // =========================

  async toggleAvailability(id) {
    const response = await api.patch(`${PRODUCT_URL}/${id}/availability`);

    return response.data;
  },
};

export default productService;
