import { ToggleLeft, ToggleRight } from "lucide-react";

import styles from "./StockToggleButton.module.css";

function StockToggleButton({
  status,
  onClick,
  disabled = false,
  className = "",
}) {
  const inStock = status === "in_stock";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        ${styles.button}
        ${inStock ? styles.available : styles.unavailable}
        ${className}
      `}
      title={inStock ? "Đánh dấu món là hết món" : "Đánh dấu món là sẵn sàng"}
    >
      {inStock ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}

      <span>{inStock ? "Sẵn sàng" : "Hết món"}</span>
    </button>
  );
}

export default StockToggleButton;
