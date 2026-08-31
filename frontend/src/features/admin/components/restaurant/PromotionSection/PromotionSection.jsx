import { Plus, Search } from "lucide-react";

import PromotionTable from "../PromotionTable/PromotionTable";

import styles from "./PromotionSection.module.css";

function PromotionSection({
  promotions,
  loading,
  searchQuery,
  statusFilter,
  onSearchChange,
  onFilterChange,
  onCreate,
  onEdit,
  onToggle,
}) {
  return (
    <section className={styles.panel}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>KHUYẾN MÃI</span>

          <h2>Mã Giảm Giá</h2>

          <p>
            Quản lý mã giảm phần trăm hoặc số tiền cố định áp dụng khi thanh
            toán.
          </p>
        </div>

        <button
          type="button"
          className={styles.createButton}
          onClick={onCreate}
        >
          <Plus size={16} />
          Tạo mã giảm giá
        </button>
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className={styles.content}>
        {/* =========================
            TOOLBAR
        ========================= */}

        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Search size={15} />

            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm theo mã hoặc tên chương trình..."
            />
          </div>

          <div className={styles.filters}>
            <button
              type="button"
              className={statusFilter === "ALL" ? styles.activeFilter : ""}
              onClick={() => onFilterChange("ALL")}
            >
              Tất cả
            </button>

            <button
              type="button"
              className={statusFilter === "ACTIVE" ? styles.activeFilter : ""}
              onClick={() => onFilterChange("ACTIVE")}
            >
              Đang hoạt động
            </button>

            <button
              type="button"
              className={statusFilter === "INACTIVE" ? styles.activeFilter : ""}
              onClick={() => onFilterChange("INACTIVE")}
            >
              Đã tắt
            </button>
          </div>
        </div>

        {/* =========================
            TABLE
        ========================= */}

        <PromotionTable
          promotions={promotions}
          loading={loading}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      </div>
    </section>
  );
}

export default PromotionSection;
