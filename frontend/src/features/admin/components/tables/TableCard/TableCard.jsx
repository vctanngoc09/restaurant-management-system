import {
  Armchair,
  Users,
  Utensils,
} from "lucide-react";

import {
  ActionButton,
  ActionGroup,
} from "../../../../../components/common/ActionButton";

import {
  TABLE_AREA,
  TABLE_AREA_LABELS,
  TABLE_STATUS,
  TABLE_STATUS_LABELS,
} from "../../../../../constants/tableConfig";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import styles from "./TableCard.module.css";

function TableCard({ table, onEdit, onDelete }) {
  const isOccupied = table.status === TABLE_STATUS.OCCUPIED;

  const isReserved = table.status === TABLE_STATUS.RESERVED;

  const displayCode =
    table.area === TABLE_AREA.OUTDOOR
      ? `N-${table.number}`
      : `T-${table.number}`;

  return (
    <article
      className={`${styles.card} ${
        isOccupied
          ? styles.occupied
          : isReserved
            ? styles.reserved
            : styles.empty
      }`}
    >
      {/* =========================
          TOP
      ========================= */}

      <div className={styles.top}>
        <div className={styles.tableName}>
          <Armchair size={17} />

          <strong>{displayCode}</strong>
        </div>

        <span
          className={
            table.area === TABLE_AREA.OUTDOOR
              ? styles.outdoorBadge
              : styles.indoorBadge
          }
        >
          {TABLE_AREA_LABELS[table.area]}
        </span>
      </div>

      {/* =========================
          STATUS
      ========================= */}

      <div className={styles.content}>
        <div className={styles.statusRow}>
          <span
            className={`${styles.statusDot} ${
              isOccupied
                ? styles.occupiedDot
                : isReserved
                  ? styles.reservedDot
                  : styles.emptyDot
            }`}
          />

          <span className={styles.statusLabel}>
            {TABLE_STATUS_LABELS[table.status]}
          </span>
        </div>

        {isOccupied ? (
          <div className={styles.occupiedInfo}>
            <div>
              <Users size={14} />

              <span>{table.guestCount} khách</span>
            </div>

            <div>
              <Utensils size={14} />

              <span>{table.itemCount} món</span>
            </div>

            <strong>{formatCurrency(table.currentTotal)}</strong>
          </div>
        ) : isReserved ? (
          <p className={styles.readyText}>Bàn đang được giữ chỗ</p>
        ) : (
          <p className={styles.readyText}>Sẵn sàng đón khách</p>
        )}
      </div>

      {/* =========================
          ACTIONS
      ========================= */}

      <footer className={styles.footer}>
        <span className={styles.tableId}>ID: {table.id}</span>

        <ActionGroup>
          <ActionButton
              action="edit"
              title={`Sửa bàn ${displayCode}`}
              onClick={() => onEdit(table)}
          />

          <ActionButton
              action="delete"
              title={`Xóa bàn ${displayCode}`}
              onClick={() => onDelete(table)}
          />
        </ActionGroup>
      </footer>
    </article>
  );
}

export default TableCard;
