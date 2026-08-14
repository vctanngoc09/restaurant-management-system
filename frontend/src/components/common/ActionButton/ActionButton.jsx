import { Eye, SquarePen, Trash2 } from "lucide-react";

import styles from "./ActionButton.module.css";

const ACTION_CONFIG = {
  view: {
    icon: Eye,
    label: "Xem",
    className: "view",
  },

  edit: {
    icon: SquarePen,
    label: "Sửa",
    className: "edit",
  },

  delete: {
    icon: Trash2,
    label: "Xóa",
    className: "delete",
  },
};

function ActionButton({
  action,
  onClick,
  title,
  disabled = false,
  showLabel = false,
  className = "",
}) {
  const config = ACTION_CONFIG[action];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  const displayTitle = title || config.label;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={displayTitle}
      aria-label={displayTitle}
      className={`
        ${styles.button}
        ${styles[config.className]}
        ${showLabel ? styles.withLabel : ""}
        ${className}
      `}
    >
      <Icon size={15} strokeWidth={1.8} />

      {showLabel && <span>{config.label}</span>}
    </button>
  );
}

export default ActionButton;
