import { useMemo, useState } from "react";

import WaiterMapHeader from "../WaiterMapHeader/WaiterMapHeader";

import WaiterTableFilters from "../WaiterTableFilters/WaiterTableFilters";

import WaiterTableCard from "../WaiterTableCard/WaiterTableCard";

import styles from "./WaiterTableMap.module.css";

function WaiterTableMap({
  tables,
  orders,

  currentUserName,

  onSelectTable,
}) {
  const [areaFilter, setAreaFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  // ==================================================
  // AREAS
  // ==================================================

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

  // ==================================================
  // FILTER TABLES
  // ==================================================

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
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

  // ==================================================
  // ACTIVE ORDER OF TABLE
  // ==================================================

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
