import { useMemo, useState } from "react";

import TableFilters from "../TableFilters/TableFilters";

import TableCard from "../TableCard/TableCard";

import QuickOrderCard from "../QuickOrderCard/QuickOrderCard";

import RestaurantSummary from "../RestaurantSummary/RestaurantSummary";

import styles from "./TableView.module.css";

function TableView({ tables, orders, onTableClick, onQuickChannelClick }) {
  const [areaFilter, setAreaFilter] = useState("all");

  const [occupancyFilter, setOccupancyFilter] = useState("all");

  // ==================================================
  // FILTER TABLES
  // ==================================================

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchArea = areaFilter === "all" || table.area === areaFilter;

      const matchOccupancy =
        occupancyFilter === "all" || table.status === occupancyFilter;

      return matchArea && matchOccupancy;
    });
  }, [tables, areaFilter, occupancyFilter]);

  // ==================================================
  // TAKE AWAY COUNT
  // ==================================================

  const takeawayCount = orders.filter(
    (order) => order.orderType === "take_away" && order.status !== "completed",
  ).length;

  // ==================================================
  // DELIVERY COUNT
  // ==================================================

  const deliveryCount = orders.filter(
    (order) => order.orderType === "delivery" && order.status !== "completed",
  ).length;

  return (
    <div className={styles.tableView}>
      <div className={styles.tableViewMain}>
        {/* ==================================================
            FILTER
        ================================================== */}

        <TableFilters
          areaFilter={areaFilter}
          occupancyFilter={occupancyFilter}
          onAreaChange={setAreaFilter}
          onOccupancyChange={setOccupancyFilter}
        />

        {/* ==================================================
            GRID
        ================================================== */}

        <div className={styles.tableGrid}>
          {/* TAKE AWAY */}

          <QuickOrderCard
            type="take_away"
            count={takeawayCount}
            onClick={onQuickChannelClick}
          />

          {/* DELIVERY */}

          <QuickOrderCard
            type="delivery"
            count={deliveryCount}
            onClick={onQuickChannelClick}
          />

          {/* TABLES */}

          {filteredTables.map((table) => (
            <TableCard key={table.id} table={table} onClick={onTableClick} />
          ))}
        </div>
      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <RestaurantSummary
        tables={tables}
        takeawayCount={takeawayCount}
        deliveryCount={deliveryCount}
        onQuickChannelClick={onQuickChannelClick}
      />
    </div>
  );
}

export default TableView;