import { Home, Trees } from "lucide-react";

import styles from "./WaiterTableFilters.module.css";

function WaiterTableFilters({
  areaFilter,
  statusFilter,

  onAreaChange,
  onStatusChange,
}) {
  return (
    <section className={styles.filters}>
      <div className={styles.group}>
        <button
          type="button"
          className={areaFilter === "all" ? styles.active : ""}
          onClick={() => onAreaChange("all")}
        >
          Tất cả khu
        </button>

        <button
          type="button"
          className={areaFilter === "indoor" ? styles.active : ""}
          onClick={() => onAreaChange("indoor")}
        >
          <Home size={14} />
          Trong nhà
        </button>

        <button
          type="button"
          className={areaFilter === "outdoor" ? styles.active : ""}
          onClick={() => onAreaChange("outdoor")}
        >
          <Trees size={14} />
          Sân vườn
        </button>
      </div>

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
      </div>
    </section>
  );
}

export default WaiterTableFilters;
