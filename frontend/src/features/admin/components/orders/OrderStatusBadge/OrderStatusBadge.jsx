import { ORDER_STATUS } from "../../../../../constants/orderStatus";

import styles from "./OrderStatusBadge.module.css";

function OrderStatusBadge({ status, label }) {
  const statusClassMap = {
    [ORDER_STATUS.NEW]: styles.new,

    [ORDER_STATUS.COOKING]: styles.cooking,

    [ORDER_STATUS.READY]: styles.ready,

    [ORDER_STATUS.PENDING_PAYMENT]: styles.pendingPayment,

    [ORDER_STATUS.COMPLETED]: styles.completed,

    [ORDER_STATUS.CANCELLED]: styles.cancelled,
  };

  return (
    <span
      className={`${styles.badge} ${statusClassMap[status] || styles.default}`}
    >
      {label}
    </span>
  );
}

export default OrderStatusBadge;
