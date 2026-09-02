import {
  Bike,
  ChevronRight,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  Route,
  User,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import styles from "./NewOrderModal.module.css";

function NewOrderModal({ open, onClose, onStart }) {
  // ==================================================
  // SHIPPING DETAIL
  // ==================================================

  const [customerName, setCustomerName] = useState("");

  const [customerPhone, setCustomerPhone] = useState("");

  const [address, setAddress] = useState("");

  const [distance, setDistance] = useState(null);

  const [estimatedTime, setEstimatedTime] = useState(null);

  const [isEstimating, setIsEstimating] = useState(false);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setCustomerName("");

    setCustomerPhone("");

    setAddress("");

    setDistance(null);

    setEstimatedTime(null);

    setIsEstimating(false);
  }, [open]);

  if (!open) {
    return null;
  }

  // ==================================================
  // ADDRESS CHANGE
  //
  // Địa chỉ đổi
  // -> khoảng cách cũ không còn hợp lệ.
  // ==================================================

  const handleAddressChange = (event) => {
    setAddress(event.target.value);

    setDistance(null);

    setEstimatedTime(null);
  };

  // ==================================================
  // ESTIMATE SHIPPING
  //
  // Hiện tại vẫn dùng MOCK
  // như code cũ của bạn.
  //
  // Sau này nối Google Maps / Mapbox.
  // ==================================================

  const handleEstimateShipping = () => {
    if (!address.trim()) {
      toast.warning("Vui lòng nhập địa chỉ giao hàng trước.");

      return;
    }

    setIsEstimating(true);

    setTimeout(() => {
      setDistance(3.8);

      setEstimatedTime(12);

      setIsEstimating(false);

      toast.success("Đã tính khoảng cách giao hàng.");
    }, 600);
  };

  // ==================================================
  // VALIDATE
  //
  // Match với regex Backend:
  //
  // (0 | 84 | +84)
  // +
  // (3 | 5 | 7 | 8 | 9)
  // +
  // 8 digits
  // ==================================================

  const validateDelivery = () => {
    if (!customerName.trim()) {
      toast.warning("Vui lòng nhập tên khách hàng.");

      return false;
    }

    if (!customerPhone.trim()) {
      toast.warning("Vui lòng nhập số điện thoại khách hàng.");

      return false;
    }

    const normalizedPhone = customerPhone.replace(/\s/g, "").trim();

    const phoneRegex = /^(0|84|\+84)(3|5|7|8|9)[0-9]{8}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      toast.warning("Số điện thoại không đúng định dạng.");

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

  // ==================================================
  // CONTINUE
  //
  // DELIVERY INFO
  // ->
  // OrderingModal
  //
  // CHƯA tạo Order ở bước này.
  // ==================================================

  const handleContinue = () => {
    if (!validateDelivery()) {
      return;
    }

    const shippingDetail = {
      customerName: customerName.trim(),

      customerPhone: customerPhone.replace(/\s/g, "").trim(),

      address: address.trim(),

      distance,

      estimatedTime,
    };

    onStart({
      orderType: "delivery",

      tableId: null,

      guestCount: 1,

      shippingDetail,
    });
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className={styles.modalOverlay} onMouseDown={onClose}>
      <div
        className={`${styles.modalBox} ${styles.newOrderModal}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className={styles.modalHeader}>
          <div>
            <h2>Thông Tin Giao Hàng</h2>

            <p>Nhập thông tin người nhận trước khi chọn món</p>
          </div>

          <button
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* ==================================================
            BODY
        ================================================== */}

        <div className={styles.modalBody}>
          <div className={styles.shippingSection}>
            {/* ==================================================
                SHIPPING HEADER
            ================================================== */}

            <div className={styles.shippingHeader}>
              <div className={styles.shippingIcon}>
                <Bike size={19} />
              </div>

              <div>
                <h3>Thông Tin Người Nhận</h3>

                <p>Điền thông tin khách hàng và địa chỉ giao món</p>
              </div>
            </div>

            {/* ==================================================
                CUSTOMER
            ================================================== */}

            <div className={styles.shippingGrid}>
              {/* NAME */}

              <div className={styles.inputGroup}>
                <label>
                  TÊN KHÁCH HÀNG
                  <span>*</span>
                </label>

                <div className={styles.inputWithIcon}>
                  <User size={16} />

                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Ví dụ: Nguyễn Văn B"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                  />
                </div>
              </div>

              {/* PHONE */}

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

            {/* ==================================================
                ADDRESS
            ================================================== */}

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
                    maxLength={255}
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
                Sau này có thể tích hợp gợi ý địa chỉ từ Google Maps hoặc
                Mapbox.
              </p>
            </div>

            {/* ==================================================
                ESTIMATE
            ================================================== */}

            <div className={styles.shippingEstimate}>
              {/* DISTANCE */}

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

              {/* TIME */}

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

            {/* ==================================================
                ESTIMATE SUCCESS
            ================================================== */}

            {distance !== null && estimatedTime !== null && (
              <div className={styles.estimateSuccess}>
                <MapPin size={15} />

                <span>
                  Khoảng cách giao hàng <strong>{distance} km</strong>, thời
                  gian dự kiến <strong>{estimatedTime} phút</strong>.
                </span>
              </div>
            )}

            {/* ==================================================
                NOTICE
            ================================================== */}

            <div className={styles.mockNotice}>
              Khoảng cách và thời gian hiện đang dùng dữ liệu giả lập. Sau này
              sẽ nối API bản đồ để tính từ địa chỉ nhà hàng tới địa chỉ khách.
            </div>
          </div>

          {/* ==================================================
              CONTINUE
          ================================================== */}

          <button
            type="button"
            className={styles.modalPrimaryButton}
            onClick={handleContinue}
          >
            Tiếp tục chọn món
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewOrderModal;
