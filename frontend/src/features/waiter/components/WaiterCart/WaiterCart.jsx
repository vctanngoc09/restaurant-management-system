import {
  CreditCard,
  MessageSquare,
  Minus,
  Plus,
  Send,
  Utensils,
} from "lucide-react";

import { useState } from "react";

import styles from "./WaiterCart.module.css";

function WaiterCart({
  table,
  orderType,

  existingOrder,

  cart,

  subtotal,
  vatAmount,
  totalAmount,

  onUpdateQuantity,
  onUpdateNote,
  onClear,

  onSend,
  onRequestPayment,
}) {
  const [editingIndex, setEditingIndex] = useState(null);

  const [tempNote, setTempNote] = useState("");

  const saveNote = (index) => {
    onUpdateNote(index, tempNote.trim());

    setEditingIndex(null);
    setTempNote("");
  };

  const newItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const title =
    orderType === "dine_in"
      ? `Bàn ${table?.number || ""}`
      : orderType === "take_away"
        ? "Đơn Mang Về"
        : "Đơn Giao Hàng";

  return (
    <aside className={styles.cart}>
      <div>
        <div className={styles.header}>
          <div>
            <h2>Chi Tiết Đơn Gọi</h2>

            <p>{title}</p>
          </div>

          {cart.length > 0 && (
            <button type="button" onClick={onClear}>
              Xóa tất cả
            </button>
          )}
        </div>

        <div className={styles.content}>
          {cart.length > 0 && (
            <section className={styles.newItemsSection}>
              <span className={styles.sectionBadge}>
                Món mới chọn ({newItemCount})
              </span>

              <div className={styles.itemList}>
                {cart.map((item, index) => (
                  <article key={item.menuItem.id} className={styles.newItem}>
                    <div className={styles.itemTop}>
                      <div>
                        <h3>{item.menuItem.name}</h3>

                        <strong>
                          {(item.menuItem.price * item.quantity).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </strong>
                      </div>

                      <div className={styles.quantity}>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, -1)}
                        >
                          <Minus size={12} />
                        </button>

                        <strong>{item.quantity}</strong>

                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {editingIndex === index ? (
                      <div className={styles.noteEditor}>
                        <input
                          value={tempNote}
                          placeholder="Ghi chú: ít hành, không giá..."
                          onChange={(event) => setTempNote(event.target.value)}
                        />

                        <button type="button" onClick={() => saveNote(index)}>
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.noteButton}
                        onClick={() => {
                          setEditingIndex(index);

                          setTempNote(item.note || "");
                        }}
                      >
                        <MessageSquare size={12} />

                        {item.note ? `Ghi chú: ${item.note}` : "+ Thêm ghi chú"}
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {existingOrder?.items?.length > 0 && (
            <section className={styles.existingSection}>
              <span className={styles.existingBadge}>
                Món đang phục vụ ({existingOrder.items.length} món)
              </span>

              <div className={styles.existingItems}>
                {existingOrder.items.map((item) => (
                  <article key={item.id} className={styles.existingItem}>
                    <div>
                      <p>
                        <strong>{item.quantity}x</strong>

                        <span>{item.name}</span>
                      </p>

                      {item.note && <small>Ghi chú: {item.note}</small>}
                    </div>

                    <strong>
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </strong>
                  </article>
                ))}
              </div>
            </section>
          )}

          {cart.length === 0 && !existingOrder?.items?.length && (
            <div className={styles.emptyCart}>
              <span>
                <Utensils size={25} />
              </span>

              <h3>Chưa có món nào</h3>

              <p>Chọn món từ thực đơn để thêm vào đơn gọi này.</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.calculation}>
          <p>
            <span>Tạm tính món ăn:</span>

            <span>{subtotal.toLocaleString("vi-VN")}đ</span>
          </p>

          <p>
            <span>Thuế VAT (8%):</span>

            <span>{vatAmount.toLocaleString("vi-VN")}đ</span>
          </p>

          <div>
            <strong>Tổng thanh toán:</strong>

            <strong>{totalAmount.toLocaleString("vi-VN")}đ</strong>
          </div>
        </div>

        <button type="button" className={styles.sendButton} onClick={onSend}>
          <Send size={17} />
          Gửi Đơn Xuống Bếp
        </button>

        {existingOrder && (
          <button
            type="button"
            className={styles.paymentButton}
            onClick={onRequestPayment}
          >
            <CreditCard size={16} />
            Yêu Cầu Thanh Toán
          </button>
        )}
      </div>
    </aside>
  );
}

export default WaiterCart;
