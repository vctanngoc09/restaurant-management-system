import { useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  HOURLY_REVENUE_DATA,
  MONTHLY_REVENUE_DATA,
  WEEKLY_REVENUE_DATA,
} from "../../../../../data/adminDashboardMock";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import styles from "./RevenueChart.module.css";

function RevenueChart() {
  const [timeframe, setTimeframe] = useState("hourly");

  const currentData =
    timeframe === "hourly"
      ? HOURLY_REVENUE_DATA
      : timeframe === "weekly"
        ? WEEKLY_REVENUE_DATA
        : MONTHLY_REVENUE_DATA;

  const dataKey =
    timeframe === "hourly" ? "hour" : timeframe === "weekly" ? "day" : "month";

  const title =
    timeframe === "hourly"
      ? "Thống Kê Doanh Thu Theo Giờ (Hôm nay)"
      : timeframe === "weekly"
        ? "Thống Kê Doanh Thu Trong 1 Tuần"
        : "Thống Kê Doanh Thu Theo Tháng";

  const subtitle =
    timeframe === "hourly"
      ? "Đã làm nổi bật 2 khung giờ cao điểm chính: 12:00 - 13:30 & 18:00 - 19:30"
      : timeframe === "weekly"
        ? "Doanh thu tập trung cao nhất vào Thứ 7 & Chủ Nhật"
        : "Theo dõi xu hướng doanh thu trong 12 tháng";

  return (
    <article className={styles.panel}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h2>{title}</h2>

            {timeframe === "hourly" && (
              <span className={styles.peakBadge}>🔥 Giờ cao điểm</span>
            )}
          </div>

          <p>{subtitle}</p>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={timeframe === "hourly" ? styles.activeTab : styles.tab}
            onClick={() => setTimeframe("hourly")}
          >
            Theo Giờ
          </button>

          <button
            type="button"
            className={timeframe === "weekly" ? styles.activeTab : styles.tab}
            onClick={() => setTimeframe("weekly")}
          >
            Trong 1 Tuần
          </button>

          <button
            type="button"
            className={timeframe === "monthly" ? styles.activeTab : styles.tab}
            onClick={() => setTimeframe("monthly")}
          >
            Trong 1 Tháng/Năm
          </button>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.38} />

                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#e8edf4"
              strokeDasharray="3 3"
              vertical={false}
            />

            {timeframe === "hourly" && (
              <>
                <ReferenceArea
                  x1="10:00"
                  x2="12:00"
                  fill="#fef3c7"
                  fillOpacity={0.55}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                />

                <ReferenceArea
                  x1="16:00"
                  x2="18:00"
                  fill="#fef3c7"
                  fillOpacity={0.55}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                />
              </>
            )}

            <XAxis dataKey={dataKey} tickLine={false} axisLine={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${Math.round(value / 1000000)}M`}
            />

            <Tooltip
              formatter={(value) => [formatCurrency(value), "Doanh Thu"]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {timeframe === "hourly" && (
        <div className={styles.notice}>
          <div>
            <span />

            <strong>
              Vùng highlight màu vàng: Khung giờ cao điểm (Peak Hours)
            </strong>
          </div>

          <p>
            Gợi ý: Cần xếp thêm 2 phục vụ & 1 phụ bếp trong khung giờ 11:30 -
            13:30 và 17:30 - 19:30
          </p>
        </div>
      )}
    </article>
  );
}

export default RevenueChart;
