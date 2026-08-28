import styles from "./WaiterMapHeader.module.css";

function WaiterMapHeader({ tables, currentUserName }) {
  const occupied = tables.filter((table) => table.status === "occupied").length;

  const empty = tables.filter((table) => table.status === "empty").length;

  return (
    <section className={styles.header}>
      <div className={styles.title}>
        <div className={styles.titleRow}>
          <h1>Sơ Đồ Bàn Phục Vụ</h1>

          <span>WAITER POS</span>
        </div>

        <p>
          Nhân viên ca trực: <strong>{currentUserName}</strong> • Chạm vào bàn
          để bắt đầu gọi món
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.totalStat}>
          <span>TỔNG SỐ BÀN</span>

          <strong>{tables.length}</strong>
        </div>

        <div className={styles.occupiedStat}>
          <span>CÓ KHÁCH</span>

          <strong>{occupied}</strong>
        </div>

        <div className={styles.emptyStat}>
          <span>BÀN TRỐNG</span>

          <strong>{empty}</strong>
        </div>
      </div>
    </section>
  );
}

export default WaiterMapHeader;
