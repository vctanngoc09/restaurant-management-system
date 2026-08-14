import { ImageIcon } from "lucide-react";
import StockToggleButton from "../../../../../components/common/StockToggleButton";
import {
  ActionButton,
  ActionGroup,
} from "../../../../../components/common/ActionButton";

import { MENU_CATEGORY_LABELS } from "../../../../../constants/menuCategories";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import styles from "./MenuTable.module.css";

function MenuTable({ menuItems, onEdit, onDelete, onToggleStock, }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Món Ăn</th>

            <th>Danh Mục</th>

            <th>Đơn Giá</th>

            <th>Trạng Thái Kho</th>

            <th className={styles.actionsHeader}>Thao Tác CRUD</th>
          </tr>
        </thead>

        <tbody>
          {menuItems.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Không tìm thấy món ăn nào phù hợp.
              </td>
            </tr>
          ) : (
            menuItems.map((item) => (
              <tr key={item.id}>
                {/* FOOD */}

                <td>
                  <div className={styles.food}>
                    <div className={styles.image}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </div>

                    <div className={styles.foodInfo}>
                      <strong>{item.name}</strong>

                      <span title={item.description}>
                        {item.description || "Chưa có mô tả"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}

                <td>
                  <span className={styles.category}>
                    {MENU_CATEGORY_LABELS[item.category] || item.category}
                  </span>
                </td>

                {/* PRICE */}

                <td className={styles.price}>{formatCurrency(item.price)}</td>

                {/* STATUS */}

                <td>
                  <StockToggleButton
                      status={item.status}
                      onClick={() =>
                          onToggleStock(item.id)
                      }
                  />
                </td>

                {/* ACTION */}

                <td>
                  <ActionGroup>
                    <ActionButton
                        action="edit"
                        title={`Sửa ${item.name}`}
                        onClick={() => onEdit(item)}
                    />

                    <ActionButton
                        action="delete"
                        title={`Xóa ${item.name}`}
                        onClick={() => onDelete(item)}
                    />
                  </ActionGroup>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MenuTable;
