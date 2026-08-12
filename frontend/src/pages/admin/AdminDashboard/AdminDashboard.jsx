import DashboardHeader from "../../../features/admin/components/dashboard/DashboardHeader/DashboardHeader";
import DashboardKpis from "../../../features/admin/components/dashboard/DashboardKpis/DashboardKpis";
import RevenueChart from "../../../features/admin/components/dashboard/RevenueChart/RevenueChart";
import TopSellingPanel from "../../../features/admin/components/dashboard/TopSellingPanel/TopSellingPanel";
import PaymentRatio from "../../../features/admin/components/dashboard/PaymentRatio/PaymentRatio";
import QuickMenuStock from "../../../features/admin/components/dashboard/QuickMenuStock/QuickMenuStock";

import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <DashboardHeader />

      <DashboardKpis />

      <section className={styles.analytics}>
        <RevenueChart />

        <TopSellingPanel />
      </section>

      <PaymentRatio />

      <QuickMenuStock />
    </div>
  );
}

export default AdminDashboard;