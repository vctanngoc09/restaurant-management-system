import { ArrowLeft, Minus, Plus, Users } from "lucide-react";

import styles from "./WaiterOrderHeader.module.css";

function WaiterOrderHeader({
  table,
  orderType,

  guestCount,

  currentUserName,

  onGuestCountChange,
  onBack,
}) {
  const dineIn = orderType === "dine_in";

  const title =
    orderType === "take_away"
      ? "Đơn Mang Về"
      : orderType === "delivery"
        ? "Đơn Giao Hàng"
        : `Bàn ${table?.number || ""}`;

  return (
    <section className={styles.header}>
      <div className={styles.left}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} />
          Sơ đồ bàn
        </button>

        <div>
          <div className={styles.titleRow}>
            <h1>{title}</h1>

            {dineIn && table && (
              <span
                className={
                  table.status === "occupied"
                    ? styles.servingBadge
                    : styles.emptyBadge
                }
              >
                {table.status === "occupied" ? "Đang phục vụ" : "Bàn trống"}
              </span>
            )}
          </div>

          <p>
            Nhân viên: <strong>{currentUserName}</strong>
            {dineIn && table && (
              <>
                {" "}
                • Khu vực: {table.area === "indoor" ? "Trong nhà" : "Sân vườn"}
              </>
            )}
          </p>
        </div>
      </div>

      {dineIn && (
        <div className={styles.guests}>
          <span>
            <Users size={14} />
            Số khách:
          </span>

          <div>
            <button
              type="button"
              onClick={() => onGuestCountChange(Math.max(1, guestCount - 1))}
            >
              <Minus size={13} />
            </button>

            <strong>{guestCount}</strong>

            <button
              type="button"
              onClick={() => onGuestCountChange(guestCount + 1)}
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default WaiterOrderHeader;
