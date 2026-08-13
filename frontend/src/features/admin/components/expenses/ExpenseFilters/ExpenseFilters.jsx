import { Search } from "lucide-react";

import styles from "./ExpenseFilters.module.css";

function ExpenseFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.categories}>
        <span className={styles.label}>Hạng mục:</span>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={
              selectedCategory === category.id
                ? styles.categoryActive
                : styles.category
            }
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className={styles.search}>
        <Search size={16} />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm theo hạng mục, người chi, ghi chú..."
        />
      </div>
    </div>
  );
}

export default ExpenseFilters;
