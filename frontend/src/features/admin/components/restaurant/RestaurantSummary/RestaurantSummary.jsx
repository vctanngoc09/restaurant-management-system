import { BadgePercent, CheckCircle2, ReceiptText, Store } from "lucide-react";

import styles from "./RestaurantSummary.module.css";

function RestaurantSummary({
  restaurantSetting,
  restaurantForm,
  promotions,
  activePromotionCount,
}) {
  return (
    <section className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <Store size={19} />
        </div>

        <div className={styles.content}>
          <span>Nhà hàng</span>

          <strong>{restaurantSetting?.name || "Chưa cấu hình"}</strong>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.icon}>
          <ReceiptText size={19} />
        </div>

        <div className={styles.content}>
          <span>Thuế VAT</span>

          <strong>
            {restaurantSetting?.vatRate ?? restaurantForm.vatRate}%
          </strong>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.icon}>
          <BadgePercent size={19} />
        </div>

        <div className={styles.content}>
          <span>Mã giảm giá</span>

          <strong>{promotions.length} chương trình</strong>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.icon}>
          <CheckCircle2 size={19} />
        </div>

        <div className={styles.content}>
          <span>Đang hoạt động</span>

          <strong>{activePromotionCount} mã</strong>
        </div>
      </div>
    </section>
  );
}

export default RestaurantSummary;
