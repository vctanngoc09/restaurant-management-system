import { Banknote, CheckCircle2, CreditCard, QrCode, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import styles from "./BillingModal.module.css";

function BillingModal({ open, selectedOrder, onClose, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [discountPercent, setDiscountPercent] = useState(0);

  const [cashReceived, setCashReceived] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setPaymentMethod("cash");
    setDiscountPercent(0);
    setCashReceived("");
  }, [open, selectedOrder?.id]);

  const payment = useMemo(() => {
    if (!selectedOrder) {
      return {
        discountAmount: 0,
        finalTotal: 0,
        received: 0,
        change: 0,
      };
    }

    const discountAmount = Math.round(
      (selectedOrder.subtotal * discountPercent) / 100,
    );

    const finalTotal = Math.max(
      0,
      selectedOrder.subtotal + selectedOrder.vatAmount - discountAmount,
    );

    const received = Number(cashReceived) || finalTotal;

    return {
      discountAmount,
      finalTotal,
      received,
      change: Math.max(0, received - finalTotal),
    };
  }, [selectedOrder, discountPercent, cashReceived]);

  if (!open || !selectedOrder) {
    return null;
  }

  const handleComplete = () => {
    if (paymentMethod === "cash" && payment.received < payment.finalTotal) {
      toast.warning("Số tiền khách đưa chưa đủ.");

      return;
    }

    onComplete({
      paymentMethod,
      discountPercent,
      cashReceived:
        paymentMethod === "cash" ? payment.received : payment.finalTotal,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalBox} ${styles.billingModal}`}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Thanh Toán Đơn {selectedOrder.id}</h2>

            <p>
              {selectedOrder.tableName} • Phục vụ: {selectedOrder.waiterName}
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

        <div className={styles.modalBody}>
          <div className={styles.billingOrderItems}>
            <span className={styles.formLabel}>MÓN ĐÃ GỌI</span>

            {selectedOrder.items.map((item) => (
              <div key={item.id}>
                <span>
                  {item.quantity}x {item.name}
                </span>

                <strong>
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </strong>
              </div>
            ))}
          </div>

          <div>
            <label className={styles.formLabel}>ÁP DỤNG GIẢM GIÁ</label>

            <div className={styles.discountSelector}>
              {[0, 5, 10, 15].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={
                    discountPercent === value ? styles.discountActive : ""
                  }
                  onClick={() => setDiscountPercent(value)}
                >
                  {value === 0 ? "Không giảm" : `${value}% Off`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={styles.formLabel}>PHƯƠNG THỨC THANH TOÁN</label>

            <div className={styles.paymentMethods}>
              <button
                type="button"
                className={paymentMethod === "cash" ? styles.paymentActive : ""}
                onClick={() => setPaymentMethod("cash")}
              >
                <Banknote size={21} />
                Tiền Mặt
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "bank_transfer" ? styles.paymentActive : ""
                }
                onClick={() => setPaymentMethod("bank_transfer")}
              >
                <QrCode size={21} />
                VietQR
              </button>

              <button
                type="button"
                className={paymentMethod === "card" ? styles.paymentActive : ""}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard size={21} />
                Thẻ POS
              </button>
            </div>
          </div>

          {paymentMethod === "cash" && (
            <div className={styles.cashPaymentBox}>
              <label className={styles.formLabel}>TIỀN KHÁCH ĐƯA</label>

              <input
                className={styles.formControl}
                type="number"
                min="0"
                value={cashReceived}
                placeholder={String(payment.finalTotal)}
                onChange={(event) => setCashReceived(event.target.value)}
              />

              <div className={styles.quickCash}>
                {[payment.finalTotal, 200000, 500000].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setCashReceived(String(value))}
                  >
                    {value.toLocaleString("vi-VN")}đ
                  </button>
                ))}
              </div>

              <div className={styles.changeMoney}>
                <span>Tiền thừa trả lại:</span>

                <strong>{payment.change.toLocaleString("vi-VN")}đ</strong>
              </div>
            </div>
          )}

          {paymentMethod === "bank_transfer" && (
            <div className={styles.qrBox}>
              <div className={styles.fakeQr}>
                <QrCode size={72} />
              </div>

              <div>
                <strong>Quét mã VietQR để thanh toán</strong>

                <span>Ngân hàng: MB Bank</span>

                <span>STK: 9999 8888 6666</span>

                <span>NHÀ HÀNG HỦ TIẾU RESTO</span>

                <b>{payment.finalTotal.toLocaleString("vi-VN")}đ</b>
              </div>
            </div>
          )}

          <div className={styles.billingCalculation}>
            <div>
              <span>Tạm tính món:</span>

              <span>{selectedOrder.subtotal.toLocaleString("vi-VN")}đ</span>
            </div>

            <div>
              <span>Thuế VAT 8%:</span>

              <span>{selectedOrder.vatAmount.toLocaleString("vi-VN")}đ</span>
            </div>

            {payment.discountAmount > 0 && (
              <div className={styles.discountLine}>
                <span>Giảm giá ({discountPercent}%):</span>

                <span>-{payment.discountAmount.toLocaleString("vi-VN")}đ</span>
              </div>
            )}

            <div className={styles.billingTotal}>
              <strong>TỔNG KHÁCH PHẢI TRẢ:</strong>

              <strong>{payment.finalTotal.toLocaleString("vi-VN")}đ</strong>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            className={styles.modalPrimaryButton}
            onClick={handleComplete}
          >
            <CheckCircle2 size={18} />
            XÁC NHẬN THANH TOÁN & IN HÓA ĐƠN
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingModal;
