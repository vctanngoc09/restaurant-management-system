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

const ITEM_STATUS = {
  pending: {
    label: "Chờ chế biến",
    className: "pendingStatus",
  },

  cooking: {
    label: "Đang chế biến",
    className: "cookingStatus",
  },

  ready: {
    label: "Sẵn sàng",
    className: "readyStatus",
  },

  served: {
    label: "Đã phục vụ",
    className: "servedStatus",
  },

  out_of_stock: {
    label: "Hết món",
    className: "outOfStockStatus",
  },
};

function WaiterCart({
  table,
  orderType,

  existingOrder,

  cart,
  orderNote,
  onOrderNoteChange,

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

  // ==================================================
  // SAVE NOTE
  // ==================================================

  const saveNote = (index) => {
    onUpdateNote(index, tempNote.trim());

    setEditingIndex(null);

    setTempNote("");
  };

  // ==================================================
  // NEW ITEM COUNT
  // ==================================================

  const newItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ==================================================
  // TITLE
  // ==================================================

  const title =
    orderType === "dine_in"
      ? `Bàn ${table?.number || ""}`
      : orderType === "take_away"
        ? "Đơn Mang Về"
        : "Đơn Giao Hàng";

  return (
    <aside className={styles.cart}>
      {/* ==================================================
          TOP
      ================================================== */}

      <div className={styles.cartBody}>
        {/* =========================
            HEADER
        ========================= */}

        <div className={styles.header}>
          <div>
            <h2>Chi Tiết Đơn Gọi</h2>
          </div>

          {cart.length > 0 && (
            <button type="button" onClick={onClear}>
              Xóa tất cả
            </button>
          )}
        </div>

        {/* ==================================================
    ORDER NOTE
================================================== */}

        <div className={styles.orderNote}>
          <div className={styles.orderNoteTitle}>
            <MessageSquare size={14} />

            <span>Ghi chú đơn hàng</span>
          </div>

          {existingOrder ? (
            /*
             * Order đã tạo rồi.
             *
             * Hiện backend chưa có
             * API update Order.note,
             * nên chỉ hiển thị.
             */
            <div className={styles.existingOrderNote}>
              {existingOrder.note ? (
                existingOrder.note
              ) : (
                <span>Không có ghi chú</span>
              )}
            </div>
          ) : (
            /*
             * Order mới:
             * cho phép nhập note.
             */
            <textarea
              value={orderNote}
              maxLength={500}
              rows={2}
              placeholder="Ví dụ: Khách cần lên món nhanh, khách có trẻ nhỏ..."
              onChange={(event) => onOrderNoteChange(event.target.value)}
            />
          )}

          {!existingOrder && <small>{orderNote.length}/500</small>}
        </div>

        {/* =========================
            SCROLL CONTENT
        ========================= */}

        <div className={styles.content}>
          {/* ==================================================
              NEW ITEMS
          ================================================== */}

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
                          <Minus size={13} />
                        </button>

                        <strong>{item.quantity}</strong>

                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, 1)}
                        >
                          <Plus size={13} />
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
                        <MessageSquare size={13} />

                        {item.note ? `Ghi chú: ${item.note}` : "+ Thêm ghi chú"}
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              EXISTING ORDER
          ================================================== */}

          {existingOrder?.items?.length > 0 && (
            <section className={styles.existingSection}>
              <div className={styles.existingHeader}>
                <span className={styles.existingBadge}>Món đang phục vụ</span>

                <span className={styles.existingCount}>
                  {existingOrder.items.length} món
                </span>
              </div>

              <div className={styles.existingItems}>
                {existingOrder.items.map((item) => {
                  const status =
                    ITEM_STATUS[item.status] || ITEM_STATUS.pending;

                  return (
                    <article key={item.id} className={styles.existingItem}>
                      {/* =========================
                            MAIN
                        ========================= */}

                      <div className={styles.existingItemMain}>
                        <div className={styles.existingItemInfo}>
                          <div className={styles.existingItemName}>
                            <span className={styles.quantityBadge}>
                              {item.quantity}x
                            </span>

                            <h3>{item.name}</h3>
                          </div>

                          {item.note && (
                            <div className={styles.existingNote}>
                              <MessageSquare size={13} />

                              <span>{item.note}</span>
                            </div>
                          )}
                        </div>

                        <strong className={styles.existingPrice}>
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </strong>
                      </div>

                      {/* =========================
                            FOOTER
                        ========================= */}

                      <div className={styles.existingItemFooter}>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[status.className]
                          }`}
                        >
                          {status.label}
                        </span>

                        <span className={styles.unitPrice}>
                          {item.price.toLocaleString("vi-VN")}đ / món
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* ==================================================
              EMPTY
          ================================================== */}

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

      {/* ==================================================
          SUMMARY - LUÔN CỐ ĐỊNH
      ================================================== */}

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

        <div className={styles.actions}>
          <button type="button" className={styles.sendButton} onClick={onSend}>
            <Send size={16} />

            {existingOrder ? "Gửi Thêm Món" : "Gửi Đơn Xuống Bếp"}
          </button>

          {existingOrder && (
            <button
              type="button"
              className={styles.paymentButton}
              onClick={onRequestPayment}
            >
              <CreditCard size={15} />
              Yêu Cầu Thanh Toán
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default WaiterCart;
