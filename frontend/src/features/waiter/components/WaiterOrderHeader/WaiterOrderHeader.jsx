import { ArrowLeft, MapPin, User } from "lucide-react";

import styles from "./WaiterOrderHeader.module.css";


function WaiterOrderHeader({
                             table,
                             orderType,

                             currentUserName,

                             onBack,
                           }) {
  const dineIn =
      orderType === "dine_in";


  const title =
      orderType === "take_away"
          ? "Đơn Mang Về"
          : orderType === "delivery"
              ? "Đơn Giao Hàng"
              : `Bàn ${table?.number || ""}`;


  const subtitle =
      orderType === "take_away"
          ? "Đơn khách mang về"
          : orderType === "delivery"
              ? "Đơn giao hàng"
              : "Order tại bàn";


  return (
      <section className={styles.header}>

        {/* ==================================================
          LEFT
      ================================================== */}

        <div className={styles.left}>

          <button
              type="button"
              className={styles.backButton}
              onClick={onBack}
          >
            <ArrowLeft size={16} />

            Sơ đồ bàn
          </button>


          <div className={styles.titleBlock}>

            <h1>{title}</h1>

            <p>{subtitle}</p>

          </div>

        </div>


        {/* ==================================================
          RIGHT
      ================================================== */}

        <div className={styles.right}>

          {/* STATUS */}

          {dineIn && table && (
              <span
                  className={
                    table.status === "occupied"
                        ? styles.servingBadge
                        : styles.emptyBadge
                  }
              >
            {table.status === "occupied"
                ? "Đang phục vụ"
                : "Bàn trống"}
          </span>
          )}


          {/* META */}

          <div className={styles.meta}>

            {dineIn && table && (
                <span>
              <MapPin size={13} />

                  {table.areaName ||
                      "Chưa phân khu"}
            </span>
            )}

          </div>

        </div>

      </section>
  );
}


export default WaiterOrderHeader;