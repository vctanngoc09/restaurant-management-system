import { ChefHat, RefreshCw, Volume2, VolumeX } from "lucide-react";

import styles from "./KitchenHeader.module.css";

function KitchenHeader({
  waitingCount,
  processingCount,
  readyCount,

  loading,

  soundEnabled,

  onToggleSound,
  onRefresh,
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

            <span className={styles.liveBadge}>AUTO 5s</span>
          </div>

          <p>Theo dõi phiếu bếp theo từng batch gọi món</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.metrics}>
          <span>
            Chờ: <strong>{waitingCount}</strong>
          </span>

          <i />

          <span>
            Đang nấu: <strong>{processingCount}</strong>
          </span>

          <i />

          <span>
            Sẵn sàng: <strong>{readyCount}</strong>
          </span>
        </div>

        <button
          type="button"
          className={styles.stockButton}
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={16} />

          <span>Làm mới</span>
        </button>

        <button
          type="button"
          className={styles.soundButton}
          title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          onClick={onToggleSound}
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </div>
    </section>
  );
}

export default KitchenHeader;
