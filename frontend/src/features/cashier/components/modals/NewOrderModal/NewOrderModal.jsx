import { Bike, Building2, Minus, Plus, ShoppingBag, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import styles from "./NewOrderModal.module.css";

function NewOrderModal({ open, tables, onClose, onStart }) {
  const [orderType, setOrderType] = useState("dine_in");

  const [tableId, setTableId] = useState("");

  const [guestCount, setGuestCount] = useState(2);

  const availableTables = useMemo(
    () => tables.filter((table) => table.status === "empty"),
    [tables],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setOrderType("dine_in");
    setGuestCount(2);
    setTableId(availableTables[0]?.id || "");
  }, [open, availableTables]);

  if (!open) {
    return null;
  }

  const handleStart = () => {
    if (orderType === "dine_in" && !tableId) {
      toast.warning("Hiện không còn bàn trống.");

      return;
    }

    onStart({
      orderType,
      tableId: orderType === "dine_in" ? tableId : null,
      guestCount,
    });
  };

  return (
    <div className={styles.modalOverlay} onMouseDown={onClose}>
      <div
        className={`${styles.modalBox} ${styles.newOrderModal}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>Tạo Đơn Hàng Mới</h2>

          <button
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div>
            <label className={styles.formLabel}>LOẠI ĐƠN HÀNG</label>

            <div className={styles.orderTypeSelector}>
              <button
                type="button"
                className={
                  orderType === "dine_in" ? styles.orderTypeSelected : ""
                }
                onClick={() => setOrderType("dine_in")}
              >
                <Building2 size={19} />
                <span>Tại Chỗ</span>
              </button>

              <button
                type="button"
                className={
                  orderType === "take_away" ? styles.orderTypeSelected : ""
                }
                onClick={() => setOrderType("take_away")}
              >
                <ShoppingBag size={19} />
                <span>Mang Về</span>
              </button>

              <button
                type="button"
                className={
                  orderType === "delivery" ? styles.orderTypeSelected : ""
                }
                onClick={() => setOrderType("delivery")}
              >
                <Bike size={19} />
                <span>Giao Hàng</span>
              </button>
            </div>
          </div>

          {orderType === "dine_in" && (
            <>
              <div>
                <label className={styles.formLabel}>CHỌN BÀN</label>

                <select
                  className={styles.formControl}
                  value={tableId}
                  onChange={(event) => setTableId(event.target.value)}
                >
                  {availableTables.length === 0 ? (
                    <option value="">Không còn bàn trống</option>
                  ) : (
                    availableTables.map((table) => (
                      <option key={table.id} value={table.id}>
                        Bàn {table.number} -{" "}
                        {table.area === "indoor" ? "Trong nhà" : "Ngoài trời"}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className={styles.formLabel}>SỐ LƯỢNG KHÁCH</label>

                <div className={styles.guestCounter}>
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((prev) => Math.max(1, prev - 1))
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <strong>{guestCount} khách</strong>

                  <button
                    type="button"
                    onClick={() => setGuestCount((prev) => prev + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            className={styles.modalPrimaryButton}
            onClick={handleStart}
          >
            <Plus size={17} />
            MỞ MÀN HÌNH CHỌN MÓN
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewOrderModal;
