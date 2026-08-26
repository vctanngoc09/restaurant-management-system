import { ChevronRight, Home, Trees, Wrench } from "lucide-react";

import styles from "./WaiterTableCard.module.css";

function WaiterTableCard({ table, order, onClick }) {
  const occupied = table.status === "occupied";

  const maintenance = table.status === "maintenance";

  const inactive = table.status === "inactive";

  const selectable = !maintenance && !inactive;

  // =========================================
  // AREA
  // =========================================

  const areaName = table.areaName || "Chưa phân khu";

  const indoor = areaName.toLowerCase().includes("trong");

  // =========================================
  // CURRENT ORDER INFORMATION
  // =========================================

  const itemCount =
    order?.items?.reduce((sum, item) => sum + item.quantity, 0) ||
    table.itemCount ||
    0;

  const currentTotal = order?.totalAmount ?? table.currentTotal ?? 0;

  // =========================================
  // STATUS TEXT
  // =========================================

  const getStatusContent = () => {
    if (occupied) {
      return (
        <>
          <p>{itemCount} món</p>

          <strong>{currentTotal.toLocaleString("vi-VN")}đ</strong>
        </>
      );
    }

    if (maintenance) {
      return <p>Đang bảo trì</p>;
    }

    return <p>Bàn trống</p>;
  };

  return (
    <button
      type="button"
      disabled={!selectable}
      className={`${styles.card} ${occupied ? styles.occupied : styles.empty}`}
      onClick={() => {
        if (selectable) {
          onClick(table);
        }
      }}
    >
      <div className={styles.top}>
        <div className={styles.identity}>
          {maintenance ? (
            <Wrench size={15} />
          ) : indoor ? (
            <Home size={15} />
          ) : (
            <Trees size={15} className={styles.outdoorIcon} />
          )}

          <strong>{table.number}</strong>

          <span className={indoor ? styles.indoorBadge : styles.outdoorBadge}>
            {areaName}
          </span>
        </div>

        <i className={occupied ? styles.occupiedDot : styles.emptyDot} />
      </div>

      <div className={styles.bottom}>
        <div>{getStatusContent()}</div>

        {selectable && <ChevronRight size={17} />}
      </div>
    </button>
  );
}

export default WaiterTableCard;
