import { CreditCard, DollarSign, QrCode } from "lucide-react";

import {
  DASHBOARD_SUMMARY,
  PAYMENT_METHODS,
} from "../../../../../data/adminDashboardMock";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import styles from "./PaymentRatio.module.css";

const PAYMENT_ICONS = {
  cash: DollarSign,
  vietqr: QrCode,
  card: CreditCard,
};

const PAYMENT_COLOR_CLASSES = {
  cash: "cash",
  vietqr: "vietqr",
  card: "credit",
};

function PaymentRatio() {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2>
            <CreditCard size={17} />
            Tỷ Lệ Phương Thức Thanh Toán (Payment Method Ratio)
          </h2>

          <p>
            Phân bổ cơ cấu doanh thu theo tiền mặt, chuyển khoản VietQR và thẻ
            POS
          </p>
        </div>

        <strong className={styles.total}>
          Tổng Doanh Thu: {formatCurrency(DASHBOARD_SUMMARY.todayRevenue)}
        </strong>
      </div>

      <div className={styles.bar}>
        {PAYMENT_METHODS.map((method) => (
          <span
            key={method.id}
            className={styles[PAYMENT_COLOR_CLASSES[method.id]]}
            style={{
              width: `${method.percentage}%`,
            }}
          />
        ))}
      </div>

      <div className={styles.grid}>
        {PAYMENT_METHODS.map((method) => {
          const Icon = PAYMENT_ICONS[method.id];

          return (
            <article key={method.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <Icon size={16} />

                  <strong>
                    {method.name}

                    {method.englishName ? ` (${method.englishName})` : ""}
                  </strong>
                </div>

                <span>{method.percentage}%</span>
              </div>

              <strong className={styles.amount}>
                {formatCurrency(method.amount)}
              </strong>

              <div className={styles.progress}>
                <span
                  className={styles[PAYMENT_COLOR_CLASSES[method.id]]}
                  style={{
                    width: `${method.percentage}%`,
                  }}
                />
              </div>

              <div className={styles.description}>
                <span>{method.description}</span>

                <span>{method.percentage}% tổng đơn</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PaymentRatio;
