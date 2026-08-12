import { CalendarDays, FileSpreadsheet } from "lucide-react";

import { toast } from "react-toastify";

import styles from "./DashboardHeader.module.css";

function DashboardHeader() {
  const handleExport = () => {
    // Mock tạm thời.
    // Sau này gọi reportService.exportRevenue(...)
    toast.success("Mock: Đã xuất báo cáo Excel thành công!");
  };

  return (
    <section className={styles.header}>
      <div>
        <span className={styles.badge}>Hệ Thống Quản Lý RESTO POS</span>

        <h1>Bảng Điều Khiển & Tổng Quan Doanh Thu</h1>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.dateButton}>
          <CalendarDays size={16} />

          <span>01/08/2026 - 07/08/2026</span>

          <span className={styles.dateBadge}>7 ngày</span>
        </button>

        <button
          type="button"
          className={styles.exportButton}
          onClick={handleExport}
        >
          <FileSpreadsheet size={16} />

          <span>Xuất Báo Cáo (Excel)</span>
        </button>
      </div>
    </section>
  );
}

export default DashboardHeader;