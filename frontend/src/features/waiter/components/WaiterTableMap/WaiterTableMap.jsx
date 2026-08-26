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

  // =========================================
  // GET UNIQUE AREAS FROM BACKEND TABLE DATA
  // =========================================

  const areas = useMemo(() => {
    const areaMap = new Map();

    tables.forEach((table) => {
      if (table.areaId && table.areaName) {
        areaMap.set(table.areaId, {
          id: table.areaId,

          name: table.areaName,
        });
      }
    });

    return Array.from(areaMap.values());
  }, [tables]);

  // =========================================
  // FILTER TABLES
  // =========================================

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      /*
       * INACTIVE là bàn đã soft-delete.
       * Waiter không cần nhìn thấy.
       */
      if (table.status === "inactive") {
        return false;
      }

      const matchArea =
        areaFilter === "all" || String(table.areaId) === areaFilter;

      const matchStatus =
        statusFilter === "all" || table.status === statusFilter;

      return matchArea && matchStatus;
    });
  }, [tables, areaFilter, statusFilter]);

  // =========================================
  // TAKEAWAY COUNT
  // =========================================

  const takeawayCount = orders.filter(
    (order) =>
      order.orderType === "take_away" &&
      order.status !== "completed" &&
      order.status !== "cancelled",
  ).length;

  // =========================================
  // DELIVERY COUNT
  // =========================================

  const deliveryCount = orders.filter(
    (order) =>
      order.orderType === "delivery" &&
      order.status !== "completed" &&
      order.status !== "cancelled",
  ).length;

  // =========================================
  // FIND ACTIVE ORDER OF TABLE
  // =========================================

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
      <WaiterMapHeader
        tables={tables.filter((table) => table.status !== "inactive")}
        currentUserName={currentUserName}
      />

      <WaiterTableFilters
        areas={areas}
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
