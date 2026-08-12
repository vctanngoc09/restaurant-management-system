import {
  DollarSign,
  Layers3,
  ShoppingBag,
  Soup,
  TrendingUp,
} from "lucide-react";

import { DASHBOARD_SUMMARY } from "../../../../../data/adminDashboardMock";
import { formatCurrency } from "../../../../../utils/formatCurrency";

import KpiCard from "../KpiCard/KpiCard";

import styles from "./DashboardKpis.module.css";

function DashboardKpis() {
  const availableTables =
    DASHBOARD_SUMMARY.totalTables - DASHBOARD_SUMMARY.occupiedTables;

  const occupancyRate = Math.round(
    (DASHBOARD_SUMMARY.occupiedTables / DASHBOARD_SUMMARY.totalTables) * 100,
  );

  return (
    <section className={styles.grid}>
      <KpiCard
        label="Doanh Thu Hôm Nay"
        value={formatCurrency(DASHBOARD_SUMMARY.todayRevenue)}
        description={`+${DASHBOARD_SUMMARY.revenueGrowth}% so với hôm qua`}
        descriptionType="success"
        descriptionIcon={TrendingUp}
        icon={DollarSign}
        iconType="indigo"
      />

      <KpiCard
        label="Tổng Đơn Đã Phục Vụ"
        value={`${DASHBOARD_SUMMARY.totalOrders} đơn`}
        description={`${DASHBOARD_SUMMARY.actualOrders} đơn thực tế trên máy`}
        descriptionType="primary"
        icon={ShoppingBag}
        iconType="purple"
      />

      <KpiCard
        label="Trung Bình / Đơn"
        value={formatCurrency(DASHBOARD_SUMMARY.averageBill)}
        description={`${DASHBOARD_SUMMARY.averageItems} món / đơn`}
        descriptionType="success"
        icon={Soup}
        iconType="green"
      />

      <KpiCard
        label="Tỷ Lệ Bàn Có Khách"
        value={`${DASHBOARD_SUMMARY.occupiedTables}/${DASHBOARD_SUMMARY.totalTables} bàn (${occupancyRate}%)`}
        description={`${availableTables} bàn trống sẵn sàng`}
        descriptionType="warning"
        icon={Layers3}
        iconType="orange"
      />
    </section>
  );
}

export default DashboardKpis;
