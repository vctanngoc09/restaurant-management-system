import { MapPinned } from "lucide-react";

import styles from "./ManageAreasButton.module.css";

function ManageAreasButton({ onClick }) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <MapPinned size={18} />

      <span>Quản Lý Khu Vực</span>
    </button>
  );
}

export default ManageAreasButton;
