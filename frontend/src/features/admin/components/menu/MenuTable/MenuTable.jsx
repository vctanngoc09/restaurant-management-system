import { ImageIcon, Pencil, Trash2 } from "lucide-react";

import { MENU_CATEGORY_LABELS } from "../../../../../constants/menuCategories";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import MenuStatusBadge from "../MenuStatusBadge/MenuStatusBadge";

import styles from "./MenuTable.module.css";

function MenuTable({ menuItems, onEdit, onDelete }) {
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
                  <MenuStatusBadge status={item.status} />
                </td>

                {/* ACTION */}

                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => onEdit(item)}
                    >
                      <Pencil size={13} />

                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 size={13} />

                      <span>Xóa</span>
                    </button>
                  </div>
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
