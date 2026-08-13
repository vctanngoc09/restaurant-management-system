import { CalendarDays, FileSpreadsheet } from "lucide-react";

import { toast } from "react-toastify";

import styles from "./AdminPageHeader.module.css";

function AdminPageHeader({
  title,
  dateText = "01/08/2026 - 07/08/2026",
  dayCount = "7 ngày",
  onExport,
}) {
  const handleExport = () => {
    if (onExport) {
      onExport();
      return;
    }

    // Mock mặc định
    toast.success("Mock: Đã xuất báo cáo Excel thành công!");
  };

  return (
    <section className={styles.header}>
      <div>
        <span className={styles.badge}>Hệ Thống Quản Lý RESTO POS</span>

        <h1>{title}</h1>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.dateButton}>
          <CalendarDays size={16} />

          <span>{dateText}</span>

          <span className={styles.dateBadge}>{dayCount}</span>
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

export default AdminPageHeader;
