import { useMemo, useState } from "react";

import WaiterMapHeader from "../WaiterMapHeader/WaiterMapHeader";

import WaiterTableFilters from "../WaiterTableFilters/WaiterTableFilters";

import WaiterTableCard from "../WaiterTableCard/WaiterTableCard";

import WaiterVirtualCard from "../WaiterVirtualCard/WaiterVirtualCard";

import styles from "./WaiterTableMap.module.css";

function WaiterTableMap({
  tables,
  orders,

  currentUserName,

  onSelectTable,
  onSelectVirtual,
}) {
  const [areaFilter, setAreaFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchArea = areaFilter === "all" || table.area === areaFilter;

      const matchStatus =
        statusFilter === "all" || table.status === statusFilter;

      return matchArea && matchStatus;
    });
  }, [tables, areaFilter, statusFilter]);

  const takeawayCount = orders.filter(
    (order) =>
      order.orderType === "take_away" &&
      order.status !== "completed" &&
      order.status !== "cancelled",
  ).length;

  const deliveryCount = orders.filter(
    (order) =>
      order.orderType === "delivery" &&
      order.status !== "completed" &&
      order.status !== "cancelled",
  ).length;

  const findTableOrder = (table) => {
    return orders.find(
      (order) =>
        order.orderType === "dine_in" &&
        order.tableId === table.id &&
        order.status !== "completed" &&
        order.status !== "cancelled",
    );
  };

  return (
    <div className={styles.container}>
      <WaiterMapHeader tables={tables} currentUserName={currentUserName} />

      <WaiterTableFilters
        areaFilter={areaFilter}
        statusFilter={statusFilter}
        onAreaChange={setAreaFilter}
        onStatusChange={setStatusFilter}
      />

      <div className={styles.grid}>
        <WaiterVirtualCard
          type="take_away"
          count={takeawayCount}
          onClick={onSelectVirtual}
        />

        <WaiterVirtualCard
          type="delivery"
          count={deliveryCount}
          onClick={onSelectVirtual}
        />

        {filteredTables.map((table) => (
          <WaiterTableCard
            key={table.id}
            table={table}
            order={findTableOrder(table)}
            onClick={onSelectTable}
          />
        ))}
      </div>
    </div>
  );
}

export default WaiterTableMap;
