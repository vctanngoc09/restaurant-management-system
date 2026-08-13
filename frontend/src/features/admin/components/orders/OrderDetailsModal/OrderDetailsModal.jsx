import { Printer, X } from "lucide-react";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import OrderStatusBadge from "../OrderStatusBadge/OrderStatusBadge";

import styles from "./OrderDetailsModal.module.css";

function OrderDetailsModal({ order, onClose, onPrint }) {
  if (!order) {
    return null;
  }

  const orderTypeLabel = {
    dine_in: "Tại chỗ",
    take_away: "Mang về",
    delivery: "Giao hàng",
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <span className={styles.badge}>Chi Tiết Đơn Hàng</span>

            <h2>
              Đơn {order.id}
              {order.tableName && ` (${order.tableName})`}
            </h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        {/* ORDER INFORMATION */}
        <section className={styles.infoGrid}>
          <div>
            <span>Thời gian</span>

            <strong>{order.createdAt}</strong>
          </div>

          <div>
            <span>Phục vụ</span>

            <strong>{order.waiterName}</strong>
          </div>

          <div>
            <span>Loại đơn</span>

            <strong>
              {orderTypeLabel[order.orderType] || order.orderType}
            </strong>
          </div>

          <div>
            <span>Số khách</span>

            <strong>{order.guestCount || 1} người</strong>
          </div>

          <div className={styles.statusInfo}>
            <span>Trạng thái</span>

            <OrderStatusBadge
              status={order.status}
              label={order.progressLabel}
            />
          </div>
        </section>

        {/* ITEMS */}
        <section className={styles.itemsSection}>
          <h3>Món Ăn Đã Đặt</h3>

          <div className={styles.items}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div>
                  <strong>
                    {item.name} × {item.quantity}
                  </strong>

                  {item.note && <span>Ghi chú: {item.note}</span>}

                  <small>{formatCurrency(item.price)} / món</small>
                </div>

                <strong className={styles.itemAmount}>
                  {formatCurrency(item.price * item.quantity)}
                </strong>
              </div>
            ))}
          </div>
        </section>

        {/* BILL */}
        <section className={styles.bill}>
          <div>
            <span>Tạm tính</span>

            <strong>{formatCurrency(order.subtotal)}</strong>
          </div>

          <div>
            <span>Thuế VAT (8%)</span>

            <strong>{formatCurrency(order.vatAmount)}</strong>
          </div>

          {order.discountAmount > 0 && (
            <div>
              <span>Giảm giá</span>

              <strong>-{formatCurrency(order.discountAmount)}</strong>
            </div>
          )}

          <div className={styles.total}>
            <span>Tổng tiền</span>

            <strong>{formatCurrency(order.totalAmount)}</strong>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.printButton}
            onClick={() => onPrint(order)}
          >
            <Printer size={16} />
            In Hóa Đơn
          </button>
        </footer>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
