import { Tags } from "lucide-react";

import styles from "./ManageCategoriesButton.module.css";

function ManageCategoriesButton({ onClick }) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <Tags size={18} />

      <span>Quản Lý Danh Mục</span>
    </button>
  );
}

export default ManageCategoriesButton;
