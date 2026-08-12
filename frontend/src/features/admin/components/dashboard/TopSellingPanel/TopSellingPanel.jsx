import { TOP_SELLING_DISHES } from "../../../../../data/adminDashboardMock";
import { formatCurrency } from "../../../../../utils/formatCurrency";

import styles from "./TopSellingPanel.module.css";

function TopSellingPanel() {
  const bestSellingDish = TOP_SELLING_DISHES[0];

  return (
    <article className={styles.panel}>
      <div>
        <h2>Top Món Bán Chạy Nhất</h2>

        <p className={styles.subtitle}>
          Xếp hạng theo sản lượng bán ra trong ngày
        </p>

        <div className={styles.list}>
          {TOP_SELLING_DISHES.map((dish, index) => (
            <div key={dish.name} className={styles.item}>
              <div className={styles.name}>
                <span
                  className={`${styles.rank} ${
                    index === 0 ? styles.first : ""
                  }`}
                >
                  {index + 1}
                </span>

                <strong>{dish.name}</strong>
              </div>

              <div className={styles.value}>
                <strong>{dish.count} phần</strong>

                <span>{formatCurrency(dish.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {bestSellingDish && (
        <footer className={styles.footer}>
          <span>Doanh thu món cao nhất:</span>

          <strong>{bestSellingDish.name}</strong>
        </footer>
      )}
    </article>
  );
}

export default TopSellingPanel;
