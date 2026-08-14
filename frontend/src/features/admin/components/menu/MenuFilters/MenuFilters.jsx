import SearchInput from "../../../../../components/common/SearchInput/SearchInput";

import { MENU_CATEGORIES } from "../../../../../constants/menuCategories";

import styles from "./MenuFilters.module.css";

function MenuFilters({
                         selectedCategory,
                         onCategoryChange,
                         searchQuery,
                         onSearchChange,

                         filteredCount,
                         totalCount,
                     }) {
    return (
        <div className={styles.filters}>
            {/* CATEGORY FILTER */}
            <div className={styles.categories}>
                {MENU_CATEGORIES.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                            onCategoryChange(category.id)
                        }
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

            {/* SEARCH + RESULT */}
            <div className={styles.rightSection}>
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Tìm theo tên món..."
                    className={styles.searchInput}
                />

                <div className={styles.result}>
                    Hiển thị{" "}
                    <strong>{filteredCount}</strong>
                    {" / "}
                    <strong>{totalCount}</strong>
                    {" món"}
                </div>
            </div>
        </div>
    );
}

export default MenuFilters;