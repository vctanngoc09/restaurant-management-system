import { useMemo, useState } from "react";

import { Building2, CheckCircle2, ClipboardList, Sun } from "lucide-react";

import WaiterTableCard from "../WaiterTableCard/WaiterTableCard";

import styles from "./WaiterTableMap.module.css";

function WaiterTableMap({ tables, orders, onSelectTable }) {
  // ==================================================
  // FILTER
  // ==================================================

  const [areaFilter, setAreaFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  // ==================================================
  // ACTIVE TABLES
  // ==================================================

  const activeTables = useMemo(
    () => tables.filter((table) => table.status !== "inactive"),
    [tables],
  );

  // ==================================================
  // AREAS
  // ==================================================

  const areas = useMemo(() => {
    const map = new Map();

    activeTables.forEach((table) => {
      if (table.areaId && table.areaName) {
        map.set(table.areaId, {
          id: table.areaId,

          name: table.areaName,
        });
      }
    });

    return Array.from(map.values());
  }, [activeTables]);

  // ==================================================
  // COUNTS
  // ==================================================

  const occupiedCount = activeTables.filter(
    (table) => table.status === "occupied",
  ).length;

  const availableCount = activeTables.filter(
    (table) => table.status === "empty",
  ).length;

  // ==================================================
  // ACTIVE DINE IN ORDERS
  // ==================================================

  const activeOrders = orders.filter(
    (order) =>
      order.orderType === "dine_in" &&
      order.status !== "completed" &&
      order.status !== "cancelled",
  );

  // ==================================================
  // READY ITEMS
  // ==================================================

  const readyItemCount = activeOrders.reduce((total, order) => {
    return total + order.items.filter((item) => item.status === "ready").length;
  }, 0);

  // ==================================================
  // FILTER TABLE
  // ==================================================

  const filteredTables = useMemo(() => {
    return activeTables.filter((table) => {
      const matchArea =
        areaFilter === "all" || String(table.areaId) === areaFilter;

      const matchStatus =
        statusFilter === "all" || table.status === statusFilter;

      return matchArea && matchStatus;
    });
  }, [activeTables, areaFilter, statusFilter]);

  // ==================================================
  // FIND ORDER BY TABLE
  // ==================================================

  const findTableOrder = (table) => {
    return activeOrders.find((order) => order.tableId === table.id);
  };

  // ==================================================
  // AREA ICON
  // ==================================================

  const getAreaIcon = (areaName) => {
    const name = areaName?.toLowerCase() || "";

    if (name.includes("ngoài")) {
      return Sun;
    }

    return Building2;
  };

  return (
    <div className={styles.layout}>
      {/* ==================================================
          MAIN
      ================================================== */}

      <main className={styles.main}>
        {/* ==================================================
            FILTER
        ================================================== */}

        <section className={styles.tableFilterCard}>
          {/* =========================
              HEADER
          ========================= */}

          <div className={styles.tableFilterHeader}>
            <h2>Sơ đồ quản lý</h2>

            <div className={styles.tableLegend}>
              <span className={styles.occupiedLegend}>
                <i />
                CÓ KHÁCH
              </span>

              <span className={styles.emptyLegend}>
                <i />
                TRỐNG
              </span>
            </div>
          </div>

          {/* =========================
              FILTER ROW
          ========================= */}

          <div className={styles.filterRows}>
            {/* ==================================================
                AREA
            ================================================== */}

            <div className={styles.filterGroup}>
              <button
                type="button"
                className={areaFilter === "all" ? styles.filterActive : ""}
                onClick={() => setAreaFilter("all")}
              >
                Tất cả
              </button>

              {areas.map((area) => {
                const Icon = getAreaIcon(area.name);

                return (
                  <button
                    key={area.id}
                    type="button"
                    className={
                      areaFilter === String(area.id) ? styles.filterActive : ""
                    }
                    onClick={() => setAreaFilter(String(area.id))}
                  >
                    <Icon size={14} />

                    {area.name}
                  </button>
                );
              })}
            </div>

            {/* ==================================================
                STATUS
            ================================================== */}

            <div className={styles.filterGroup}>
              <button
                type="button"
                className={statusFilter === "all" ? styles.filterActive : ""}
                onClick={() => setStatusFilter("all")}
              >
                Tất cả
              </button>

              <button
                type="button"
                className={
                  statusFilter === "occupied" ? styles.filterPrimaryActive : ""
                }
                onClick={() => setStatusFilter("occupied")}
              >
                Đang có khách
              </button>

              <button
                type="button"
                className={statusFilter === "empty" ? styles.filterActive : ""}
                onClick={() => setStatusFilter("empty")}
              >
                Bàn trống
              </button>

              <button
                type="button"
                className={
                  statusFilter === "maintenance" ? styles.filterActive : ""
                }
                onClick={() => setStatusFilter("maintenance")}
              >
                Bảo trì
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================
            TABLE GRID
        ================================================== */}

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
      </main>

      {/* ==================================================
          RESTAURANT SUMMARY

          Layout giống bên Cashier
      ================================================== */}

      <aside className={styles.restaurantSummary}>
        <h3>Tổng quan nhà hàng</h3>

        {/* ==================================================
            TABLE SUMMARY
        ================================================== */}

        <div className={styles.summaryTableBox}>
          {/* =========================
              TOTAL
          ========================= */}

          <div className={styles.summaryTotal}>
            <span>Tổng số bàn</span>

            <strong>{activeTables.length}</strong>
          </div>

          {/* =========================
              AVAILABLE / OCCUPIED
          ========================= */}

          <div className={styles.summaryNumbers}>
            <div>
              <span>Bàn trống</span>

              <strong>{availableCount}</strong>
            </div>

            <div>
              <span>Đang có khách</span>

              <strong>{occupiedCount}</strong>
            </div>
          </div>
        </div>

        {/* ==================================================
            ACTIVE ORDERS
        ================================================== */}

        <div className={styles.summaryChannel}>
          <div>
            <ClipboardList size={17} />

            <span>Đơn đang phục vụ</span>
          </div>

          <strong>{activeOrders.length}</strong>
        </div>

        {/* ==================================================
            READY ITEMS
        ================================================== */}

        <div className={styles.summaryChannel}>
          <div>
            <CheckCircle2 size={17} />

            <span>Món sẵn sàng</span>
          </div>

          <strong className={readyItemCount > 0 ? styles.readyCount : ""}>
            {readyItemCount}
          </strong>
        </div>
      </aside>
    </div>
  );
}

export default WaiterTableMap;
