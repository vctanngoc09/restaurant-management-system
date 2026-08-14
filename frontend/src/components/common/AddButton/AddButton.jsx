import { Plus } from "lucide-react";

import styles from "./AddButton.module.css";

function AddButton({
  children,
  onClick,
  disabled = false,
  title,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${styles.button} ${className}`}
    >
      <Plus size={17} strokeWidth={2} />

      <span>{children}</span>
    </button>
  );
}

export default AddButton;
