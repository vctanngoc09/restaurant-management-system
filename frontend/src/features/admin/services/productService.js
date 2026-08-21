import api from "../../../services/api";

const PRODUCT_URL = "/api/admin/products";

const productService = {
    // =========================
    // GET ALL + PAGINATION
    // =========================

    async getAll({
                     page = 0,
                     size = 8,
                     keyword,
                     categoryId,
                     status,
                 } = {}) {
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

        const response = await api.get(
            PRODUCT_URL,
            {
                params,
            },
        );

        return response.data;
    },


    // =========================
    // GET BY ID
    // =========================

    async getById(id) {
        const response = await api.get(
            `${PRODUCT_URL}/${id}`,
        );

        return response.data;
    },


    // =========================
    // CREATE
    // =========================

    async create(data) {
        const response = await api.post(
            PRODUCT_URL,
            data,
        );

        return response.data;
    },


    // =========================
    // UPDATE
    // =========================

    async update(id, data) {
        const response = await api.put(
            `${PRODUCT_URL}/${id}`,
            data,
        );

        return response.data;
    },


    // =========================
    // SOFT DELETE
    // -> INACTIVE
    // =========================

    async deactivate(id) {
        const response = await api.delete(
            `${PRODUCT_URL}/${id}`,
        );

        return response.data;
    },


    // =========================
    // RESTORE
    // INACTIVE -> AVAILABLE
    // =========================

    async restore(id) {
        const response = await api.patch(
            `${PRODUCT_URL}/${id}/restore`,
        );

        return response.data;
    },


    // =========================
    // TOGGLE AVAILABILITY
    // AVAILABLE <-> OUT_OF_STOCK
    // =========================

    async toggleAvailability(id) {
        const response = await api.patch(
            `${PRODUCT_URL}/${id}/availability`,
        );

        return response.data;
    },
};

export default productService;