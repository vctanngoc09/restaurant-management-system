import { Search, X } from "lucide-react";

import styles from "./SearchInput.module.css";

function SearchInput({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "",
  showClearButton = true,
}) {
  const hasValue = Boolean(value?.trim());

  return (
    <div className={`${styles.search} ${className}`}>
      <Search size={16} className={styles.searchIcon} />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />

      {showClearButton && hasValue && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange("")}
          title="Xóa tìm kiếm"
          aria-label="Xóa tìm kiếm"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
