import { useMemo, useState } from "react";

import TableFilters from "../TableFilters/TableFilters";
import TableCard from "../TableCard/TableCard";
import QuickOrderCard from "../QuickOrderCard/QuickOrderCard";
import RestaurantSummary from "../RestaurantSummary/RestaurantSummary";

import styles from "./TableView.module.css";

function TableView({
  tables,
  orders,
  onTableClick,
  onQuickChannelClick,
  onNewOrder,
}) {
  const [areaFilter, setAreaFilter] = useState("all");

  const [occupancyFilter, setOccupancyFilter] = useState("all");

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchArea = areaFilter === "all" || table.area === areaFilter;

      const matchOccupancy =
        occupancyFilter === "all" || table.status === occupancyFilter;

      return matchArea && matchOccupancy;
    });
  }, [tables, areaFilter, occupancyFilter]);

  const takeawayCount = orders.filter(
    (order) => order.orderType === "take_away" && order.status !== "completed",
  ).length;

  const deliveryCount = orders.filter(
    (order) => order.orderType === "delivery" && order.status !== "completed",
  ).length;

  return (
    <div className={styles.tableView}>
      <div className={styles.tableViewMain}>
        <TableFilters
          areaFilter={areaFilter}
          occupancyFilter={occupancyFilter}
          onAreaChange={setAreaFilter}
          onOccupancyChange={setOccupancyFilter}
        />

        <div className={styles.tableGrid}>
          <QuickOrderCard
            type="take_away"
            count={takeawayCount}
            onClick={onQuickChannelClick}
          />

          <QuickOrderCard
            type="delivery"
            count={deliveryCount}
            onClick={onQuickChannelClick}
          />

          {filteredTables.map((table) => (
            <TableCard key={table.id} table={table} onClick={onTableClick} />
          ))}
        </div>
      </div>

      <RestaurantSummary
        tables={tables}
        takeawayCount={takeawayCount}
        deliveryCount={deliveryCount}
        onNewOrder={onNewOrder}
      />
    </div>
  );
}

export default TableView;
