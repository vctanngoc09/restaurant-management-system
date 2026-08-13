import { Eye, Printer, XCircle } from "lucide-react";

import { ORDER_STATUS, ORDER_TYPE } from "../../../../../constants/orderStatus";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import OrderStatusBadge from "../OrderStatusBadge/OrderStatusBadge";

import styles from "./OrderTable.module.css";

function getOrderTypeLabel(type) {
  switch (type) {
    case ORDER_TYPE.DINE_IN:
      return "Tại chỗ";

    case ORDER_TYPE.TAKE_AWAY:
      return "Mang về";

    case ORDER_TYPE.DELIVERY:
      return "Giao hàng";

    default:
      return "Không xác định";
  }
}

function OrderTable({ orders, onView, onPrint, onCancel }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã Đơn</th>

            <th>Loại / Bàn</th>

            <th>Thời Gian</th>

            <th>Phục Vụ</th>

            <th>Tổng Tiền</th>

            <th>Trạng Thái</th>

            <th className={styles.actionHeading}>Thao Tác</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>
                Không tìm thấy đơn hàng nào khớp điều kiện.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const canCancel =
                order.status !== ORDER_STATUS.CANCELLED &&
                order.status !== ORDER_STATUS.COMPLETED;

              return (
                <tr key={order.id}>
                  <td className={styles.orderId}>{order.id}</td>

                  <td>
                    <strong className={styles.tableName}>
                      {order.tableName}
                    </strong>

                    <span className={styles.orderMeta}>
                      {getOrderTypeLabel(order.orderType)}

                      {order.orderType === ORDER_TYPE.DINE_IN &&
                        ` • ${order.guestCount || 1} khách`}
                    </span>
                  </td>

                  <td className={styles.createdAt}>{order.createdAt}</td>

                  <td className={styles.waiter}>{order.waiterName}</td>

                  <td className={styles.amount}>
                    {formatCurrency(order.totalAmount)}
                  </td>

                  <td>
                    <OrderStatusBadge
                      status={order.status}
                      label={order.progressLabel}
                    />
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        title="Xem chi tiết đơn"
                        className={styles.normalButton}
                        onClick={() => onView(order)}
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        title="In hóa đơn"
                        className={styles.normalButton}
                        onClick={() => onPrint(order)}
                      >
                        <Printer size={15} />
                      </button>

                      {canCancel && (
                        <button
                          type="button"
                          title="Hủy đơn"
                          className={styles.cancelButton}
                          onClick={() => onCancel(order)}
                        >
                          <XCircle size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
