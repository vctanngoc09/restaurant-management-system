import { Building2, Sun } from "lucide-react";

import styles from "./TableFilters.module.css";
function TableFilters({
  areaFilter,
  occupancyFilter,
  onAreaChange,
  onOccupancyChange,
}) {
  return (
    <div className={styles.tableFilterCard}>
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

      <div className={styles.filterRows}>
        <div className={styles.filterGroup}>
          <button
            type="button"
            className={areaFilter === "all" ? styles.filterActive : ""}
            onClick={() => onAreaChange("all")}
          >
            Tất cả
          </button>

          <button
            type="button"
            className={areaFilter === "indoor" ? styles.filterActive : ""}
            onClick={() => onAreaChange("indoor")}
          >
            <Building2 size={14} />
            Trong nhà
          </button>

          <button
            type="button"
            className={areaFilter === "outdoor" ? styles.filterActive : ""}
            onClick={() => onAreaChange("outdoor")}
          >
            <Sun size={14} />
            Ngoài trời
          </button>
        </div>

        <div className={styles.filterGroup}>
          <button
            type="button"
            className={occupancyFilter === "all" ? styles.filterActive : ""}
            onClick={() => onOccupancyChange("all")}
          >
            Tất cả
          </button>

          <button
            type="button"
            className={
              occupancyFilter === "occupied" ? styles.filterPrimaryActive : ""
            }
            onClick={() => onOccupancyChange("occupied")}
          >
            Đang có khách
          </button>

          <button
            type="button"
            className={occupancyFilter === "empty" ? styles.filterActive : ""}
            onClick={() => onOccupancyChange("empty")}
          >
            Bàn trống
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableFilters;
