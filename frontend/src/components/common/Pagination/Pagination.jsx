import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./Pagination.module.css";

function Pagination({ page, totalPages, hasNext, hasPrevious, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  // =========================
  // CREATE PAGE NUMBERS
  // =========================

  const createPageNumbers = () => {
    const pages = [];

    // Ít trang -> show hết
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i += 1) {
        pages.push(i);
      }

      return pages;
    }

    // Nhiều trang
    pages.push(0);

    // ...
    if (page > 3) {
      pages.push("left-ellipsis");
    }

    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages - 2, page + 1);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    // ...
    if (page < totalPages - 4) {
      pages.push("right-ellipsis");
    }

    pages.push(totalPages - 1);

    return pages;
  };

  const pageNumbers = createPageNumbers();

  return (
    <nav className={styles.pagination} aria-label="Phân trang">
      {/* PREVIOUS */}

      <button
        type="button"
        className={styles.navigationButton}
        disabled={!hasPrevious}
        onClick={() => onPageChange(page - 1)}
        aria-label="Trang trước"
      >
        <ChevronLeft size={17} />
      </button>

      {/* PAGE NUMBERS */}

      <div className={styles.pageList}>
        {pageNumbers.map((item) => {
          if (item === "left-ellipsis" || item === "right-ellipsis") {
            return (
              <span key={item} className={styles.ellipsis}>
                ...
              </span>
            );
          }

          const active = item === page;

          return (
            <button
              key={item}
              type="button"
              className={`${styles.pageButton} ${active ? styles.active : ""}`}
              onClick={() => onPageChange(item)}
              aria-current={active ? "page" : undefined}
            >
              {item + 1}
            </button>
          );
        })}
      </div>

      {/* NEXT */}

      <button
        type="button"
        className={styles.navigationButton}
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        aria-label="Trang sau"
      >
        <ChevronRight size={17} />
      </button>
    </nav>
  );
}

export default Pagination;