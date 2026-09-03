import {
  AlertTriangle,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LoaderCircle,
  MapPin,
  Phone,
  Route,
  Search,
  User,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import geoapifyService from "../../../services/geoapifyService";

import DeliveryRouteMap from "./DeliveryRouteMap";

import styles from "./NewOrderModal.module.css";

const AUTOCOMPLETE_MIN_LENGTH = 3;
const AUTOCOMPLETE_DELAY_MS = 400;

const configuredMaxDistance = Number(
  import.meta.env.VITE_DELIVERY_MAX_DISTANCE_KM,
);

const MAX_DELIVERY_DISTANCE_KM =
  Number.isFinite(configuredMaxDistance) && configuredMaxDistance > 0
    ? configuredMaxDistance
    : 7;

function NewOrderModal({ open, restaurantSetting = null, onClose, onStart }) {
  // ==================================================
  // CUSTOMER
  // ==================================================

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // ==================================================
  // ADDRESS
  // ==================================================

  const [address, setAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  // Tọa độ chỉ giữ tạm trong state để gọi Routing API.
  // Không gửi xuống backend và không lưu DB.
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);

  const [restaurantLocationLoading, setRestaurantLocationLoading] =
    useState(false);
  const [restaurantLocationError, setRestaurantLocationError] = useState("");

  // ==================================================
  // ROUTE
  // ==================================================

  const [distance, setDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [routeError, setRouteError] = useState("");

  // ==================================================
  // DERIVED
  // ==================================================

  const routeReady = distance !== null && estimatedTime !== null;

  const isWithinDeliveryArea =
    routeReady && Number(distance) <= MAX_DELIVERY_DISTANCE_KM;

  const restaurantAddress = restaurantSetting?.address?.trim() || "";

  const canContinue =
    Boolean(customerLocation) &&
    Boolean(restaurantLocation) &&
    routeReady &&
    isWithinDeliveryArea &&
    !isEstimating;

  // ==================================================
  // RESET WHEN OPEN
  // ==================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setCustomerName("");
    setCustomerPhone("");

    setAddress("");
    setAddressSuggestions([]);
    setShowSuggestions(false);
    setIsSearchingAddress(false);

    setCustomerLocation(null);

    setDistance(null);
    setEstimatedTime(null);
    setRouteGeoJson(null);
    setIsEstimating(false);
    setRouteError("");
  }, [open]);

  // ==================================================
  // RESTAURANT ADDRESS -> TEMP COORDINATES
  //
  // Chỉ dùng để tính route.
  // geoapifyService có cache nên cùng một địa chỉ
  // sẽ không bị geocode lại liên tục.
  // ==================================================

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    if (!restaurantAddress) {
      setRestaurantLocation(null);
      setRestaurantLocationError(
        "Chưa có địa chỉ nhà hàng trong cấu hình RestaurantSetting.",
      );

      return undefined;
    }

    const controller = new AbortController();

    const loadRestaurantLocation = async () => {
      try {
        setRestaurantLocationLoading(true);
        setRestaurantLocationError("");

        const location = await geoapifyService.geocodeAddress(
          restaurantAddress,
          {
            signal: controller.signal,
          },
        );

        setRestaurantLocation(location);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("GEOCODE RESTAURANT ERROR:", error);

        setRestaurantLocation(null);
        setRestaurantLocationError(
          error.message || "Không xác định được vị trí nhà hàng.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setRestaurantLocationLoading(false);
        }
      }
    };

    loadRestaurantLocation();

    return () => {
      controller.abort();
    };
  }, [open, restaurantAddress]);

  // ==================================================
  // ADDRESS AUTOCOMPLETE
  //
  // - ít nhất 3 ký tự
  // - debounce 400ms
  // - chỉ tìm trong Việt Nam
  // - bias gần nhà hàng nếu origin đã có
  // ==================================================

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const query = address.trim();

    if (query.length < AUTOCOMPLETE_MIN_LENGTH) {
      setAddressSuggestions([]);
      setIsSearchingAddress(false);

      return undefined;
    }

    // Đã chọn đúng suggestion rồi thì không search lại.
    if (customerLocation?.formatted === query) {
      setAddressSuggestions([]);
      setIsSearchingAddress(false);

      return undefined;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        setIsSearchingAddress(true);

        const suggestions = await geoapifyService.autocompleteAddress(query, {
          limit: 5,
          bias: restaurantLocation,
          signal: controller.signal,
        });

        setAddressSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("ADDRESS AUTOCOMPLETE ERROR:", error);

        setAddressSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingAddress(false);
        }
      }
    }, AUTOCOMPLETE_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, address, restaurantLocation, customerLocation]);

  // ==================================================
  // ROUTE AUTO CALCULATION
  //
  // Chọn suggestion xong -> tự tính route.
  // Không cần nút "Tính khoảng cách" nữa.
  // ==================================================

  useEffect(() => {
    if (!open || !restaurantLocation || !customerLocation) {
      return undefined;
    }

    const controller = new AbortController();

    const calculateRoute = async () => {
      try {
        setIsEstimating(true);
        setRouteError("");

        setDistance(null);
        setEstimatedTime(null);
        setRouteGeoJson(null);

        const result = await geoapifyService.getRoute(
          restaurantLocation,
          customerLocation,
          {
            mode: "scooter",
            traffic: "approximated",
            signal: controller.signal,
          },
        );

        const distanceKm = Number((result.distanceMeters / 1000).toFixed(2));
        const timeMinutes = Math.max(1, Math.ceil(result.timeSeconds / 60));

        setDistance(distanceKm);
        setEstimatedTime(timeMinutes);
        setRouteGeoJson(result.geoJson);

        if (distanceKm > MAX_DELIVERY_DISTANCE_KM) {
          toast.warning(
            `Địa chỉ cách ${distanceKm} km, vượt phạm vi giao tối đa ${MAX_DELIVERY_DISTANCE_KM} km.`,
          );
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("DELIVERY ROUTE ERROR:", error);

        setRouteError(error.message || "Không thể tính tuyến đường giao hàng.");
      } finally {
        if (!controller.signal.aborted) {
          setIsEstimating(false);
        }
      }
    };

    calculateRoute();

    return () => {
      controller.abort();
    };
  }, [open, restaurantLocation, customerLocation]);

  // ==================================================
  // SUGGESTION LABELS
  // ==================================================

  const suggestionItems = useMemo(
    () =>
      addressSuggestions.map((item, index) => ({
        ...item,
        key: `${item.lat}-${item.lon}-${index}`,
      })),
    [addressSuggestions],
  );

  if (!open) {
    return null;
  }

  // ==================================================
  // ADDRESS CHANGE
  // ==================================================

  const handleAddressChange = (event) => {
    const nextAddress = event.target.value;

    setAddress(nextAddress);
    setShowSuggestions(true);

    // Người dùng sửa text sau khi đã chọn địa chỉ
    // -> route cũ không còn hợp lệ.
    setCustomerLocation(null);
    setDistance(null);
    setEstimatedTime(null);
    setRouteGeoJson(null);
    setRouteError("");
  };

  // ==================================================
  // SELECT ADDRESS
  // ==================================================

  const handleSelectAddress = (suggestion) => {
    setAddress(suggestion.formatted);
    setCustomerLocation(suggestion);

    setAddressSuggestions([]);
    setShowSuggestions(false);

    setDistance(null);
    setEstimatedTime(null);
    setRouteGeoJson(null);
    setRouteError("");
  };

  // ==================================================
  // VALIDATE
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

    if (!customerLocation) {
      toast.warning("Vui lòng chọn một địa chỉ trong danh sách gợi ý.");

      return false;
    }

    if (!restaurantLocation) {
      toast.error(
        restaurantLocationError || "Chưa xác định được vị trí nhà hàng.",
      );

      return false;
    }

    if (isEstimating) {
      toast.info("Hệ thống đang tính khoảng cách giao hàng.");

      return false;
    }

    if (!routeReady) {
      toast.warning("Chưa tính được khoảng cách và thời gian giao hàng.");

      return false;
    }

    if (!isWithinDeliveryArea) {
      toast.warning(
        `Địa chỉ vượt phạm vi giao hàng tối đa ${MAX_DELIVERY_DISTANCE_KM} km.`,
      );

      return false;
    }

    return true;
  };

  // ==================================================
  // CONTINUE
  //
  // Chỉ lưu:
  // - address
  // - distance
  // - estimatedTime
  //
  // Không lưu lat/lon.
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
            <div className={styles.shippingHeader}>
              <div className={styles.shippingIcon}>
                <Bike size={19} />
              </div>

              <div>
                <h3>Thông Tin Người Nhận</h3>
                <p>Chọn địa chỉ để hệ thống tự tính tuyến giao hàng</p>
              </div>
            </div>

            {/* ==================================================
                CUSTOMER
            ================================================== */}

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
                    maxLength={100}
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

            {/* ==================================================
                ADDRESS AUTOCOMPLETE
            ================================================== */}

            <div className={styles.inputGroup}>
              <label>
                ĐỊA CHỈ GIAO HÀNG
                <span>*</span>
              </label>

              <div className={styles.addressAutocomplete}>
                <div className={styles.addressInput}>
                  {isSearchingAddress ? (
                    <LoaderCircle className={styles.spin} size={17} />
                  ) : (
                    <Search size={17} />
                  )}

                  <input
                    type="text"
                    maxLength={255}
                    autoComplete="off"
                    placeholder="Ví dụ: 25 Võ Văn Ngân, Thủ Đức..."
                    value={address}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      window.setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    onChange={handleAddressChange}
                  />
                </div>

                {showSuggestions &&
                  address.trim().length >= AUTOCOMPLETE_MIN_LENGTH && (
                    <div className={styles.suggestionDropdown}>
                      {isSearchingAddress && suggestionItems.length === 0 ? (
                        <div className={styles.suggestionState}>
                          <LoaderCircle className={styles.spin} size={15} />
                          Đang tìm địa chỉ...
                        </div>
                      ) : suggestionItems.length > 0 ? (
                        suggestionItems.map((suggestion) => (
                          <button
                            type="button"
                            key={suggestion.key}
                            className={styles.suggestionItem}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => handleSelectAddress(suggestion)}
                          >
                            <MapPin size={15} />

                            <span>
                              <strong>
                                {suggestion.addressLine1 ||
                                  suggestion.formatted}
                              </strong>

                              <small>
                                {suggestion.addressLine2 ||
                                  suggestion.formatted}
                              </small>
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className={styles.suggestionState}>
                          Không tìm thấy địa chỉ phù hợp.
                        </div>
                      )}
                    </div>
                  )}
              </div>

              <p className={styles.addressHint}>
                Gõ ít nhất {AUTOCOMPLETE_MIN_LENGTH} ký tự rồi chọn một địa chỉ
                được gợi ý. Hệ thống sẽ tự tính khoảng cách và thời gian.
              </p>
            </div>

            {/* ==================================================
                RESTAURANT ORIGIN STATUS
            ================================================== */}

            {restaurantLocationLoading && (
              <div className={styles.routeInfoNotice}>
                <LoaderCircle className={styles.spin} size={15} />
                Đang xác định vị trí nhà hàng...
              </div>
            )}

            {restaurantLocationError && (
              <div className={styles.routeErrorNotice}>
                <AlertTriangle size={15} />
                {restaurantLocationError}
              </div>
            )}

            {/* ==================================================
                ROUTE ESTIMATE
            ================================================== */}

            <div className={styles.shippingEstimate}>
              <div className={styles.estimateItem}>
                <div className={styles.estimateIcon}>
                  <Route size={18} />
                </div>

                <div>
                  <span>KHOẢNG CÁCH</span>
                  <strong>
                    {isEstimating
                      ? "Đang tính..."
                      : distance !== null
                        ? `${distance} km`
                        : "-- km"}
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
                    {isEstimating
                      ? "Đang tính..."
                      : estimatedTime !== null
                        ? `~ ${estimatedTime} phút`
                        : "-- phút"}
                  </strong>
                </div>
              </div>
            </div>

            {/* ==================================================
                ROUTE STATUS
            ================================================== */}

            {routeError && (
              <div className={styles.routeErrorNotice}>
                <AlertTriangle size={15} />
                {routeError}
              </div>
            )}

            {routeReady && isWithinDeliveryArea && (
              <div className={styles.estimateSuccess}>
                <CheckCircle2 size={15} />

                <span>
                  Địa chỉ nằm trong phạm vi giao hàng. Khoảng cách{" "}
                  <strong>{distance} km</strong>, thời gian dự kiến{" "}
                  <strong>{estimatedTime} phút</strong>.
                </span>
              </div>
            )}

            {routeReady && !isWithinDeliveryArea && (
              <div className={styles.outOfRangeNotice}>
                <AlertTriangle size={16} />

                <span>
                  Khoảng cách <strong>{distance} km</strong> vượt phạm vi giao
                  tối đa <strong>{MAX_DELIVERY_DISTANCE_KM} km</strong>. Không
                  thể tạo đơn giao hàng cho địa chỉ này.
                </span>
              </div>
            )}

            {/* ==================================================
                MAP
            ================================================== */}

            {restaurantLocation && customerLocation && routeGeoJson && (
              <div className={styles.mapSection}>
                <div className={styles.mapHeader}>
                  <div>
                    <strong>Tuyến giao hàng</strong>
                    <span>{restaurantAddress}</span>
                  </div>

                  <MapPin size={17} />
                </div>

                <DeliveryRouteMap
                  restaurantLocation={restaurantLocation}
                  customerLocation={customerLocation}
                  routeGeoJson={routeGeoJson}
                />
              </div>
            )}
          </div>

          {/* ==================================================
              CONTINUE
          ================================================== */}

          <button
            type="button"
            className={styles.modalPrimaryButton}
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {isEstimating
              ? "Đang tính tuyến giao hàng..."
              : "Tiếp tục chọn món"}
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewOrderModal;
