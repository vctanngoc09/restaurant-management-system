import {
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  MapPin,
  Phone,
  Printer,
  QrCode,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import styles from "./TakeawayDeliveryCheckout.module.css";

import ReceiptPrintModal from "../ReceiptPrintModal/ReceiptPrintModal";

// ==================================================
// HELPERS
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

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function getOrderTypeLabel(orderType) {
  return orderType === "delivery" ? "Giao hàng" : "Mang về";
}

function isPromotionAvailable(promotion, subtotal) {
  if (!promotion?.active) {
    return false;
  }

  const now = new Date();

  const startAt = new Date(promotion.startAt);

  const endAt = new Date(promotion.endAt);

  if (now < startAt) {
    return false;
  }

  if (now > endAt) {
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

function TakeawayDeliveryCheckout({
  orderType,

  items,
  orderNote,

  shippingDetail,

  restaurantSetting = null,
  promotions = [],

  onCreateOrder,
  onPayCash,

  onBackToMenu,
  onClose,
}) {
  // ==================================================
  // STEP
  //
  // summary
  // payment
  // success
  // ==================================================

  const [step, setStep] = useState("summary");

  // ==================================================
  // MONEY
  //
  // UI PREVIEW ONLY.
  //
  // Khi nối Payment API:
  // subtotal / VAT / discount / total
  // sẽ lấy response backend.
  // ==================================================

  // ==================================================
  // PAYMENT STATE
  // ==================================================

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [promotionCode, setPromotionCode] = useState("");

  const [appliedPromotion, setAppliedPromotion] = useState(null);

  const [showPromotionSuggestions, setShowPromotionSuggestions] =
    useState(false);

  const [cashReceived, setCashReceived] = useState("");

  const [createdOrder, setCreatedOrder] = useState(null);

  const [paymentReceipt, setPaymentReceipt] = useState(null);

  const [showReceipt, setShowReceipt] = useState(false);

  const [creatingOrder, setCreatingOrder] = useState(false);

  const [paying, setPaying] = useState(false);

  // ==================================================
  // SUBTOTAL
  // ==================================================

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.menuItem.price || 0) * Number(item.quantity || 0),

        0,
      ),

    [items],
  );

  // ==================================================
  // VAT FROM RESTAURANT SETTING API
  // ==================================================

  const vatRate = Number(restaurantSetting?.vatRate) || 0;

  // ==================================================
  // PROMOTION
  // ==================================================

  const discountAmount = calculatePromotionDiscount(appliedPromotion, subtotal);

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // ==================================================
  // VAT
  // ==================================================

  const vatAmount = Math.round(taxableAmount * (vatRate / 100));

  // ==================================================
  // TOTAL
  // ==================================================

  const totalAmount = taxableAmount + vatAmount;

  // ==================================================
  // CASH
  // ==================================================

  const received = Number(cashReceived) || 0;

  const changeAmount = Math.max(0, received - totalAmount);

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
  // CONTINUE PAYMENT
  // ==================================================

  // ==================================================
  // CONTINUE PAYMENT
  //
  // TAKE AWAY / DELIVERY
  //
  // 1. CREATE ORDER
  // 2. Backend -> AWAITING_PAYMENT
  // 3. Open payment screen
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

  const handleContinuePayment = async () => {
    /*
     * Nếu order đã tạo rồi
     * thì không POST lần 2.
     *
     * Tránh duplicate order
     * khi user back rồi continue lại.
     */

    if (createdOrder) {
      setStep("payment");

      return;
    }

    if (creatingOrder) {
      return;
    }

    try {
      setCreatingOrder(true);

      const order = await onCreateOrder({
        orderType,

        cartItems: items,

        orderNote,

        shippingDetail,
      });

      if (!order) {
        return;
      }

      /*
       * FE normalize:
       *
       * AWAITING_PAYMENT
       * ->
       * pending_payment
       */

      if (order.status !== "pending_payment") {
        toast.error("Đơn hàng chưa ở trạng thái chờ thanh toán.");

        return;
      }

      setCreatedOrder(order);

      setStep("payment");
    } finally {
      setCreatingOrder(false);
    }
  };

  // ==================================================
  // PAY CASH
  //
  // AWAITING_PAYMENT
  // ->
  // CASH SUCCESS
  // ->
  // PENDING
  // ->
  // KITCHEN
  // ==================================================

  const handlePay = async () => {
    if (paymentMethod === "vietqr") {
      toast.info("VietQR sẽ được tích hợp PayOS ở bước tiếp theo.");

      return;
    }

    if (!createdOrder) {
      toast.error("Đơn hàng chưa được tạo.");

      return;
    }

    if (!createdOrder.backendId) {
      toast.error("Không tìm thấy ID thật của đơn hàng.");

      return;
    }

    if (!received) {
      toast.warning("Vui lòng nhập số tiền khách đưa.");

      return;
    }

    /*
     * KHÔNG check:
     *
     * received < totalAmount
     *
     * ở FE nữa.
     *
     * Vì:
     *
     * - VAT thật do backend lấy RestaurantSetting
     * - Promotion thật do backend validate
     * - amount thật do backend tính
     *
     * Backend mới là nguồn chính xác.
     */

    if (paying) {
      return;
    }

    try {
      setPaying(true);

      const receipt = await onPayCash({
        orderId: createdOrder.backendId,

        promotionCode: appliedPromotion?.code || null,

        cashReceived: received,
      });

      if (!receipt) {
        return;
      }

      /*
       * API CASH phải trả SUCCESS.
       */

      if (receipt.paymentStatus !== "SUCCESS") {
        toast.error("Thanh toán chưa thành công.");

        return;
      }

      /*
       * Lưu nguyên PaymentReceiptResponse.
       *
       * Đây mới là dữ liệu thật:
       *
       * subtotal
       * discount
       * VAT
       * total
       * cash received
       * change
       * items
       * restaurant
       * cashier
       */

      setPaymentReceipt(receipt);

      setStep("success");
    } finally {
      setPaying(false);
    }
  };

  // ==================================================
  // SUMMARY STEP
  // ==================================================

  if (step === "summary") {
    return (
      <div className={styles.overlay}>
        <section className={styles.modal}>
          {/* =========================
              HEADER
          ========================= */}

          <header className={styles.header}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => {
                if (createdOrder) {
                  toast.info("Đơn đã được tạo và đang chờ thanh toán.");

                  return;
                }

                onBackToMenu();
              }}
            >
              <ArrowLeft size={18} />
            </button>

            <div className={styles.headerTitle}>
              <strong>Xác Nhận Đơn</strong>

              <div className={styles.steps}>
                <span className={styles.stepActive}>1</span>

                <b />

                <span>2</span>

                <small>Thanh toán</small>
              </div>
            </div>

            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </header>

          {/* =========================
              BODY
          ========================= */}

          <div className={styles.summaryBody}>
            {/* =========================
                ORDER
            ========================= */}

            <section className={styles.summaryPanel}>
              <div className={styles.sectionTitle}>
                {orderType === "delivery" ? (
                  <Truck size={17} />
                ) : (
                  <ShoppingBag size={17} />
                )}

                <div>
                  <strong>Thông Tin Đơn</strong>

                  <span>{getOrderTypeLabel(orderType)}</span>
                </div>
              </div>

              {/* =========================
                  ITEMS
              ========================= */}

              <div className={styles.summaryItems}>
                {items.map((item, index) => (
                  <article
                    key={item.menuItem.id}
                    className={styles.summaryItem}
                  >
                    <div className={styles.itemImage}>
                      {item.menuItem.urlImg ? (
                        <img
                          src={item.menuItem.urlImg}
                          alt={item.menuItem.name}
                        />
                      ) : (
                        <ShoppingBag size={20} />
                      )}
                    </div>

                    <div className={styles.itemInfo}>
                      <strong>{item.menuItem.name}</strong>

                      {item.note && <span>Ghi chú: {item.note}</span>}

                      <small>{formatMoney(item.menuItem.price)}</small>
                    </div>

                    <span className={styles.quantityBadge}>
                      x{item.quantity}
                    </span>

                    <strong className={styles.itemTotal}>
                      {formatMoney(item.menuItem.price * item.quantity)}
                    </strong>
                  </article>
                ))}
              </div>

              {/* =========================
                  NOTE
              ========================= */}

              {orderNote && (
                <div className={styles.orderNote}>
                  <span>Ghi chú đơn:</span>

                  <strong>{orderNote}</strong>
                </div>
              )}
            </section>

            {/* =========================
                CUSTOMER
            ========================= */}

            <aside className={styles.customerPanel}>
              <div className={styles.sectionTitle}>
                <User size={17} />

                <div>
                  <strong>Thông Tin Khách</strong>

                  <span>
                    {orderType === "delivery"
                      ? "Thông tin giao hàng"
                      : "Khách mang về"}
                  </span>
                </div>
              </div>

              {orderType === "delivery" ? (
                <div className={styles.customerInfo}>
                  <div>
                    <User size={15} />

                    <span>Tên khách</span>

                    <strong>{shippingDetail?.customerName || "—"}</strong>
                  </div>

                  <div>
                    <Phone size={15} />

                    <span>Điện thoại</span>

                    <strong>{shippingDetail?.customerPhone || "—"}</strong>
                  </div>

                  <div>
                    <MapPin size={15} />

                    <span>Địa chỉ</span>

                    <strong>{shippingDetail?.address || "—"}</strong>
                  </div>

                  {shippingDetail?.distance != null && (
                    <div className={styles.shippingMeta}>
                      <span>Khoảng cách</span>

                      <strong>{shippingDetail.distance} km</strong>
                    </div>
                  )}

                  {shippingDetail?.estimatedTime != null && (
                    <div className={styles.shippingMeta}>
                      <span>Dự kiến</span>

                      <strong>{shippingDetail.estimatedTime} phút</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.takeawayInfo}>
                  <ShoppingBag size={30} />

                  <strong>Đơn mang về</strong>

                  <span>
                    Khách nhận món trực tiếp tại quầy sau khi chế biến xong.
                  </span>
                </div>
              )}

              {/* =========================
                  PAYMENT SUMMARY
              ========================= */}

              <div className={styles.moneySummary}>
                <div>
                  <span>Tạm tính</span>

                  <strong>{formatMoney(subtotal)}</strong>
                </div>

                <div>
                  <span>VAT ({vatRate}%)</span>

                  <strong>{formatMoney(vatAmount)}</strong>
                </div>

                <div className={styles.totalRow}>
                  <span>Tổng thanh toán</span>

                  <strong>{formatMoney(totalAmount)}</strong>
                </div>
              </div>

              <button
                type="button"
                className={styles.primaryButton}
                disabled={creatingOrder}
                onClick={handleContinuePayment}
              >
                {creatingOrder ? "Đang tạo đơn..." : "Tiếp Tục Thanh Toán"}
              </button>
            </aside>
          </div>
        </section>
      </div>
    );
  }

  // ==================================================
  // PAYMENT STEP
  // ==================================================

  if (step === "payment") {
    return (
      <div className={styles.overlay}>
        <section className={styles.modal}>
          {/* =========================
              HEADER
          ========================= */}

          <header className={styles.header}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setStep("summary")}
            >
              <ArrowLeft size={18} />
            </button>

            <div className={styles.headerTitle}>
              <strong>Thanh Toán</strong>

              <div className={styles.steps}>
                <span className={styles.stepDone}>
                  <Check size={12} />
                </span>

                <b className={styles.stepLineDone} />

                <span className={styles.stepActive}>2</span>

                <small>Thanh toán</small>
              </div>
            </div>

            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </header>

          {/* =========================
              PAYMENT BODY
          ========================= */}

          <div className={styles.paymentBody}>
            {/* =========================
                LEFT
            ========================= */}

            <section className={styles.paymentOrderPanel}>
              <div className={styles.paymentOrderHeader}>
                <div>
                  <span>Loại đơn</span>

                  <strong>{getOrderTypeLabel(orderType)}</strong>
                </div>

                {orderType === "delivery" && (
                  <div className={styles.paymentCustomer}>
                    <span>Khách hàng</span>

                    <strong>{shippingDetail?.customerName || "—"}</strong>
                  </div>
                )}
              </div>

              {/* =========================
                  PROMOTION
              ========================= */}

              <div className={styles.promotionBox}>
                <label>Mã giảm giá</label>

                <div>
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

                  <button type="button" onClick={handleApplyPromotion}>
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* =========================
                  DETAILS
              ========================= */}

              <div className={styles.orderDetailsTitle}>Chi Tiết Đơn Hàng</div>

              <div className={styles.paymentItems}>
                {items.map((item) => (
                  <div key={item.menuItem.id}>
                    <div>
                      <strong>{item.menuItem.name}</strong>

                      <span>
                        {formatMoney(item.menuItem.price)} × {item.quantity}
                      </span>
                    </div>

                    <strong>
                      {formatMoney(item.menuItem.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className={styles.paymentTotals}>
                <div>
                  <span>Tạm tính</span>

                  <span>{formatMoney(subtotal)}</span>
                </div>

                {appliedPromotion && discountAmount > 0 && (
                  <div>
                    <span>Giảm giá ({appliedPromotion.code})</span>

                    <span>-{formatMoney(discountAmount)}</span>
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

            {/* =========================
                RIGHT PAYMENT
            ========================= */}

            <aside className={styles.paymentPanel}>
              {/* =========================
                  METHODS
              ========================= */}

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

              {/* =========================
                  CASH
              ========================= */}

              {paymentMethod === "cash" ? (
                <>
                  <div className={styles.cashHeader}>
                    <span>Nhập Tiền Khách Đưa</span>

                    <small>Nhập số tiền mặt nhận từ khách</small>

                    <strong>
                      {cashReceived ? formatMoney(received) : "0đ"}
                    </strong>
                  </div>

                  <div className={styles.quickCash}>
                    {quickCashValues.map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setCashReceived(String(value))}
                      >
                        {formatMoney(value)}
                      </button>
                    ))}
                  </div>

                  {/* =========================
                      KEYPAD
                  ========================= */}

                  <div className={styles.keypad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                      <button
                        type="button"
                        key={number}
                        onClick={() => appendNumber(number)}
                      >
                        {number}
                      </button>
                    ))}

                    <button type="button" onClick={() => setCashReceived("")}>
                      C
                    </button>

                    <button type="button" onClick={() => appendNumber(0)}>
                      0
                    </button>

                    <button type="button" onClick={removeNumber}>
                      ⌫
                    </button>
                  </div>

                  <div className={styles.changeBox}>
                    <span>Tiền thừa</span>

                    <strong>{formatMoney(changeAmount)}</strong>
                  </div>

                  <button
                    type="button"
                    className={styles.payButton}
                    disabled={paying}
                    onClick={handlePay}
                  >
                    {paying ? "Đang thanh toán..." : "Thanh Toán"}
                  </button>
                </>
              ) : (
                /* =========================
                   QR PLACEHOLDER
                ========================= */

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

  // ==================================================
  // SUCCESS STEP
  // ==================================================

  return (
    <>
      <div className={styles.overlay}>
        <section className={styles.modal}>
          <header className={styles.header}>
            <div className={styles.headerSpacer} />

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
                <CheckCircle2 size={34} />
              </div>

              <h2>Thanh Toán Thành Công!</h2>

              <p>Đơn hàng đã được xác nhận thanh toán.</p>

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

export default TakeawayDeliveryCheckout;
