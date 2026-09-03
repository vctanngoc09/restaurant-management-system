import {
  ArrowRight,
  CreditCard,
  ImageIcon,
  MessageSquare,
  Minus,
  Plus,
  Search,
  Trash2,
  Utensils,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import styles from "./OrderingModal.module.css";
import TakeawayDeliveryCheckout from "../TakeawayDeliveryCheckout/TakeawayDeliveryCheckout";

// ==================================================
// ITEM STATUS
// ==================================================

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

// ==================================================
// COMPONENT
// ==================================================

function OrderingModal({
  open,

  selectedTable,
  selectedOrder,

  orderType,
  guestCount,

  shippingDetail,

  menuItems,

  restaurantSetting,
  promotions,

  onClose,
  onSave,

  onCreatePrepaidOrder,
  onPayCash,
  onCreateVietQr,
  onGetVietQrStatus,
  onCompleteVietQr,
}) {
  // ==================================================
  // FILTER
  // ==================================================

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  // ==================================================
  // NEW ITEMS
  //
  // selectedOrder.items
  // = món đã gọi trước đó
  //
  // items
  // = món mới đang chọn / món gọi thêm
  // ==================================================

  const [items, setItems] = useState([]);

  // ==================================================
  // ITEM NOTE
  // Ghi chú riêng từng món
  // ==================================================

  const [noteIndex, setNoteIndex] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  // ==================================================
  // ORDER NOTE
  // Ghi chú chung toàn đơn
  //
  // UI ONLY
  // Chưa gửi backend ở bước này
  // ==================================================

  const [orderNote, setOrderNote] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const isOrderNoteLocked = Boolean(
    selectedOrder && selectedOrder.items?.length > 0,
  );

  // ==================================================
  // CATEGORIES
  // FROM API MENU
  // ==================================================

  const categories = useMemo(() => {
    const map = new Map();

    menuItems.forEach((item) => {
      if (item.categoryId !== null && item.categoryId !== undefined) {
        map.set(String(item.categoryId), {
          id: String(item.categoryId),
          label: item.categoryName || "Chưa phân loại",
        });
      }
    });

    return [
      {
        id: "all",
        label: "Tất cả món",
      },

      ...Array.from(map.values()),
    ];
  }, [menuItems]);

  // ==================================================
  // RESET WHEN OPEN
  // ==================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setCategory("all");
    setSearch("");

    setNoteIndex(null);
    setNoteValue("");

    setOrderNote(selectedOrder?.note || "");

    setItems([]);

    setShowCheckout(false);
  }, [open, selectedOrder?.backendId]);

  // ==================================================
  // FILTERED MENU
  // ==================================================

  const filteredMenuItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const categoryMatch =
        category === "all" || String(item.categoryId) === String(category);

      const searchMatch = !query || item.name?.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [menuItems, category, search]);

  // ==================================================
  // CLOSED
  // ==================================================

  if (!open) {
    return null;
  }

  // ==================================================
  // ADD ITEM
  // ==================================================

  const addItem = (menuItem) => {
    if (menuItem.status === "out_of_stock") {
      toast.warning(`${menuItem.name} hiện đã hết món.`);
      return;
    }

    setItems((prev) => {
      const index = prev.findIndex((item) => item.menuItem.id === menuItem.id);

      // ==================================================
      // EXISTING IN NEW CART
      // ==================================================

      if (index !== -1) {
        return prev.map((item, currentIndex) =>
          currentIndex === index
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      // ==================================================
      // NEW
      // ==================================================

      return [
        ...prev,
        {
          id: null,
          menuItem,
          quantity: 1,
          note: "",
        },
      ];
    });
  };

  // ==================================================
  // UPDATE QUANTITY
  // ==================================================

  const updateQuantity = (index, delta) => {
    setItems((prev) => {
      const target = prev[index];

      if (!target) {
        return prev;
      }

      const quantity = target.quantity + delta;

      // ==================================================
      // REMOVE IF <= 0
      // ==================================================

      if (quantity <= 0) {
        return prev.filter((_, currentIndex) => currentIndex !== index);
      }

      // ==================================================
      // UPDATE
      // ==================================================

      return prev.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              quantity,
            }
          : item,
      );
    });
  };

  // ==================================================
  // REMOVE ITEM
  // ==================================================

  const removeItem = (index) => {
    setItems((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );

    if (noteIndex === index) {
      setNoteIndex(null);
      setNoteValue("");
    }
  };

  // ==================================================
  // OPEN ITEM NOTE
  // ==================================================

  const openNote = (index, note) => {
    setNoteIndex(index);
    setNoteValue(note || "");
  };

  // ==================================================
  // SAVE ITEM NOTE
  // ==================================================

  const saveNote = (index) => {
    setItems((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              note: noteValue.trim(),
            }
          : item,
      ),
    );

    setNoteIndex(null);
    setNoteValue("");
  };

  // ==================================================
  // CLEAR NEW ITEMS
  // ==================================================

  const clearItems = () => {
    setItems([]);

    setNoteIndex(null);
    setNoteValue("");
  };

  // ==================================================
  // MONEY
  // ==================================================

  const newItemsSubtotal = items.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0,
  );

  const currentOrderTotal = selectedOrder
    ? Number(selectedOrder.totalAmount || selectedOrder.subtotal || 0)
    : 0;

  /*
   * Đơn cũ:
   * backend đang quản lý total thật nên UI chỉ
   * cộng phần món mới để hiển thị dự kiến.
   *
   * Đơn mới:
   * giữ VAT UI cũ.
   */
  const vatRate = Number(restaurantSetting?.vatRate) || 0;

  const vatAmount = selectedOrder
    ? 0
    : Math.round(newItemsSubtotal * (vatRate / 100));

  const finalTotal = selectedOrder
    ? currentOrderTotal + newItemsSubtotal
    : newItemsSubtotal + vatAmount;

  // ==================================================
  // COUNTS
  // ==================================================

  const newItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const existingItemCount =
    selectedOrder?.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ) || 0;

  // ==================================================
  // TITLE
  // ==================================================

  const getTitle = () => {
    if (selectedTable) {
      return `Bàn ${selectedTable.number}`;
    }

    if (orderType === "take_away") {
      return "Đơn Mang Về";
    }

    if (orderType === "delivery") {
      return "Đơn Giao Hàng";
    }

    return "Đơn Tại Chỗ";
  };

  // ==================================================
  // SAVE
  // ==================================================

  const isPrepaidOrder =
    !selectedOrder && (orderType === "take_away" || orderType === "delivery");

  const handleContinueCheckout = () => {
    if (items.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một món.");

      return;
    }

    setShowCheckout(true);
  };

  const handleSave = () => {
    if (items.length === 0) {
      toast.warning(
        selectedOrder
          ? "Vui lòng chọn ít nhất một món gọi thêm."
          : "Vui lòng chọn ít nhất một món.",
      );

      return;
    }

    // ==================================================
    // EXISTING ORDER
    //
    // Note đã khóa.
    // Chỉ gửi món gọi thêm.
    // ==================================================

    if (selectedOrder) {
      onSave(items);

      return;
    }

    // ==================================================
    // NEW ORDER
    //
    // Gửi cả món + ghi chú tổng.
    // ==================================================

    onSave(items, orderNote.trim());
  };

  // ==================================================
  // PAYMENT
  // UI ONLY
  // ==================================================

  const handlePayment = () => {
    toast.info(
      "Nút Thanh Toán hiện mới là giao diện. API sẽ được gắn ở bước tiếp theo.",
    );
  };

  // ==================================================
  // TAKE AWAY / DELIVERY CHECKOUT
  // ==================================================

  if (showCheckout && isPrepaidOrder) {
    return (
      <TakeawayDeliveryCheckout
        orderType={orderType}
        items={items}
        orderNote={orderNote}
        shippingDetail={shippingDetail}
        restaurantSetting={restaurantSetting}
        promotions={promotions}
        onCreateOrder={onCreatePrepaidOrder}
        onPayCash={onPayCash}
        onCreateVietQr={onCreateVietQr}
        onGetVietQrStatus={onGetVietQrStatus}
        onCompleteVietQr={onCompleteVietQr}
        onBackToMenu={() => setShowCheckout(false)}
        onClose={onClose}
      />
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <header className={styles.modalHeader}>
          <div>
            <h2>{getTitle()}</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            title="Đóng"
          >
            <X size={19} />
          </button>
        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className={styles.content}>
          {/* ==================================================
              MENU
          ================================================== */}

          <main className={styles.menu}>
            {/* ==================================================
                FILTER
            ================================================== */}

            <div className={styles.filters}>
              {/* ==================================================
                  CATEGORY
              ================================================== */}

              <div className={styles.categories}>
                {categories.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      category === item.id ? styles.categoryActive : ""
                    }
                    onClick={() => setCategory(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* ==================================================
                  SEARCH
              ================================================== */}

              <div className={styles.search}>
                <Search size={16} />

                <input
                  type="text"
                  value={search}
                  placeholder="Tìm tên món..."
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            {/* ==================================================
                MENU GRID
            ================================================== */}

            <div className={styles.menuGrid}>
              {filteredMenuItems.map((menuItem) => {
                const inStock = menuItem.status === "in_stock";

                const cartItem = items.find(
                  (item) => item.menuItem.id === menuItem.id,
                );

                return (
                  <article key={menuItem.id} className={styles.menuItem}>
                    {/* ==================================================
                          IMAGE
                      ================================================== */}

                    <div className={styles.imageBox}>
                      {menuItem.urlImg ? (
                        <img
                          src={menuItem.urlImg}
                          alt={menuItem.name}
                          loading="lazy"
                          className={!inStock ? styles.outOfStockImage : ""}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <ImageIcon size={32} />
                        </div>
                      )}

                      {/* ==================================================
                            STOCK
                        ================================================== */}

                      <span
                        className={`${styles.stockBadge} ${
                          inStock
                            ? styles.availableBadge
                            : styles.outOfStockBadge
                        }`}
                      >
                        <i />

                        {inStock ? "Còn món" : "Hết món"}
                      </span>

                      {/* ==================================================
                            SELECTED COUNT
                        ================================================== */}

                      {cartItem && (
                        <span className={styles.cartCount}>
                          {cartItem.quantity}x
                        </span>
                      )}
                    </div>

                    {/* ==================================================
                          INFO
                      ================================================== */}

                    <div className={styles.menuInfo}>
                      <div className={styles.menuText}>
                        <h3 title={menuItem.name}>{menuItem.name}</h3>

                        <p>{menuItem.categoryName}</p>
                      </div>

                      {/* ==================================================
                            FOOTER
                        ================================================== */}

                      <div className={styles.menuFooter}>
                        <strong className={styles.price}>
                          {Number(menuItem.price || 0).toLocaleString("vi-VN")}đ
                        </strong>

                        <button
                          type="button"
                          className={styles.addButton}
                          disabled={!inStock}
                          title={
                            inStock
                              ? `Thêm ${menuItem.name}`
                              : "Món hiện đã hết"
                          }
                          onClick={() => addItem(menuItem)}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ==================================================
                EMPTY MENU
            ================================================== */}

            {filteredMenuItems.length === 0 && (
              <div className={styles.noMenuData}>
                Không tìm thấy món phù hợp.
              </div>
            )}
          </main>

          {/* ==================================================
              ORDER SIDE CARD
          ================================================== */}

          <aside className={styles.cart}>
            <div className={styles.cartBody}>
              {/* ==================================================
                  CART HEADER
              ================================================== */}

              <div className={styles.cartHeader}>
                <div>
                  <h2>Chi Tiết Đơn Gọi</h2>
                </div>

                {items.length > 0 && (
                  <button type="button" onClick={clearItems}>
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* ==================================================
                  ORDER NOTE
                  NOTE CHUNG TOÀN ĐƠN
              ================================================== */}

              {/* ==================================================
    ORDER NOTE
================================================== */}

              <div
                className={`${styles.orderNote} ${
                  isOrderNoteLocked ? styles.orderNoteLocked : ""
                }`}
              >
                <div className={styles.orderNoteHeader}>
                  <div>
                    <MessageSquare size={12} />

                    <span>Ghi chú</span>

                    {isOrderNoteLocked && (
                      <span className={styles.orderNoteLockedLabel}>
                        Đã khóa
                      </span>
                    )}
                  </div>

                  {!isOrderNoteLocked && (
                    <span className={styles.orderNoteCount}>
                      {orderNote.length}/500
                    </span>
                  )}
                </div>

                <textarea
                  value={orderNote}
                  maxLength={500}
                  rows={1}
                  readOnly={isOrderNoteLocked}
                  placeholder={
                    isOrderNoteLocked
                      ? "Không có ghi chú."
                      : "Ví dụ: khách không ăn hành..."
                  }
                  onChange={(event) => {
                    if (isOrderNoteLocked) {
                      return;
                    }

                    setOrderNote(event.target.value);
                  }}
                />
              </div>

              {/* ==================================================
                  CART CONTENT
              ================================================== */}

              <div className={styles.cartContent}>
                {/* ==================================================
                    NEW ITEMS
                ================================================== */}

                {items.length > 0 && (
                  <section className={styles.newItemsSection}>
                    <span className={styles.sectionBadge}>
                      {selectedOrder
                        ? `Món gọi thêm (${newItemCount})`
                        : `Món mới chọn (${newItemCount})`}
                    </span>

                    <div className={styles.itemList}>
                      {items.map((item, index) => (
                        <article
                          key={item.menuItem.id}
                          className={styles.newItem}
                        >
                          {/* ==================================================
                                ITEM TOP
                            ================================================== */}

                          <div className={styles.itemTop}>
                            <div>
                              <h3>{item.menuItem.name}</h3>

                              <strong>
                                {(
                                  item.menuItem.price * item.quantity
                                ).toLocaleString("vi-VN")}
                                đ
                              </strong>
                            </div>

                            {/* ==================================================
                                  QUANTITY
                              ================================================== */}

                            <div className={styles.quantity}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(index, -1)}
                              >
                                <Minus size={13} />
                              </button>

                              <strong>{item.quantity}</strong>

                              <button
                                type="button"
                                onClick={() => updateQuantity(index, 1)}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* ==================================================
                                ITEM NOTE
                            ================================================== */}

                          {noteIndex === index ? (
                            <div className={styles.noteEditor}>
                              <input
                                type="text"
                                value={noteValue}
                                placeholder="Ghi chú: ít hành, không giá..."
                                onChange={(event) =>
                                  setNoteValue(event.target.value)
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    saveNote(index);
                                  }
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => saveNote(index)}
                              >
                                Lưu
                              </button>
                            </div>
                          ) : (
                            <div className={styles.itemActions}>
                              <button
                                type="button"
                                className={styles.noteButton}
                                onClick={() => openNote(index, item.note)}
                              >
                                <MessageSquare size={13} />

                                {item.note
                                  ? `Ghi chú: ${item.note}`
                                  : "Thêm ghi chú"}
                              </button>

                              <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => removeItem(index)}
                                title="Xóa món"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {/* ==================================================
                    EXISTING ITEMS
                ================================================== */}

                {selectedOrder?.items?.length > 0 && (
                  <section className={styles.existingSection}>
                    <div className={styles.existingHeader}>
                      <span className={styles.existingBadge}>
                        Món đang phục vụ
                      </span>

                      <span className={styles.existingCount}>
                        {existingItemCount} món
                      </span>
                    </div>

                    <div className={styles.existingItems}>
                      {selectedOrder.items.map((item) => {
                        const status =
                          ITEM_STATUS[item.status] || ITEM_STATUS.pending;

                        return (
                          <article
                            key={item.id}
                            className={styles.existingItem}
                          >
                            {/* ==================================================
                                  MAIN
                              ================================================== */}

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
                                {(item.price * item.quantity).toLocaleString(
                                  "vi-VN",
                                )}
                                đ
                              </strong>
                            </div>

                            {/* ==================================================
                                  FOOTER
                              ================================================== */}

                            <div className={styles.existingItemFooter}>
                              <span
                                className={`${styles.statusBadge} ${
                                  styles[status.className]
                                }`}
                              >
                                {status.label}
                              </span>

                              <span className={styles.unitPrice}>
                                {Number(item.price || 0).toLocaleString(
                                  "vi-VN",
                                )}
                                đ / món
                              </span>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ==================================================
                    EMPTY CART
                ================================================== */}

                {items.length === 0 && !selectedOrder?.items?.length && (
                  <div className={styles.emptyCart}>
                    <span>
                      <Utensils size={25} />
                    </span>

                    <h3>Chưa có món nào</h3>

                    <p>Chọn món từ thực đơn để thêm vào đơn gọi này.</p>
                  </div>
                )}

                {/* ==================================================
                    EXISTING ONLY
                ================================================== */}

                {selectedOrder &&
                  items.length === 0 &&
                  selectedOrder.items?.length > 0 && (
                    <div className={styles.addMoreHint}>
                      Chọn món bên trái nếu khách muốn gọi thêm.
                    </div>
                  )}
              </div>
            </div>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className={styles.summary}>
              <div className={styles.calculation}>
                {/* ==================================================
                    CURRENT ORDER TOTAL
                ================================================== */}

                {selectedOrder && (
                  <p>
                    <span>Tổng đơn hiện tại:</span>

                    <span>{currentOrderTotal.toLocaleString("vi-VN")}đ</span>
                  </p>
                )}

                {/* ==================================================
                    NEW ITEMS TOTAL
                ================================================== */}

                <p>
                  <span>
                    {selectedOrder ? "Món gọi thêm:" : "Tạm tính món ăn:"}
                  </span>

                  <span>{newItemsSubtotal.toLocaleString("vi-VN")}đ</span>
                </p>

                {/* ==================================================
                    VAT NEW ORDER
                ================================================== */}

                {!selectedOrder && (
                  <p>
                    <span>Thuế VAT ({vatRate}%):</span>

                    <span>{vatAmount.toLocaleString("vi-VN")}đ</span>
                  </p>
                )}

                {/* ==================================================
                    TOTAL
                ================================================== */}

                <div>
                  <strong>
                    {selectedOrder ? "Tổng sau khi thêm:" : "Tổng thanh toán:"}
                  </strong>

                  <strong>{finalTotal.toLocaleString("vi-VN")}đ</strong>
                </div>
              </div>

              {/* ==================================================
                  ACTIONS
              ================================================== */}

              {selectedOrder ? (
                <div className={styles.orderActions}>
                  <button
                    type="button"
                    className={styles.submitButton}
                    disabled={items.length === 0}
                    onClick={handleSave}
                  >
                    <Plus size={15} />
                    Gửi Thêm Món
                  </button>

                  <button
                    type="button"
                    className={styles.paymentButton}
                    onClick={handlePayment}
                  >
                    <CreditCard size={15} />
                    Thanh Toán
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.submitButton}
                  disabled={items.length === 0}
                  onClick={isPrepaidOrder ? handleContinueCheckout : handleSave}
                >
                  {isPrepaidOrder ? (
                    <>
                      Tiếp Tục
                      <ArrowRight size={15} />
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      Tạo Đơn Hàng
                    </>
                  )}
                </button>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default OrderingModal;
