import { Printer, Soup, X } from "lucide-react";

import styles from "./ReceiptPrintModal.module.css";

function ReceiptPrintModal({ open, selectedOrder, currentUserName, onClose }) {
  if (!open || !selectedOrder) {
    return null;
  }

  const getPaymentLabel = () => {
    switch (selectedOrder.paymentMethod) {
      case "bank_transfer":
        return "CHUYỂN KHOẢN QR";

      case "card":
        return "THẺ POS";

      default:
        return "TIỀN MẶT";
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalBox} ${styles.receiptModal}`}>
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

        <div className={styles.receiptBackground}>
          <div className={styles.receiptPaper}>
            <div className={styles.receiptBrand}>
              <Soup size={27} />

              <h2>HỦ TIẾU RESTO</h2>

              <p>123 Đường Nguyễn Trãi, Q.1, TP.HCM</p>

              <p>Hotline: 0901.234.567</p>

              <div className={styles.receiptDash} />

              <strong>HÓA ĐƠN THANH TOÁN</strong>
            </div>

            <div className={styles.receiptInfo}>
              <p>
                Mã đơn: <strong>{selectedOrder.id}</strong>
              </p>

              <p>
                Vị trí: <strong>{selectedOrder.tableName || "Mang về"}</strong>
              </p>

              <p>
                Thời gian: {selectedOrder.paidAt || selectedOrder.createdAt}
              </p>

              <p>Thu ngân: {currentUserName}</p>

              <p>Phục vụ: {selectedOrder.waiterName}</p>
            </div>

            <div className={styles.receiptDash} />

            <div className={styles.receiptItemHeader}>
              <span>TÊN MÓN</span>
              <span>SL</span>
              <span>THÀNH TIỀN</span>
            </div>

            {selectedOrder.items.map((item) => (
              <div key={item.id} className={styles.receiptItem}>
                <strong>{item.name}</strong>

                <span>{item.quantity}</span>

                <span>
                  {(item.price * item.quantity).toLocaleString("vi-VN")}
                </span>
              </div>
            ))}

            <div className={styles.receiptDash} />

            <div className={styles.receiptCalculation}>
              <div>
                <span>Tạm tính:</span>

                <span>{selectedOrder.subtotal.toLocaleString("vi-VN")}đ</span>
              </div>

              <div>
                <span>VAT 8%:</span>

                <span>{selectedOrder.vatAmount.toLocaleString("vi-VN")}đ</span>
              </div>

              {!!selectedOrder.discountAmount && (
                <div>
                  <span>Giảm giá:</span>

                  <span>
                    -{selectedOrder.discountAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}

              <div className={styles.receiptTotal}>
                <strong>TỔNG CỘNG:</strong>

                <strong>
                  {selectedOrder.totalAmount.toLocaleString("vi-VN")}đ
                </strong>
              </div>

              {selectedOrder.paymentMethod === "cash" && (
                <>
                  <div>
                    <span>Khách đưa:</span>

                    <span>
                      {(
                        selectedOrder.cashReceived || selectedOrder.totalAmount
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>

                  <div>
                    <span>Thừa trả lại:</span>

                    <span>
                      {(selectedOrder.changeGiven || 0).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>
                </>
              )}

              <div>
                <span>Hình thức:</span>

                <strong>{getPaymentLabel()}</strong>
              </div>
            </div>

            <div className={styles.receiptDash} />

            <div className={styles.receiptThanks}>
              <strong>Cảm ơn Quý khách & Hẹn gặp lại!</strong>

              <span>Pass Wi-Fi: hutieunamvang</span>
            </div>
          </div>
        </div>

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
