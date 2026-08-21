import { MessageSquare, Minus, Plus, Search, Trash2, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import styles from "./OrderingModal.module.css";

const CATEGORIES = [
  {
    id: "all",
    label: "Tất cả",
  },
  {
    id: "hu_tieu",
    label: "Hủ Tiếu",
  },
  {
    id: "khai_vi",
    label: "Món Khai Vị",
  },
  {
    id: "do_uong",
    label: "Đồ Uống",
  },
  {
    id: "trang_mieng",
    label: "Tráng Miệng",
  },
  {
    id: "mon_them",
    label: "Món Thêm",
  },
  {
    id: "combo",
    label: "Combo Tiết Kiệm",
  },
];

function OrderingModal({
  open,

  selectedTable,
  selectedOrder,

  orderType,
  guestCount,

  menuItems,

  onClose,
  onSave,
}) {
  const [category, setCategory] = useState("all");

  const [search, setSearch] = useState("");

  const [items, setItems] = useState([]);

  const [noteIndex, setNoteIndex] = useState(null);

  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setCategory("all");
    setSearch("");
    setNoteIndex(null);
    setNoteValue("");

    if (selectedOrder) {
      const cart = selectedOrder.items.map((orderItem) => {
        const menuItem = menuItems.find(
          (item) => item.id === orderItem.menuItemId,
        ) || {
          id: orderItem.menuItemId,
          name: orderItem.name,
          price: orderItem.price,
          category: "hu_tieu",
          status: "in_stock",
        };

        return {
          id: orderItem.id,
          menuItem,
          quantity: orderItem.quantity,
          note: orderItem.note || "",
        };
      });

      setItems(cart);
    } else {
      setItems([]);
    }
  }, [open, selectedOrder, menuItems]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, category, search]);

  if (!open) {
    return null;
  }

  const addItem = (menuItem) => {
    if (menuItem.status === "out_of_stock") {
      toast.warning(`${menuItem.name} hiện đã hết món.`);

      return;
    }

    setItems((prev) => {
      const index = prev.findIndex((item) => item.menuItem.id === menuItem.id);

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

  const updateQuantity = (index, delta) => {
    setItems((prev) => {
      const target = prev[index];

      if (!target) {
        return prev;
      }

      const newQuantity = target.quantity + delta;

      if (newQuantity <= 0) {
        return prev.filter((_, currentIndex) => currentIndex !== index);
      }

      return prev.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item,
      );
    });
  };

  const removeItem = (index) => {
    setItems((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

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

  const subtotal = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );

  const vatAmount = Math.round(subtotal * 0.08);

  const totalAmount = subtotal + vatAmount;

  const getModalTitle = () => {
    if (selectedTable) {
      return `Bàn ${selectedTable.number} / ${
        selectedTable.area === "indoor" ? "Trong nhà" : "Ngoài trời"
      }`;
    }

    if (selectedOrder) {
      return selectedOrder.tableName || selectedOrder.id;
    }

    if (orderType === "take_away") {
      return "Đơn Mang Về Mới";
    }

    if (orderType === "delivery") {
      return "Đơn Giao Hàng Mới";
    }

    return "Đơn Tại Chỗ Mới";
  };

  const handleSave = () => {
    if (items.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một món.");

      return;
    }

    onSave(items);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalBox} ${styles.orderingModal}`}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{getModalTitle()}</h2>

            <p>
              {guestCount ? `${guestCount} khách • ` : ""}
              Chọn món cho đơn hàng
            </p>
          </div>

          <button
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.orderingContent}>
          {/* LEFT */}
          <section className={styles.menuSelectionPanel}>
            <div className={styles.menuSelectionHeader}>
              <h3>
                <i />
                DANH SÁCH MÓN
              </h3>

              <div className={styles.menuSearch}>
                <Search size={15} />

                <input
                  type="text"
                  value={search}
                  placeholder="Tìm món..."
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.categoryTabs}>
              {CATEGORIES.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={category === item.id ? styles.categoryActive : ""}
                  onClick={() => setCategory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className={styles.menuItemGrid}>
              {filteredMenuItems.map((menuItem) => {
                const available = menuItem.status === "in_stock";

                return (
                  <article
                    key={menuItem.id}
                    className={`${styles.menuItemCard} ${
                      !available ? styles.menuItemDisabled : ""
                    }`}
                  >
                    <span
                      className={`${styles.stockBadge} ${
                        available ? styles.inStock : styles.outStock
                      }`}
                    >
                      {available ? "SẴN SÀNG" : "HẾT MÓN"}
                    </span>

                    <div>
                      <strong>{menuItem.name}</strong>

                      <p>{menuItem.price.toLocaleString("vi-VN")}đ</p>
                    </div>

                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => addItem(menuItem)}
                    >
                      <Plus size={17} />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* RIGHT */}
          <section className={styles.currentOrderPanel}>
            <div>
              <div className={styles.currentOrderHeader}>
                <h3>THÔNG TIN ĐƠN</h3>

                {items.length > 0 && (
                  <button type="button" onClick={() => setItems([])}>
                    <Trash2 size={14} />
                    XÓA
                  </button>
                )}
              </div>

              <div className={styles.cartItems}>
                {items.length === 0 ? (
                  <div className={styles.emptyCart}>
                    Chưa chọn món nào.
                    <br />
                    Vui lòng chọn món từ danh sách bên trái.
                  </div>
                ) : (
                  items.map((item, index) => (
                    <article
                      key={`${item.menuItem.id}-${index}`}
                      className={styles.cartItem}
                    >
                      <div className={styles.cartItemTop}>
                        <div>
                          <strong>{item.menuItem.name}</strong>

                          <p>
                            {(
                              item.menuItem.price * item.quantity
                            ).toLocaleString("vi-VN")}
                            đ
                          </p>
                        </div>

                        <div className={styles.quantityControl}>
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

                      {noteIndex === index ? (
                        <div className={styles.noteEditor}>
                          <input
                            type="text"
                            value={noteValue}
                            placeholder="Ví dụ: ít hành..."
                            onChange={(event) =>
                              setNoteValue(event.target.value)
                            }
                          />

                          <button type="button" onClick={() => saveNote(index)}>
                            Lưu
                          </button>
                        </div>
                      ) : (
                        <div className={styles.cartItemActions}>
                          <button
                            type="button"
                            onClick={() => {
                              setNoteIndex(index);

                              setNoteValue(item.note || "");
                            }}
                          >
                            <MessageSquare size={13} />

                            {item.note ? `Ghi chú: ${item.note}` : "GHI CHÚ"}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className={styles.orderCalculation}>
              <div>
                <span>Tổng tiền:</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>

              <div>
                <span>Thuế (VAT 8%):</span>

                <span>{vatAmount.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.orderGrandTotal}>
                <strong>Tổng thanh toán:</strong>

                <strong>{totalAmount.toLocaleString("vi-VN")}đ</strong>
              </div>

              <button
                type="button"
                disabled={items.length === 0}
                onClick={handleSave}
              >
                {selectedOrder ? "CẬP NHẬT ĐƠN HÀNG" : "TẠO ĐƠN HÀNG"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default OrderingModal;
