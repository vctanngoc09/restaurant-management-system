import { Search } from "lucide-react";

import {
  ORDER_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
} from "../../../../../constants/orderStatus";

import styles from "./OrderFilters.module.css";

function OrderFilters({
  searchQuery,
  onSearchChange,

  statusFilter,
  onStatusChange,

  typeFilter,
  onTypeChange,
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.search}>
        <Search size={16} />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Mã đơn / Tên bàn / Phục vụ..."
        />
      </div>

      <select
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        {ORDER_STATUS_OPTIONS.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      <select
        value={typeFilter}
        onChange={(event) => onTypeChange(event.target.value)}
      >
        {ORDER_TYPE_OPTIONS.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OrderFilters;
