import { Bike, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

import styles from "./QuickOrderCard.module.css";

function QuickOrderCard({ type, count, onClick }) {
  const takeaway = type === "take_away";

  const Icon = takeaway ? ShoppingBag : Bike;

  return (
    <button
      type="button"
      className={`${styles.quickCard} ${
        takeaway ? styles.takeawayCard : styles.deliveryCard
      }`}
      onClick={() => onClick(type)}
    >
      <div className={styles.quickCardHeader}>
        <div>
          <h3>
            <Icon size={17} />

            {takeaway ? "Mang về" : "Giao hàng"}
          </h3>

          <p>
            {count} {takeaway ? "đơn chờ lấy" : "đơn đang giao"}
          </p>
        </div>

        <span className={styles.quickBadge}>
          {takeaway && <Sparkles size={11} />}

          {takeaway ? "VIRTUAL" : "DELIVERY"}
        </span>
      </div>

      <div className={styles.quickIconArea}>
        <span>
          <Icon size={22} />
        </span>
      </div>

      <div className={styles.quickFooter}>
        <strong>
          {takeaway ? "MANG VỀ • XỬ LÝ NGAY" : "GIAO HÀNG • SHIPPER"}
        </strong>

        <ChevronRight size={15} />
      </div>
    </button>
  );
}

export default QuickOrderCard;