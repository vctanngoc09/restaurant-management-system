import { CheckCircle2, ChefHat, PackageCheck } from "lucide-react";

import KitchenTicket from "../KitchenTicket/KitchenTicket";

import styles from "./KitchenColumn.module.css";

const COLUMN_CONFIG = {
  waiting: {
    emptyTitle: "Không Có Phiếu Chờ",

    emptyDescription: "Phiếu mới từ phục vụ sẽ xuất hiện tại đây.",

    icon: CheckCircle2,
  },

  processing: {
    emptyTitle: "Chưa Có Phiếu Đang Nấu",

    emptyDescription: "Nhấn bắt đầu ở phiếu chờ để chuyển sang khu đang nấu.",

    icon: ChefHat,
  },

  ready: {
    emptyTitle: "Chưa Có Món Sẵn Sàng",

    emptyDescription: "Phiếu hoàn thành sẽ chờ nhân viên phục vụ tới nhận.",

    icon: PackageCheck,
  },
};

function KitchenColumn({
  type,
  title,

  tickets,

  getElapsed,

  actionKey,

  onStartTicket,
  onItemAction,

  onCompleteTicket,
}) {
  const config = COLUMN_CONFIG[type];

  const EmptyIcon = config.icon;

  const itemCount = tickets.reduce(
    (total, ticket) => total + ticket.items.length,
    0,
  );

  return (
    <section className={`${styles.column} ${styles[type]}`}>
      <div className={styles.columnHeader}>
        <h2>
          <span className={`${styles.dot} ${styles[`${type}Dot`]}`} />
          {title} ({itemCount})
        </h2>

        <span>{tickets.length} phiếu</span>
      </div>

      {tickets.length === 0 ? (
        <div className={styles.emptyState}>
          <EmptyIcon
            size={34}
            className={
              type === "ready" ? styles.emptySuccess : styles.emptyIcon
            }
          />

          <h3>{config.emptyTitle}</h3>

          <p>{config.emptyDescription}</p>
        </div>
      ) : (
        <div className={styles.tickets}>
          {tickets.map((ticket) => (
            <KitchenTicket
              key={ticket.id}
              type={type}
              ticket={ticket}
              elapsed={getElapsed(ticket)}
              actionKey={actionKey}
              onStartTicket={onStartTicket}
              onItemAction={onItemAction}
              onCompleteTicket={onCompleteTicket}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default KitchenColumn;
