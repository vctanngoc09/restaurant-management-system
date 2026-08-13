import { Search } from "lucide-react";

import { MENU_CATEGORIES } from "../../../../../constants/menuCategories";

import styles from "./MenuFilters.module.css";

function MenuFilters({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.categories}>
        {MENU_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={
              selectedCategory === category.id
                ? styles.activeCategory
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
          placeholder="Tìm theo tên món..."
        />
      </div>
    </div>
  );
}

export default MenuFilters;
