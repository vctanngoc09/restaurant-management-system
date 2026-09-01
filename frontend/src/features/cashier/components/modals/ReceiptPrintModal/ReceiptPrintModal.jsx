import { Printer, Soup, X } from "lucide-react";

import styles from "./ReceiptPrintModal.module.css";

// ==================================================
// FORMAT MONEY
// ==================================================

function formatMoney(value, currency = "VND") {
  const amount = Number(value || 0).toLocaleString("vi-VN");

  if (currency === "VND") {
    return `${amount}đ`;
  }

  return `${amount} ${currency}`;
}

// ==================================================
// FORMAT DATE
// ==================================================

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",

    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ==================================================
// PAYMENT LABEL
// ==================================================

function getPaymentLabel(method) {
  const value = String(method || "").toUpperCase();

  switch (value) {
    case "CASH":
      return "TIỀN MẶT";

    case "VIETQR":
    case "BANK_TRANSFER":
      return "VIETQR";

    default:
      return value || "—";
  }
}

// ==================================================
// ORDER TYPE
// ==================================================

function getOrderTypeLabel(orderType, tableNumber, tableName) {
  const value = String(orderType || "").toUpperCase();

  if (value === "DINE_IN" || value === "DINE_IN") {
    if (tableNumber) {
      return `Bàn ${tableNumber}`;
    }

    return tableName || "Tại chỗ";
  }

  if (value === "TAKE_AWAY" || value === "TAKE_AWAY") {
    return "Mang về";
  }

  if (value === "DELIVERY") {
    return "Giao hàng";
  }

  return tableName || "—";
}

// ==================================================
// RECEIPT PRINT MODAL
// ==================================================

