import { AlertTriangle, ChefHat, Volume2, VolumeX } from "lucide-react";

import styles from "./KitchenHeader.module.css";

function KitchenHeader({
  pendingCount,
  readyCount,
  outOfStockCount,

  soundEnabled,

  onToggleSound,
  onOpenOutOfStock,
}) {
  return (
    <section className={styles.header}>
      <div className={styles.titleArea}>
        <div className={styles.iconBox}>
          <ChefHat size={22} />
        </div>

        <div>
          <div className={styles.titleRow}>
            <h1>Màn hình Điều phối Bếp (KDS)</h1>

            <span className={styles.liveBadge}>LIVE</span>
          </div>

          <p>
            Hệ thống điều phối món ăn theo thời gian thực cho nhà hàng Hủ Tiếu
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.metrics}>
          <span>
            Chờ chế biến: <strong>{pendingCount}</strong>
          </span>

          <i />

          <span>
            Sẵn sàng: <strong>{readyCount}</strong>
          </span>
        </div>

        <button
          type="button"
          className={`${styles.stockButton} ${
            outOfStockCount > 0 ? styles.stockButtonWarning : ""
          }`}
          onClick={onOpenOutOfStock}
        >
          <AlertTriangle size={16} />

          <span>Báo Hết Món ({outOfStockCount})</span>
        </button>

        <button
          type="button"
          className={styles.soundButton}
          title={soundEnabled ? "Chuông báo đang bật" : "Chuông báo đang tắt"}
          onClick={onToggleSound}
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </div>
    </section>
  );
}

export default KitchenHeader;
