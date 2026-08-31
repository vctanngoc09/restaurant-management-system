import { ChevronRight, Home, Trees, Utensils } from "lucide-react";

import styles from "./TableCard.module.css";

function TableCard({ table, onClick }) {
  const occupied = table.status === "occupied";
  const indoor = table.area === "indoor";

  return (
    <button
      type="button"
      className={`${styles.tableCard} ${
        occupied ? styles.tableCardOccupied : styles.tableCardEmpty
      }`}
      onClick={() => onClick(table)}
    >
      <div className={styles.tableCardHeader}>
        <div className={styles.tableIdentity}>
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

        <span
          className={`${styles.statusDot} ${
            occupied ? styles.statusDotOccupied : ""
          }`}
        />
      </div>

      <div className={styles.tableCardCenter}>
        {occupied ? (
          <Utensils size={27} className={styles.utensilsIcon} />
        ) : (
          <div className={styles.emptyStamp}>TRỐNG</div>
        )}
      </div>

      <div className={styles.tableCardFooter}>
        <div>
          {occupied ? (
            <>
              <p>{table.itemCount} món đang phục vụ</p>

              <strong>
                {Number(table.currentTotal || 0).toLocaleString("vi-VN")}đ
              </strong>
            </>
          ) : (
            <>
              <p>Bàn trống</p>

              <strong className={styles.mutedPrice}>0đ</strong>
            </>
          )}
        </div>

        <span className={styles.cardArrow}>
          <ChevronRight size={14} />
        </span>
      </div>
    </button>
  );
}

export default TableCard;
