import { ChevronRight, Home, Trees } from "lucide-react";

import styles from "./WaiterTableCard.module.css";

function WaiterTableCard({ table, order, onClick }) {
  const occupied = table.status === "occupied";

  const indoor = table.area === "indoor";

  const itemCount =
    order?.items?.reduce((sum, item) => sum + item.quantity, 0) ||
    table.itemCount ||
    0;

  const currentTotal = order?.totalAmount ?? table.currentTotal ?? 0;

  return (
    <button
      type="button"
      className={`${styles.card} ${occupied ? styles.occupied : styles.empty}`}
      onClick={() => onClick(table)}
    >
      <div className={styles.top}>
        <div className={styles.identity}>
          {indoor ? (
            <Home size={15} />
          ) : (
            <Trees size={15} className={styles.outdoorIcon} />
          )}

          <strong>{table.number}</strong>

          <span className={indoor ? styles.indoorBadge : styles.outdoorBadge}>
            {indoor ? "Trong nhà" : "Ngoài trời"}
          </span>
        </div>

        <i className={occupied ? styles.occupiedDot : styles.emptyDot} />
      </div>

      <div className={styles.bottom}>
        <div>
          {occupied ? (
            <>
              <p>{itemCount} món</p>

              <strong>{currentTotal.toLocaleString("vi-VN")}đ</strong>
            </>
          ) : (
            <p>Bàn trống</p>
          )}
        </div>

        <ChevronRight size={17} />
      </div>
    </button>
  );
}

export default WaiterTableCard;
