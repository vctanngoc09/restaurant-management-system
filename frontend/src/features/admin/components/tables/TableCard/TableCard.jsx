import {
  Armchair,
  RotateCcw,
  Utensils,
} from "lucide-react";

import {
  ActionButton,
  ActionGroup,
} from "../../../../../components/common/ActionButton";

import {
  formatCurrency,
} from "../../../../../utils/formatCurrency";

import styles from "./TableCard.module.css";


// =========================
// STATUS LABEL
// =========================

const STATUS_LABELS = {
  AVAILABLE: "Bàn trống",

  OCCUPIED: "Đang có khách",

  MAINTENANCE: "Đang bảo trì",

  INACTIVE: "Ngừng hoạt động",
};


function TableCard({
                     table,
                     onEdit,
                     onDelete,
                     onRestore,
                   }) {

  // =========================
  // STATUS
  // =========================

  const isOccupied =
      table.status === "OCCUPIED";

  const isMaintenance =
      table.status === "MAINTENANCE";

  const isInactive =
      table.status === "INACTIVE";

  const isAvailable =
      table.status === "AVAILABLE";


  // =========================
  // AREA
  // =========================

  const areaName =
      table.areaName ||
      "Chưa có khu vực";


  const isOutdoor =
      areaName
          .toLowerCase()
          .includes("ngoài");


  // =========================
  // TEMP ORDER DATA
  // Sau này lấy từ Order
  // =========================

  const tempItemCount = 3;

  const tempCurrentTotal = 120000;


  // =========================
  // CARD STYLE
  // =========================

  const cardClass =
      isOccupied
          ? styles.occupied

          : isMaintenance
              ? styles.maintenance

              : isInactive
                  ? styles.inactive

                  : styles.empty;


  const dotClass =
      isOccupied
          ? styles.occupiedDot

          : isMaintenance
              ? styles.maintenanceDot

              : isInactive
                  ? styles.inactiveDot

                  : styles.emptyDot;


  return (
      <article
          className={
            `${styles.card} ${cardClass}`
          }
      >

        {/* =========================
          TOP
      ========================= */}

        <div className={styles.top}>

          <div
              className={
                styles.tableName
              }
          >

            <Armchair size={17} />

            <strong>
              {table.tableNumber}
            </strong>

          </div>


          <span
              className={
                isOutdoor
                    ? styles.outdoorBadge
                    : styles.indoorBadge
              }
          >
          {areaName}
        </span>

        </div>


        {/* =========================
          CONTENT
      ========================= */}

        <div
            className={
              styles.content
            }
        >

          {/* STATUS */}

          <div
              className={
                styles.statusRow
              }
          >

          <span
              className={
                `${styles.statusDot} ${dotClass}`
              }
          />


            <span
                className={
                  styles.statusLabel
                }
            >
            {
                STATUS_LABELS[
                    table.status
                    ] ||
                table.status
            }
          </span>

          </div>


          {/* =========================
            OCCUPIED
        ========================= */}

          {isOccupied && (

              <div
                  className={
                    styles.occupiedInfo
                  }
              >

                <div>

                  <Utensils
                      size={14}
                  />

                  <span>
                {tempItemCount} món
              </span>

                </div>


                <strong>
                  {formatCurrency(
                      tempCurrentTotal,
                  )}
                </strong>

              </div>

          )}


          {/* =========================
            AVAILABLE
        ========================= */}

          {isAvailable && (

              <p
                  className={
                    styles.readyText
                  }
              >
                Sẵn sàng đón khách
              </p>

          )}


          {/* =========================
            MAINTENANCE
        ========================= */}

          {isMaintenance && (

              <p
                  className={
                    styles.readyText
                  }
              >
                Bàn đang tạm dừng để bảo trì
              </p>

          )}


          {/* =========================
            INACTIVE
        ========================= */}

          {isInactive && (

              <p
                  className={
                    styles.readyText
                  }
              >
                Bàn đã ngừng hoạt động
              </p>

          )}

        </div>


        {/* =========================
          FOOTER
      ========================= */}

        <footer
            className={
              styles.footer
            }
        >

        <span
            className={
              styles.tableId
            }
        >
          ID: {table.id}
        </span>


          <ActionGroup>

            {/* EDIT */}

            <ActionButton
                action="edit"

                title={
                  `Sửa bàn ${table.tableNumber}`
                }

                onClick={() =>
                    onEdit?.(table)
                }
            />


            {/* =========================
              INACTIVE -> RESTORE
          ========================= */}

            {isInactive ? (

                <button
                    type="button"

                    className={
                      styles.restoreButton
                    }

                    title={
                      `Khôi phục bàn ${table.tableNumber}`
                    }

                    onClick={() =>
                        onRestore?.(table)
                    }
                >
                  <RotateCcw
                      size={15}
                  />
                </button>

            ) : (

                /* =========================
                    ACTIVE -> DELETE
                ========================= */

                <ActionButton
                    action="delete"

                    title={
                      `Ngừng hoạt động bàn ${table.tableNumber}`
                    }

                    onClick={() =>
                        onDelete?.(table)
                    }
                />

            )}

          </ActionGroup>

        </footer>

      </article>
  );
}

export default TableCard;