import {
  Banknote,
  CheckCircle2,
  Printer,
  QrCode,
  ReceiptText,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import ReceiptPrintModal from "../ReceiptPrintModal/ReceiptPrintModal";

import styles from "./BillingModal.module.css";

// ==================================================
// FORMAT MONEY
// ==================================================

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

// ==================================================
// PROMOTION DISCOUNT
// FE chỉ preview.
// Backend vẫn là nguồn tính tiền cuối cùng.
// ==================================================

function calculatePromotionDiscount(promotion, subtotal) {
  if (!promotion) {
    return 0;
  }

  let discount = 0;

  if (promotion.discountType === "PERCENT") {
    discount = subtotal * (Number(promotion.discountValue) / 100);
  } else if (promotion.discountType === "FIXED_AMOUNT") {
    discount = Number(promotion.discountValue) || 0;
  }

  if (promotion.maxDiscountAmount != null) {
    discount = Math.min(discount, Number(promotion.maxDiscountAmount));
  }

  return Math.min(discount, subtotal);
}

// ==================================================
// PROMOTION AVAILABLE
// ==================================================

function isPromotionAvailable(promotion, subtotal) {
  if (!promotion?.active) {
    return false;
  }

  const now = new Date();

  const startAt = new Date(promotion.startAt);

  const endAt = new Date(promotion.endAt);

  if (now < startAt || now > endAt) {
    return false;
  }

  if (
    promotion.usageLimit != null &&
    Number(promotion.usedCount) >= Number(promotion.usageLimit)
  ) {
    return false;
  }

  if (subtotal < Number(promotion.minOrderAmount || 0)) {
    return false;
  }

  return true;
}

// ==================================================
// COMPONENT
// ==================================================

function BillingModal({
  open,

  selectedOrder,

  preparing = false,

  restaurantSetting = null,

  promotions = [],

  onClose,

  onPayCash,
}) {
  // ==================================================
  // PAYMENT STATE
  // ==================================================

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [promotionCode, setPromotionCode] = useState("");

  const [appliedPromotion, setAppliedPromotion] = useState(null);

  const [showPromotionSuggestions, setShowPromotionSuggestions] =
    useState(false);

  const [cashReceived, setCashReceived] = useState("");

  const [paying, setPaying] = useState(false);

  const [paymentReceipt, setPaymentReceipt] = useState(null);

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [showReceipt, setShowReceipt] = useState(false);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setPaymentMethod("cash");

    setPromotionCode("");

    setAppliedPromotion(null);

    setShowPromotionSuggestions(false);

    setCashReceived("");

    setPaying(false);

    setPaymentReceipt(null);

    setPaymentSuccess(false);

    setShowReceipt(false);
  }, [open, selectedOrder?.backendId]);

  // ==================================================
  // GROUP ORDER ITEMS
  //
  // Ví dụ:
  //
  // Hủ tiếu x2
  // Hủ tiếu x1 gọi thêm
  //
  // =>
  // Hủ tiếu x3
  // ==================================================

  const groupedItems = useMemo(() => {
    const map = new Map();

    (selectedOrder?.items || []).forEach((item) => {
      const key =
        item.productId != null
          ? `${item.productId}-${item.price}`
          : `${item.name}-${item.price}`;

      const existing = map.get(key);

      if (existing) {
        existing.quantity += Number(item.quantity || 0);

        existing.lineTotal = existing.quantity * existing.price;

        return;
      }

      map.set(key, {
        ...item,

        quantity: Number(item.quantity || 0),

        price: Number(item.price || 0),

        lineTotal: Number(item.price || 0) * Number(item.quantity || 0),
      });
    });

    return [...map.values()];
  }, [selectedOrder?.items]);

  // ==================================================
  // SUBTOTAL
  // ==================================================

  const subtotal =
    Number(
      selectedOrder?.subtotal ??
        groupedItems.reduce(
          (total, item) => total + Number(item.lineTotal || 0),

          0,
        ),
    ) || 0;

  // ==================================================
  // VAT
  //
  // Lấy từ API RestaurantSetting,
  // không hard-code 8%.
  // ==================================================

  const vatRate = Number(restaurantSetting?.vatRate) || 0;

  // ==================================================
  // DISCOUNT
  // ==================================================

  const discountAmount = calculatePromotionDiscount(appliedPromotion, subtotal);

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // ==================================================
  // VAT PREVIEW
  // ==================================================

  const vatAmount = Math.round(taxableAmount * (vatRate / 100));

  // ==================================================
  // TOTAL PREVIEW
  // ==================================================

  const totalAmount = taxableAmount + vatAmount;

  // ==================================================
  // CASH
  // ==================================================

  const received = Number(cashReceived) || 0;

  const changeAmount = Math.max(0, received - totalAmount);

  // ==================================================
  // PROMOTION SUGGESTIONS
  // ==================================================

  const promotionSuggestions = useMemo(() => {
    const keyword = promotionCode.trim().toLowerCase();

    if (!keyword) {
      return [];
    }

    return promotions
      .filter((promotion) => isPromotionAvailable(promotion, subtotal))
      .filter((promotion) => {
        const code = promotion.code?.toLowerCase() || "";

        const name = promotion.name?.toLowerCase() || "";

        return code.includes(keyword) || name.includes(keyword);
      })
      .slice(0, 5);
  }, [promotionCode, promotions, subtotal]);

  // ==================================================
  // QUICK CASH
  // ==================================================

  const quickCashValues = useMemo(() => {
    const candidates = [totalAmount, 50000, 100000, 200000, 500000];

    return [
      ...new Set(
        candidates.filter((value) => value >= totalAmount && value > 0),
      ),
    ].slice(0, 4);
  }, [totalAmount]);

  // ==================================================
  // KEYPAD
  // ==================================================

  const appendNumber = (number) => {
    setCashReceived((prev) => {
      const next = `${prev}${number}`.replace(/^0+(?=\d)/, "");

      return next;
    });
  };

  const removeNumber = () => {
    setCashReceived((prev) => prev.slice(0, -1));
  };

  // ==================================================
  // APPLY PROMOTION
  // ==================================================

  const handleApplyPromotion = () => {
    const code = promotionCode.trim().toUpperCase();

    if (!code) {
      toast.warning("Vui lòng nhập mã giảm giá.");

      return;
    }

    const promotion = promotions.find(
      (item) => item.code?.toUpperCase() === code,
    );

    if (!promotion) {
      toast.error("Mã giảm giá không tồn tại.");

      return;
    }

    if (!isPromotionAvailable(promotion, subtotal)) {
      toast.error("Mã giảm giá hiện không thể sử dụng cho đơn này.");

      return;
    }

    setAppliedPromotion(promotion);

    setPromotionCode(promotion.code);

    setShowPromotionSuggestions(false);

    toast.success(`Đã áp dụng mã ${promotion.code}.`);
  };

  // ==================================================
  // PAY CASH
  //
  // POST
  // /api/cashier/orders/{orderId}/payments/cash
  // ==================================================

  const handlePay = async () => {
    if (preparing) {
      toast.info("Đang chuyển đơn sang trạng thái chờ thanh toán.");

      return;
    }

    // ==================================================
    // VIETQR
    // ==================================================

    if (paymentMethod === "vietqr") {
      toast.info("VietQR sẽ được tích hợp PayOS ở bước tiếp theo.");

      return;
    }

    // ==================================================
    // ORDER
    // ==================================================

    if (!selectedOrder?.backendId) {
      toast.error("Không tìm thấy ID đơn hàng.");

      return;
    }

    // ==================================================
    // ORDER MUST BE AWAITING PAYMENT
    // ==================================================

    if (selectedOrder.status !== "pending_payment") {
      toast.warning("Đơn hàng chưa sẵn sàng để thanh toán.");

      return;
    }

    // ==================================================
    // CASH
    // ==================================================

    if (!received) {
      toast.warning("Vui lòng nhập số tiền khách đưa.");

      return;
    }

    if (paying) {
      return;
    }

    try {
      setPaying(true);

      const receipt = await onPayCash({
        orderId: selectedOrder.backendId,

        promotionCode: appliedPromotion?.code || null,

        cashReceived: received,

        /*
         * DINE_IN cần giữ BillingModal
         * để hiện màn SUCCESS.
         */
        keepBillingOpen: true,
      });

      if (!receipt) {
        return;
      }

      if (receipt.paymentStatus !== "SUCCESS") {
        toast.error("Thanh toán chưa thành công.");

        return;
      }

      // Backend PaymentReceiptResponse
      // mới là số tiền chính xác cuối cùng.

      setPaymentReceipt(receipt);

      setPaymentSuccess(true);
    } finally {
      setPaying(false);
    }
  };

  // ==================================================
  // CLOSED
  // ==================================================

  if (!open || !selectedOrder) {
    return null;
  }

  // ==================================================
  // SUCCESS SCREEN
  // ==================================================

  if (paymentSuccess) {
    return (
      <>
        <div className={styles.overlay}>
          <section className={styles.modal}>
            <header className={styles.header}>
              <div className={styles.headerTitle}>
                <strong>Thanh Toán</strong>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </header>

            <div className={styles.successBody}>
              <div className={styles.successCard}>
                <div className={styles.successIcon}>
                  <CheckCircle2 size={36} />
                </div>

                <h2>Thanh Toán Thành Công!</h2>

                <p>Đơn tại bàn đã được thanh toán.</p>

                <div className={styles.successDetails}>
                  <div>
                    <span>Mã hóa đơn</span>

                    <strong>{paymentReceipt?.receiptCode || "—"}</strong>
                  </div>

                  <div>
                    <span>Tổng thanh toán</span>

                    <strong>{formatMoney(paymentReceipt?.totalAmount)}</strong>
                  </div>

                  <div>
                    <span>Phương thức</span>

                    <strong>Tiền mặt</strong>
                  </div>

                  <div>
                    <span>Khách đưa</span>

                    <strong>{formatMoney(paymentReceipt?.cashReceived)}</strong>
                  </div>

                  <div className={styles.successChange}>
                    <span>Tiền thừa</span>

                    <strong>{formatMoney(paymentReceipt?.changeAmount)}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.successActions}>
                <button
                  type="button"
                  className={styles.printButton}
                  disabled={!paymentReceipt}
                  onClick={() => setShowReceipt(true)}
                >
                  <Printer size={16} />
                  In Hóa Đơn
                </button>

                <button
                  type="button"
                  className={styles.confirmButton}
                  onClick={onClose}
                >
                  Xác Nhận
                </button>
              </div>
            </div>
          </section>
        </div>

        <ReceiptPrintModal
          open={showReceipt}
          receipt={paymentReceipt}
          restaurantSetting={restaurantSetting}
          onClose={() => setShowReceipt(false)}
        />
      </>
    );
  }

  // ==================================================
  // PAYMENT SCREEN
  // ==================================================

  return (
    <div className={styles.overlay}>
      <section className={styles.modal}>
        {/* ==================================================
            HEADER
        ================================================== */}

        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <strong>Thanh Toán</strong>

            <span>{selectedOrder.id}</span>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        {/* ==================================================
            BODY
        ================================================== */}

        <div className={styles.paymentBody}>
          {/* ==================================================
              LEFT
          ================================================== */}

          <section className={styles.paymentOrderPanel}>
            {/* ==================================================
                ORDER INFO
            ================================================== */}

            <div className={styles.paymentOrderHeader}>
              <div>
                <span>Loại đơn</span>

                <strong>Tại chỗ</strong>
              </div>

              <div>
                <span>Bàn</span>

                <strong>
                  {selectedOrder.tableNumber
                    ? `Bàn ${selectedOrder.tableNumber}`
                    : selectedOrder.tableName}
                </strong>
              </div>

              <div>
                <span>Phục vụ</span>

                <strong>
                  {selectedOrder.staffName || selectedOrder.waiterName || "—"}
                </strong>
              </div>
            </div>

            {/* ==================================================
                PROMOTION
            ================================================== */}

            <div className={styles.promotionBox}>
              <label>Mã giảm giá</label>

              <div className={styles.promotionInputRow}>
                <div className={styles.promotionInputWrap}>
                  <input
                    value={promotionCode}
                    placeholder="Nhập mã giảm giá..."
                    onFocus={() => setShowPromotionSuggestions(true)}
                    onChange={(event) => {
                      setPromotionCode(event.target.value.toUpperCase());

                      setAppliedPromotion(null);

                      setShowPromotionSuggestions(true);
                    }}
                  />

                  {showPromotionSuggestions &&
                    promotionSuggestions.length > 0 && (
                      <div className={styles.promotionSuggestions}>
                        {promotionSuggestions.map((promotion) => (
                          <button
                            type="button"
                            key={promotion.id}
                            onClick={() => {
                              setPromotionCode(promotion.code);

                              setAppliedPromotion(promotion);

                              setShowPromotionSuggestions(false);
                            }}
                          >
                            <div>
                              <strong>{promotion.code}</strong>

                              <span>{promotion.name}</span>
                            </div>

                            <b>
                              {promotion.discountType === "PERCENT"
                                ? `-${Number(promotion.discountValue)}%`
                                : `-${Number(
                                    promotion.discountValue,
                                  ).toLocaleString("vi-VN")}đ`}
                            </b>
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                <button
                  type="button"
                  className={styles.applyPromotionButton}
                  onClick={handleApplyPromotion}
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* ==================================================
                ORDER DETAILS
            ================================================== */}

            <div className={styles.orderDetailsTitle}>Chi Tiết Đơn Hàng</div>

            <div className={styles.paymentItems}>
              {groupedItems.map((item, index) => (
                <div key={item.productId || `${item.name}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>

                    <span>
                      {formatMoney(item.price)} × {item.quantity}
                    </span>
                  </div>

                  <strong>{formatMoney(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            {/* ==================================================
                TOTAL
            ================================================== */}

            <div className={styles.paymentTotals}>
              <div>
                <span>Tạm tính</span>

                <span>{formatMoney(subtotal)}</span>
              </div>

              {appliedPromotion && discountAmount > 0 && (
                <div>
                  <span>Giảm giá ({appliedPromotion.code})</span>

                  <span className={styles.discountValue}>
                    -{formatMoney(discountAmount)}
                  </span>
                </div>
              )}

              <div>
                <span>VAT ({vatRate}%)</span>

                <span>{formatMoney(vatAmount)}</span>
              </div>

              <div className={styles.paymentTotal}>
                <strong>Tổng thanh toán</strong>

                <strong>{formatMoney(totalAmount)}</strong>
              </div>
            </div>
          </section>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <aside className={styles.paymentPanel}>
            {/* ==================================================
                PAYMENT METHODS
            ================================================== */}

            <div className={styles.paymentMethods}>
              <button
                type="button"
                className={
                  paymentMethod === "cash" ? styles.paymentMethodActive : ""
                }
                onClick={() => setPaymentMethod("cash")}
              >
                <Banknote size={16} />
                Tiền mặt
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "vietqr" ? styles.paymentMethodActive : ""
                }
                onClick={() => setPaymentMethod("vietqr")}
              >
                <QrCode size={16} />
                VietQR
              </button>
            </div>

            {/* ==================================================
                PREPARING
            ================================================== */}

            {preparing && (
              <div className={styles.preparingNotice}>
                <ReceiptText size={15} />
                Đang chuyển đơn sang trạng thái chờ thanh toán...
              </div>
            )}

            {/* ==================================================
                CASH
            ================================================== */}

            {paymentMethod === "cash" ? (
              <>
                <div className={styles.cashHeader}>
                  <span>Nhập Tiền Khách Đưa</span>

                  <small>Nhập số tiền mặt nhận từ khách</small>

                  <strong>{cashReceived ? formatMoney(received) : "0đ"}</strong>
                </div>

                <div className={styles.quickCash}>
                  {quickCashValues.map((value) => (
                    <button
                      type="button"
                      key={value}
                      disabled={preparing || paying}
                      onClick={() => setCashReceived(String(value))}
                    >
                      {formatMoney(value)}
                    </button>
                  ))}
                </div>

                {/* ==================================================
                    KEYPAD
                ================================================== */}

                <div className={styles.keypad}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <button
                      type="button"
                      key={number}
                      disabled={preparing || paying}
                      onClick={() => appendNumber(number)}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={preparing || paying}
                    onClick={() => setCashReceived("")}
                  >
                    C
                  </button>

                  <button
                    type="button"
                    disabled={preparing || paying}
                    onClick={() => appendNumber(0)}
                  >
                    0
                  </button>

                  <button
                    type="button"
                    disabled={preparing || paying}
                    onClick={removeNumber}
                  >
                    ⌫
                  </button>
                </div>

                {/* ==================================================
                    CHANGE
                ================================================== */}

                <div className={styles.changeBox}>
                  <span>Tiền thừa</span>

                  <strong>{formatMoney(changeAmount)}</strong>
                </div>

                {/* ==================================================
                    PAY
                ================================================== */}

                <button
                  type="button"
                  className={styles.payButton}
                  disabled={preparing || paying}
                  onClick={handlePay}
                >
                  {preparing
                    ? "Đang chuẩn bị thanh toán..."
                    : paying
                      ? "Đang thanh toán..."
                      : "Thanh Toán"}
                </button>
              </>
            ) : (
              // ==================================================
              // QR PLACEHOLDER
              // ==================================================

              <div className={styles.qrPlaceholder}>
                <div>
                  <QrCode size={58} />
                </div>

                <strong>VietQR / PayOS</strong>

                <span>Phần QR sẽ được nối PayOS ở bước tiếp theo.</span>

                <b>{formatMoney(totalAmount)}</b>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

export default BillingModal;
