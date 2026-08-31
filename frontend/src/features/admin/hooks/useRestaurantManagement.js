import { useCallback, useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import restaurantSettingService from "../services/restaurantSettingService";
import promotionService from "../services/promotionService";

// ==================================================
// EMPTY RESTAURANT FORM
// ==================================================

const EMPTY_RESTAURANT_FORM = {
  name: "",
  phone: "",
  address: "",
  taxCode: "",
  vatRate: "8",
  logoUrl: "",
};

// ==================================================
// EMPTY PROMOTION FORM
// ==================================================

const EMPTY_PROMOTION_FORM = {
  code: "",
  name: "",
  description: "",

  discountType: "PERCENT",
  discountValue: "",

  minOrderAmount: "0",
  maxDiscountAmount: "",

  startAt: "",
  endAt: "",

  usageLimit: "",

  active: true,
};

// ==================================================
// DATE HELPER
// ==================================================

function toInputDateTime(value) {
  if (!value) {
    return "";
  }

  return value.slice(0, 16);
}

// ==================================================
// HOOK
// ==================================================

function useRestaurantManagement() {
  // ==================================================
  // RESTAURANT STATE
  // ==================================================

  const [restaurantForm, setRestaurantForm] = useState(EMPTY_RESTAURANT_FORM);

  const [restaurantSetting, setRestaurantSetting] = useState(null);

  const [restaurantLoading, setRestaurantLoading] = useState(true);

  const [restaurantSaving, setRestaurantSaving] = useState(false);

  // ==================================================
  // PROMOTION STATE
  // ==================================================

  const [promotions, setPromotions] = useState([]);

  const [promotionLoading, setPromotionLoading] = useState(true);

  const [promotionSaving, setPromotionSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  // ==================================================
  // PROMOTION MODAL
  // ==================================================

  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  const [editingPromotion, setEditingPromotion] = useState(null);

  const [promotionForm, setPromotionForm] = useState(EMPTY_PROMOTION_FORM);

  // ==================================================
  // LOAD RESTAURANT
  //
  // GET /api/restaurant-settings
  // ==================================================

  const loadRestaurantSetting = useCallback(async () => {
    try {
      setRestaurantLoading(true);

      const response = await restaurantSettingService.getCurrent();

      const setting = response?.data;

      if (!setting) {
        setRestaurantSetting(null);

        setRestaurantForm({
          ...EMPTY_RESTAURANT_FORM,
        });

        return;
      }

      setRestaurantSetting(setting);

      setRestaurantForm({
        name: setting.name || "",

        phone: setting.phone || "",

        address: setting.address || "",

        taxCode: setting.taxCode || "",

        vatRate:
          setting.vatRate !== null && setting.vatRate !== undefined
            ? String(setting.vatRate)
            : "8",

        logoUrl: setting.logoUrl || "",
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setRestaurantSetting(null);

        setRestaurantForm({
          ...EMPTY_RESTAURANT_FORM,
        });

        return;
      }

      console.error("LOAD RESTAURANT SETTING ERROR:", error);

      toast.error(
        error.response?.data?.message || "Không thể tải thông tin nhà hàng.",
      );
    } finally {
      setRestaurantLoading(false);
    }
  }, []);

  // ==================================================
  // LOAD PROMOTIONS
  //
  // GET /api/admin/promotions
  // ==================================================

  const loadPromotions = useCallback(async () => {
    try {
      setPromotionLoading(true);

      const response = await promotionService.getAll();

      setPromotions(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("LOAD PROMOTIONS ERROR:", error);

      toast.error(
        error.response?.data?.message || "Không thể tải danh sách mã giảm giá.",
      );

      setPromotions([]);
    } finally {
      setPromotionLoading(false);
    }
  }, []);

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadRestaurantSetting();

    loadPromotions();
  }, [loadRestaurantSetting, loadPromotions]);

  // ==================================================
  // RESTAURANT CHANGE
  // ==================================================

  const handleRestaurantChange = (event) => {
    const { name, value } = event.target;

    setRestaurantForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // ==================================================
  // SAVE RESTAURANT
  //
  // POST /api/restaurant-settings
  // PUT  /api/restaurant-settings
  // ==================================================

  const handleSaveRestaurant = async (event) => {
    event.preventDefault();

    if (!restaurantForm.name.trim()) {
      toast.warning("Vui lòng nhập tên nhà hàng.");

      return;
    }

    const vatRate = Number(restaurantForm.vatRate);

    if (Number.isNaN(vatRate) || vatRate < 0 || vatRate > 100) {
      toast.warning("VAT phải nằm trong khoảng 0 - 100%.");

      return;
    }

    const request = {
      name: restaurantForm.name.trim(),

      phone: restaurantForm.phone.trim() || null,

      address: restaurantForm.address.trim() || null,

      taxCode: restaurantForm.taxCode.trim() || null,

      vatRate,

      logoUrl: restaurantForm.logoUrl.trim() || null,
    };

    try {
      setRestaurantSaving(true);

      let response;

      if (restaurantSetting?.id) {
        response = await restaurantSettingService.update(request);
      } else {
        response = await restaurantSettingService.create(request);
      }

      toast.success(
        response?.message ||
          (restaurantSetting?.id
            ? "Cập nhật thông tin nhà hàng thành công."
            : "Tạo thông tin nhà hàng thành công."),
      );

      await loadRestaurantSetting();
    } catch (error) {
      console.error("SAVE RESTAURANT SETTING ERROR:", error);

      toast.error(
        error.response?.data?.message || "Không thể lưu thông tin nhà hàng.",
      );
    } finally {
      setRestaurantSaving(false);
    }
  };

  // ==================================================
  // OPEN CREATE PROMOTION
  // ==================================================

  const handleOpenCreatePromotion = () => {
    setEditingPromotion(null);

    setPromotionForm({
      ...EMPTY_PROMOTION_FORM,
    });

    setIsPromotionModalOpen(true);
  };

  // ==================================================
  // OPEN EDIT PROMOTION
  //
  // GET /api/admin/promotions/{id}
  // ==================================================

  const handleOpenEditPromotion = async (promotionId) => {
    try {
      const response = await promotionService.getById(promotionId);

      const promotion = response?.data;

      if (!promotion) {
        throw new Error("Backend không trả về chương trình giảm giá.");
      }

      setEditingPromotion(promotion);

      setPromotionForm({
        code: promotion.code || "",

        name: promotion.name || "",

        description: promotion.description || "",

        discountType: promotion.discountType || "PERCENT",

        discountValue: promotion.discountValue ?? "",

        minOrderAmount: promotion.minOrderAmount ?? "0",

        maxDiscountAmount: promotion.maxDiscountAmount ?? "",

        startAt: toInputDateTime(promotion.startAt),

        endAt: toInputDateTime(promotion.endAt),

        usageLimit: promotion.usageLimit ?? "",

        active: promotion.active !== false,
      });

      setIsPromotionModalOpen(true);
    } catch (error) {
      console.error("GET PROMOTION DETAIL ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Không thể tải mã giảm giá.",
      );
    }
  };

  // ==================================================
  // CLOSE PROMOTION
  // ==================================================

  const handleClosePromotionModal = () => {
    if (promotionSaving) {
      return;
    }

    setIsPromotionModalOpen(false);

    setEditingPromotion(null);

    setPromotionForm({
      ...EMPTY_PROMOTION_FORM,
    });
  };

  // ==================================================
  // PROMOTION CHANGE
  // ==================================================

  const handlePromotionChange = (event) => {
    const { name, value, type, checked } = event.target;

    setPromotionForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==================================================
  // SAVE PROMOTION
  //
  // POST /api/admin/promotions
  // PUT /api/admin/promotions/{id}
  // ==================================================

  const handleSavePromotion = async (event) => {
    event.preventDefault();

    if (!promotionForm.code.trim() || !promotionForm.name.trim()) {
      toast.warning("Vui lòng nhập mã và tên chương trình giảm giá.");

      return;
    }

    if (!promotionForm.startAt || !promotionForm.endAt) {
      toast.warning("Vui lòng chọn thời gian bắt đầu và kết thúc.");

      return;
    }

    const discountValue = Number(promotionForm.discountValue);

    if (Number.isNaN(discountValue) || discountValue <= 0) {
      toast.warning("Giá trị giảm phải lớn hơn 0.");

      return;
    }

    const request = {
      code: promotionForm.code.trim().toUpperCase(),

      name: promotionForm.name.trim(),

      description: promotionForm.description.trim() || null,

      discountType: promotionForm.discountType,

      discountValue,

      minOrderAmount: Number(promotionForm.minOrderAmount || 0),

      maxDiscountAmount:
        promotionForm.maxDiscountAmount === ""
          ? null
          : Number(promotionForm.maxDiscountAmount),

      startAt: promotionForm.startAt,

      endAt: promotionForm.endAt,

      usageLimit:
        promotionForm.usageLimit === ""
          ? null
          : Number(promotionForm.usageLimit),

      active: promotionForm.active,
    };

    try {
      setPromotionSaving(true);

      let response;

      if (editingPromotion?.id) {
        response = await promotionService.update(editingPromotion.id, request);
      } else {
        response = await promotionService.create(request);
      }

      toast.success(
        response?.message ||
          (editingPromotion
            ? "Cập nhật mã giảm giá thành công."
            : "Tạo mã giảm giá thành công."),
      );

      // ==================================================
      // CLOSE DIRECTLY
      //
      // Không gọi handleClosePromotionModal()
      // vì lúc này promotionSaving = true.
      // ==================================================

      setIsPromotionModalOpen(false);

      setEditingPromotion(null);

      setPromotionForm({
        ...EMPTY_PROMOTION_FORM,
      });

      await loadPromotions();
    } catch (error) {
      console.error("SAVE PROMOTION ERROR:", error);

      toast.error(
        error.response?.data?.message || "Không thể lưu chương trình giảm giá.",
      );
    } finally {
      setPromotionSaving(false);
    }
  };

  // ==================================================
  // ACTIVE / INACTIVE
  //
  // PATCH
  // /api/admin/promotions/{id}/active
  // ==================================================

  const handleTogglePromotion = async (promotion) => {
    const newActive = !promotion.active;

    try {
      const response = await promotionService.setActive(
        promotion.id,
        newActive,
      );

      toast.success(
        response?.message ||
          (newActive ? "Đã kích hoạt mã giảm giá." : "Đã tắt mã giảm giá."),
      );

      setPromotions((prev) =>
        prev.map((item) =>
          item.id === promotion.id
            ? response?.data || {
                ...item,
                active: newActive,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("TOGGLE PROMOTION ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Không thể thay đổi trạng thái mã giảm giá.",
      );
    }
  };

  // ==================================================
  // FILTER
  // ==================================================

  const filteredPromotions = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return promotions.filter((promotion) => {
      const matchesSearch =
        !keyword ||
        promotion.code?.toLowerCase().includes(keyword) ||
        promotion.name?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? promotion.active : !promotion.active);

      return matchesSearch && matchesStatus;
    });
  }, [promotions, searchQuery, statusFilter]);

  // ==================================================
  // STAT
  // ==================================================

  const activePromotionCount = promotions.filter((item) => item.active).length;

  // ==================================================
  // RETURN
  // ==================================================

  return {
    // Restaurant
    restaurantForm,
    restaurantSetting,
    restaurantLoading,
    restaurantSaving,

    handleRestaurantChange,
    handleSaveRestaurant,

    // Promotion list
    promotions,
    filteredPromotions,
    promotionLoading,

    searchQuery,
    setSearchQuery,

    statusFilter,
    setStatusFilter,

    activePromotionCount,

    // Promotion modal
    isPromotionModalOpen,
    editingPromotion,
    promotionForm,
    promotionSaving,

    handleOpenCreatePromotion,
    handleOpenEditPromotion,
    handleClosePromotionModal,

    handlePromotionChange,
    handleSavePromotion,

    handleTogglePromotion,
  };
}

export default useRestaurantManagement;