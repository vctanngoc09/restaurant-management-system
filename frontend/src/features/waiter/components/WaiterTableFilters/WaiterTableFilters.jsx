import { Home, Trees } from "lucide-react";

import styles from "./WaiterTableFilters.module.css";

function WaiterTableFilters({
  areas,

  areaFilter,
  statusFilter,

  onAreaChange,
  onStatusChange,
}) {
  return (
    <section className={styles.filters}>
      {/* ========================= */}
      {/* AREA FILTER */}
      {/* ========================= */}

      <div className={styles.group}>
        <button
          type="button"
          className={areaFilter === "all" ? styles.active : ""}
          onClick={() => onAreaChange("all")}
        >
          Tất cả khu
        </button>

        {areas.map((area) => {
          const areaName = area.name?.toLowerCase() || "";

          const indoor = areaName.includes("trong");

          const Icon = indoor ? Home : Trees;

          return (
            <button
              type="button"
              key={area.id}
              className={areaFilter === String(area.id) ? styles.active : ""}
              onClick={() => onAreaChange(String(area.id))}
            >
              <Icon size={14} />

              {area.name}
            </button>
          );
        })}
      </div>

      {/* ========================= */}
      {/* STATUS FILTER */}
      {/* ========================= */}

      <div className={styles.group}>
        <button
          type="button"
          className={statusFilter === "all" ? styles.active : ""}
          onClick={() => onStatusChange("all")}
        >
          Tất cả
        </button>

        <button
          type="button"
          className={statusFilter === "occupied" ? styles.occupiedActive : ""}
          onClick={() => onStatusChange("occupied")}
        >
          Đang có khách
        </button>

        <button
          type="button"
          className={statusFilter === "empty" ? styles.active : ""}
          onClick={() => onStatusChange("empty")}
        >
          Bàn trống
        </button>

        <button
          type="button"
          className={statusFilter === "maintenance" ? styles.active : ""}
          onClick={() => onStatusChange("maintenance")}
        >
          Bảo trì
        </button>
      </div>
    </section>
  );
}

export default WaiterTableFilters;
