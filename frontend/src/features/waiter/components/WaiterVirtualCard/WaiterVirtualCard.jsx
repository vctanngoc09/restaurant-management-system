import { Bike, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

import styles from "./WaiterVirtualCard.module.css";

function WaiterVirtualCard({ type, count, onClick }) {
  const takeaway = type === "take_away";

  const Icon = takeaway ? ShoppingBag : Bike;

  return (
    <button
      type="button"
      className={`${styles.card} ${
        takeaway ? styles.takeaway : styles.delivery
      }`}
      onClick={() => onClick(type)}
    >
      <div className={styles.top}>
        <div>
          <h3>
            <Icon size={16} />

            {takeaway ? "Mang về" : "Giao hàng"}
          </h3>

          <p>
            {count} {takeaway ? "đơn đang xử lý" : "đơn đang giao"}
          </p>
        </div>

        <span>
          {takeaway && <Sparkles size={10} />}

          {takeaway ? "VIRTUAL" : "DELIVERY"}
        </span>
      </div>

      <div className={styles.bottom}>
        <strong>{takeaway ? "MANG VỀ" : "GIAO HÀNG"}</strong>

        <ChevronRight size={16} />
      </div>
    </button>
  );
}

export default WaiterVirtualCard;
