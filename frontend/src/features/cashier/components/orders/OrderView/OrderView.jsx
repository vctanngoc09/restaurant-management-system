import { useMemo, useState } from "react";

import OrderFilters from "../OrderFilters/OrderFilters";
import OrderCard from "../OrderCard/OrderCard";

import styles from "./OrderView.module.css";

function OrderView({ orders, onNewOrder, onViewDetail, onPayment }) {
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.trim().toLowerCase();

      const matchSearch =
        !searchValue ||
        order.id.toLowerCase().includes(searchValue) ||
        order.customerName?.toLowerCase().includes(searchValue) ||
        order.tableName?.toLowerCase().includes(searchValue);

      const matchType = typeFilter === "all" || order.orderType === typeFilter;

      let matchStatus = true;

      if (statusFilter === "processing") {
        matchStatus = ["new", "cooking", "ready"].includes(order.status);
      }

      if (statusFilter === "pending_payment") {
        matchStatus = order.status === "pending_payment";
      }

      if (statusFilter === "completed") {
        matchStatus = order.status === "completed";
      }

      return matchSearch && matchType && matchStatus;
    });
  }, [orders, search, typeFilter, statusFilter]);

  return (
    <div className={styles.orderView}>
      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewOrder={onNewOrder}
      />

      {filteredOrders.length > 0 ? (
        <div className={styles.orderGrid}>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetail={onViewDetail}
              onPayment={onPayment}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noData}>Không tìm thấy đơn hàng phù hợp.</div>
      )}
    </div>
  );
}

export default OrderView;