function ReceiptPrintModal({
  open,

  // PaymentReceiptResponse thật
  receipt = null,

  // giữ compatibility flow cũ
  selectedOrder = null,

  currentUserName = null,

  restaurantSetting = null,

  onClose,
}) {
  const source = receipt || selectedOrder;

  if (!open || !source) {
    return null;
  }

  // ==================================================
  // RESTAURANT
  // ==================================================

  const restaurant = receipt?.restaurant || restaurantSetting || {};

  const currency = restaurant.currency || "VND";

  // ==================================================
  // GENERAL
  // ==================================================

  const receiptCode =
    receipt?.receiptCode ||
    selectedOrder?.receiptCode ||
    selectedOrder?.id ||
    "—";

  const orderId =
    receipt?.orderId ?? selectedOrder?.backendId ?? selectedOrder?.id ?? "—";

  const orderType = receipt?.orderType || selectedOrder?.orderType;

  const tableNumber = receipt?.tableNumber || selectedOrder?.tableNumber;

  const tableName = selectedOrder?.tableName;

  const cashierName = receipt?.cashierName || currentUserName || "—";

  const paidAt =
    receipt?.paidAt || selectedOrder?.paidAt || selectedOrder?.createdAt;

  const paymentMethod = receipt?.paymentMethod || selectedOrder?.paymentMethod;

  // ==================================================
  // ITEMS
  // ==================================================

  const items = Array.isArray(receipt?.items)
    ? receipt.items
    : Array.isArray(selectedOrder?.items)
      ? selectedOrder.items
      : [];

  // ==================================================
  // MONEY
  // ==================================================

  const subtotal = Number(receipt?.subtotal ?? selectedOrder?.subtotal ?? 0);

  const discountAmount = Number(
    receipt?.discountAmount ?? selectedOrder?.discountAmount ?? 0,
  );

  const promotionCode = receipt?.promotionCode || null;

  const vatRate = Number(receipt?.vatRate ?? restaurantSetting?.vatRate ?? 0);

  const vatAmount = Number(receipt?.vatAmount ?? selectedOrder?.vatAmount ?? 0);

  const totalAmount = Number(
    receipt?.totalAmount ?? selectedOrder?.totalAmount ?? 0,
  );

  const cashReceived = Number(
    receipt?.cashReceived ?? selectedOrder?.cashReceived ?? 0,
  );

  const changeAmount = Number(
    receipt?.changeAmount ?? selectedOrder?.changeGiven ?? 0,
  );

  const isCash = String(paymentMethod || "").toUpperCase() === "CASH";

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalBox} ${styles.receiptModal}`}>
        {/* =========================
            HEADER
        ========================= */}

        <div className={styles.modalHeader}>
          <h2>
            <Printer size={18} />
            Xem Trước Hóa Đơn
          </h2>

          <button
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================
            RECEIPT
        ========================= */}

        <div className={styles.receiptBackground}>
          <div className={styles.receiptPaper}>
            {/* =========================
                RESTAURANT
            ========================= */}

            <div className={styles.receiptBrand}>
              <Soup size={27} />

              <h2>{restaurant.name || "HỦ TIẾU RESTO"}</h2>

              {restaurant.address && <p>{restaurant.address}</p>}

              {restaurant.phone && <p>Hotline: {restaurant.phone}</p>}

              {restaurant.taxCode && <p>MST: {restaurant.taxCode}</p>}

              <div className={styles.receiptDash} />

              <strong>HÓA ĐƠN THANH TOÁN</strong>
            </div>

            {/* =========================
                RECEIPT INFO
            ========================= */}

            <div className={styles.receiptInfo}>
              <p>
                Mã hóa đơn: <strong>{receiptCode}</strong>
              </p>

              <p>
                Mã đơn: <strong>#{orderId}</strong>
              </p>

              <p>
                Loại đơn:{" "}
                <strong>
                  {getOrderTypeLabel(orderType, tableNumber, tableName)}
                </strong>
              </p>

              <p>Thời gian: {formatDateTime(paidAt)}</p>

              <p>
                Thu ngân: <strong>{cashierName}</strong>
              </p>
            </div>

            <div className={styles.receiptDash} />

            {/* =========================
                ITEM HEADER
            ========================= */}

            <div className={styles.receiptItemHeader}>
              <span>TÊN MÓN</span>

              <span>SL</span>

              <span>THÀNH TIỀN</span>
            </div>

            {/* =========================
                ITEMS
            ========================= */}

            {items.map((item, index) => {
              const name = item.productName || item.name || "Món ăn";

              const quantity = Number(item.quantity || 0);

              const unitPrice = Number(item.unitPrice ?? item.price ?? 0);

              const lineTotal = Number(item.lineTotal ?? unitPrice * quantity);

              return (
                <div
                  key={item.productId || item.id || `${name}-${index}`}
                  className={styles.receiptItem}
                >
                  <strong>{name}</strong>

                  <span>{quantity}</span>

                  <span>{formatMoney(lineTotal, currency)}</span>
                </div>
              );
            })}

            <div className={styles.receiptDash} />

            {/* =========================
                CALCULATION
            ========================= */}

            <div className={styles.receiptCalculation}>
              <div>
                <span>Tạm tính:</span>

                <span>{formatMoney(subtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div>
                  <span>
                    Giảm giá
                    {promotionCode ? ` (${promotionCode})` : ""}:
                  </span>

                  <span>-{formatMoney(discountAmount, currency)}</span>
                </div>
              )}

              <div>
                <span>VAT ({vatRate}%):</span>

                <span>{formatMoney(vatAmount, currency)}</span>
              </div>

              <div className={styles.receiptTotal}>
                <strong>TỔNG CỘNG:</strong>

                <strong>{formatMoney(totalAmount, currency)}</strong>
              </div>

              {/* =========================
                  CASH
              ========================= */}

              {isCash && (
                <>
                  <div>
                    <span>Khách đưa:</span>

                    <span>{formatMoney(cashReceived, currency)}</span>
                  </div>

                  <div>
                    <span>Thừa trả lại:</span>

                    <span>{formatMoney(changeAmount, currency)}</span>
                  </div>
                </>
              )}

              <div>
                <span>Hình thức:</span>

                <strong>{getPaymentLabel(paymentMethod)}</strong>
              </div>
            </div>

            <div className={styles.receiptDash} />

            {/* =========================
                THANKS
            ========================= */}

            <div className={styles.receiptThanks}>
              <strong>Cảm ơn Quý khách & Hẹn gặp lại!</strong>
            </div>
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Đóng
          </button>

          <button
            type="button"
            className={styles.modalPrimaryButton}
            onClick={() => window.print()}
          >
            <Printer size={17} />
            IN HÓA ĐƠN NGAY
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptPrintModal;
