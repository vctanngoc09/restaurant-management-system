import {
  Bike,
  Building2,
  Clock3,
  MapPin,
  Minus,
  Navigation,
  Phone,
  Plus,
  Route,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import styles from "./NewOrderModal.module.css";

function NewOrderModal({ open, tables, onClose, onStart }) {
  const [orderType, setOrderType] = useState("dine_in");

  const [tableId, setTableId] = useState("");

  const [guestCount, setGuestCount] = useState(2);

  /*
   * =====================================
   * SHIPPING DETAIL
   * =====================================
   */
  const [customerName, setCustomerName] = useState("");

  const [customerPhone, setCustomerPhone] = useState("");

  const [address, setAddress] = useState("");

  const [distance, setDistance] = useState(null);

  const [estimatedTime, setEstimatedTime] = useState(null);

  const [isEstimating, setIsEstimating] = useState(false);

  const availableTables = useMemo(
    () => tables.filter((table) => table.status === "empty"),
    [tables],
  );

  /*
   * =====================================
   * RESET MODAL
   * =====================================
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    setOrderType("dine_in");

    setGuestCount(2);

    setTableId(availableTables[0]?.id || "");

    setCustomerName("");

    setCustomerPhone("");

    setAddress("");

    setDistance(null);

    setEstimatedTime(null);

    setIsEstimating(false);
  }, [open, availableTables]);

  if (!open) {
    return null;
  }

  /*
   * =====================================
   * CHANGE ADDRESS
   *
   * Khi địa chỉ thay đổi thì kết quả
   * khoảng cách cũ không còn hợp lệ nữa.
   * =====================================
   */
  const handleAddressChange = (event) => {
    setAddress(event.target.value);

    setDistance(null);

    setEstimatedTime(null);
  };

  /*
   * =====================================
   * MOCK SHIPPING ESTIMATE
   *
   * Sau này thay block này bằng:
   *
   * shippingService.estimate(address)
   *
   * response:
   * {
   *   distance: 3.8,
   *   estimatedTime: 12
   * }
   * =====================================
   */
  const handleEstimateShipping = () => {
    if (!address.trim()) {
      toast.warning("Vui lòng nhập địa chỉ giao hàng trước.");

      return;
    }

    setIsEstimating(true);

    /*
     * MOCK API
     */
    setTimeout(() => {
      setDistance(3.8);

      setEstimatedTime(12);

      setIsEstimating(false);

      toast.success("Đã tính khoảng cách giao hàng.");
    }, 600);
  };

  /*
   * =====================================
   * VALIDATE DELIVERY
   * =====================================
   */
  const validateDelivery = () => {
    if (!customerName.trim()) {
      toast.warning("Vui lòng nhập tên khách hàng.");

      return false;
    }

    if (!customerPhone.trim()) {
      toast.warning("Vui lòng nhập số điện thoại khách hàng.");

      return false;
    }

    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    const normalizedPhone = customerPhone.replace(/\s/g, "");

    if (!phoneRegex.test(normalizedPhone)) {
      toast.warning("Số điện thoại không hợp lệ.");

      return false;
    }

    if (!address.trim()) {
      toast.warning("Vui lòng nhập địa chỉ giao hàng.");

      return false;
    }

    if (distance === null || estimatedTime === null) {
      toast.warning("Vui lòng tính khoảng cách giao hàng trước.");

      return false;
    }

    return true;
  };

  /*
   * =====================================
   * START ORDER
   * =====================================
   */
  const handleStart = () => {
    /*
     * DINE IN
     */
    if (orderType === "dine_in" && !tableId) {
      toast.warning("Hiện không còn bàn trống.");

      return;
    }

    /*
     * DELIVERY
     */
    if (orderType === "delivery" && !validateDelivery()) {
      return;
    }

    const shippingDetail =
      orderType === "delivery"
        ? {
            customerName: customerName.trim(),

            customerPhone: customerPhone.replace(/\s/g, "").trim(),

            address: address.trim(),

            distance,

            estimatedTime,
          }
        : null;

    onStart({
      orderType,

      tableId: orderType === "dine_in" ? tableId : null,

      guestCount,

      shippingDetail,
    });
  };

  return (
    <div className={styles.modalOverlay} onMouseDown={onClose}>
      <div
        className={`${styles.modalBox} ${styles.newOrderModal}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ===============================
            HEADER
        =============================== */}
        <div className={styles.modalHeader}>
          <div>
            <h2>Tạo Đơn Hàng Mới</h2>

            <p>Chọn loại đơn để bắt đầu phục vụ khách hàng</p>
          </div>

          <button
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* ===============================
            BODY
        =============================== */}
        <div className={styles.modalBody}>
          {/* =============================
              ORDER TYPE
          ============================= */}
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
                <Building2 size={20} />

                <span>Tại Chỗ</span>
              </button>

              <button
                type="button"
                className={
                  orderType === "take_away" ? styles.orderTypeSelected : ""
                }
                onClick={() => setOrderType("take_away")}
              >
                <ShoppingBag size={20} />

                <span>Mang Về</span>
              </button>

              <button
                type="button"
                className={
                  orderType === "delivery" ? styles.orderTypeSelected : ""
                }
                onClick={() => setOrderType("delivery")}
              >
                <Bike size={20} />

                <span>Giao Hàng</span>
              </button>
            </div>
          </div>

          {/* =============================
              DINE IN
          ============================= */}
          {orderType === "dine_in" && (
            <div className={styles.dineInSection}>
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
            </div>
          )}

          {/* =============================
              DELIVERY SHIPPING DETAIL
          ============================= */}
          {orderType === "delivery" && (
            <div className={styles.shippingSection}>
              <div className={styles.shippingHeader}>
                <div className={styles.shippingIcon}>
                  <Bike size={19} />
                </div>

                <div>
                  <h3>Thông Tin Giao Hàng</h3>

                  <p>Điền thông tin người nhận và địa chỉ giao món</p>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className={styles.shippingGrid}>
                <div className={styles.inputGroup}>
                  <label>
                    TÊN KHÁCH HÀNG
                    <span>*</span>
                  </label>

                  <div className={styles.inputWithIcon}>
                    <User size={16} />

                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn B"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>
                    SỐ ĐIỆN THOẠI
                    <span>*</span>
                  </label>

                  <div className={styles.inputWithIcon}>
                    <Phone size={16} />

                    <input
                      type="tel"
                      placeholder="0909 123 456"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className={styles.inputGroup}>
                <label>
                  ĐỊA CHỈ GIAO HÀNG
                  <span>*</span>
                </label>

                <div className={styles.addressRow}>
                  <div className={styles.addressInput}>
                    <MapPin size={17} />

                    <input
                      type="text"
                      placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                      value={address}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <button
                    type="button"
                    className={styles.estimateButton}
                    disabled={isEstimating}
                    onClick={handleEstimateShipping}
                  >
                    <Navigation size={15} />

                    {isEstimating ? "Đang tính..." : "Tính khoảng cách"}
                  </button>
                </div>

                <p className={styles.addressHint}>
                  Sau này ô này có thể tích hợp gợi ý địa chỉ từ Google Maps /
                  Mapbox.
                </p>
              </div>

              {/* =========================
                  SHIPPING ESTIMATE
              ========================= */}
              <div className={styles.shippingEstimate}>
                <div className={styles.estimateItem}>
                  <div className={styles.estimateIcon}>
                    <Route size={18} />
                  </div>

                  <div>
                    <span>KHOẢNG CÁCH</span>

                    <strong>
                      {distance !== null ? `${distance} km` : "-- km"}
                    </strong>
                  </div>
                </div>

                <div className={styles.estimateDivider} />

                <div className={styles.estimateItem}>
                  <div className={styles.estimateIcon}>
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <span>THỜI GIAN DỰ KIẾN</span>

                    <strong>
                      {estimatedTime !== null
                        ? `~ ${estimatedTime} phút`
                        : "-- phút"}
                    </strong>
                  </div>
                </div>
              </div>

              {distance !== null && estimatedTime !== null && (
                <div className={styles.estimateSuccess}>
                  <MapPin size={15} />

                  <span>
                    Đã xác định tuyến giao hàng khoảng{" "}
                    <strong>{distance} km</strong>, thời gian di chuyển dự kiến{" "}
                    <strong>{estimatedTime} phút</strong>.
                  </span>
                </div>
              )}

              <div className={styles.mockNotice}>
                UI hiện đang sử dụng dữ liệu khoảng cách giả lập. Khi nối API,
                khoảng cách và thời gian sẽ được hệ thống tự tính từ địa chỉ nhà
                hàng đến địa chỉ khách.
              </div>
            </div>
          )}

          {/* =============================
              START
          ============================= */}
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
