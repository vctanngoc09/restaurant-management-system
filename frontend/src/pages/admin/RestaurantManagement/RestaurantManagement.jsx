import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import RestaurantSummary from "../../../features/admin/components/restaurant/RestaurantSummary/RestaurantSummary";

import RestaurantSettingPanel from "../../../features/admin/components/restaurant/RestaurantSettingPanel/RestaurantSettingPanel";

import PromotionSection from "../../../features/admin/components/restaurant/PromotionSection/PromotionSection";

import PromotionFormModal from "../../../features/admin/components/restaurant/PromotionFormModal/PromotionFormModal";

import useRestaurantManagement from "../../../features/admin/hooks/useRestaurantManagement";

import styles from "./RestaurantManagement.module.css";

function RestaurantManagement() {
  const restaurant = useRestaurantManagement();

  return (
    <div className={styles.page}>
      <AdminPageHeader title="Quản Lý Nhà Hàng" showActions={false} />

      <RestaurantSummary
        restaurantSetting={restaurant.restaurantSetting}
        restaurantForm={restaurant.restaurantForm}
        promotions={restaurant.promotions}
        activePromotionCount={restaurant.activePromotionCount}
      />

      <RestaurantSettingPanel
        setting={restaurant.restaurantSetting}
        form={restaurant.restaurantForm}
        loading={restaurant.restaurantLoading}
        saving={restaurant.restaurantSaving}
        onChange={restaurant.handleRestaurantChange}
        onSubmit={restaurant.handleSaveRestaurant}
      />

      <PromotionSection
        promotions={restaurant.filteredPromotions}
        loading={restaurant.promotionLoading}
        searchQuery={restaurant.searchQuery}
        statusFilter={restaurant.statusFilter}
        onSearchChange={restaurant.setSearchQuery}
        onFilterChange={restaurant.setStatusFilter}
        onCreate={restaurant.handleOpenCreatePromotion}
        onEdit={restaurant.handleOpenEditPromotion}
        onToggle={restaurant.handleTogglePromotion}
      />

      <PromotionFormModal
        open={restaurant.isPromotionModalOpen}
        editingPromotion={restaurant.editingPromotion}
        form={restaurant.promotionForm}
        saving={restaurant.promotionSaving}
        onChange={restaurant.handlePromotionChange}
        onClose={restaurant.handleClosePromotionModal}
        onSubmit={restaurant.handleSavePromotion}
      />
    </div>
  );
}

export default RestaurantManagement;
