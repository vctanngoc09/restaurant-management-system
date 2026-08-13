import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import styles from "./ExpenseSummary.module.css";

function ExpenseSummary({ totalRevenue, totalExpenses, expenseCount }) {
  const netProfit = totalRevenue - totalExpenses;

  const profitMargin =
    totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  return (
    <section className={styles.grid}>
      {/* TOTAL REVENUE */}
      <article className={styles.card}>
        <div>
          <span className={styles.label}>Tổng Thu (Total Revenue)</span>

          <strong className={styles.value}>
            {formatCurrency(totalRevenue)}
          </strong>

          <span className={styles.growth}>
            <TrendingUp size={14} />
            Tăng trưởng +14%
          </span>
        </div>

        <div className={`${styles.icon} ${styles.revenueIcon}`}>
          <DollarSign size={25} />
        </div>
      </article>

      {/* TOTAL EXPENSE */}
      <article className={styles.card}>
        <div>
          <span className={styles.label}>Tổng Chi (Total Expenses)</span>

          <strong className={`${styles.value} ${styles.expenseValue}`}>
            {formatCurrency(totalExpenses)}
          </strong>

          <span className={styles.description}>
            {expenseCount} khoản chi trong kỳ
          </span>
        </div>

        <div className={`${styles.icon} ${styles.expenseIcon}`}>
          <TrendingDown size={25} />
        </div>
      </article>

      {/* NET PROFIT */}
      <article className={styles.profitCard}>
        <div>
          <span className={styles.profitLabel}>
            Lợi Nhuận Ròng (Net Profit)
          </span>

          <strong className={styles.profitValue}>
            {formatCurrency(netProfit)}
          </strong>

          <span className={styles.profitRate}>
            Tỷ suất lợi nhuận: {profitMargin}%
          </span>
        </div>

        <div className={styles.profitIcon}>
          <Wallet size={25} />
        </div>
      </article>
    </section>
  );
}

export default ExpenseSummary;
