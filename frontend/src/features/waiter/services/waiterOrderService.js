import api from "../../../services/api";

const ORDER_URL = "/api/orders";

const waiterOrderService = {
    // =========================
    // GET ACTIVE ORDER BY TABLE
    // =========================

    async getActiveByTable(tableId) {
        const response = await api.get(
            `${ORDER_URL}/table/${tableId}/active`,
        );

        return response.data;
    },
};

export default waiterOrderService;