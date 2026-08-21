import { ImageIcon, Ban } from "lucide-react";

import StockToggleButton from "../../../../../components/common/StockToggleButton";

import {
  ActionButton,
  ActionGroup,
} from "../../../../../components/common/ActionButton";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import styles from "./MenuTable.module.css";

function MenuTable({ menuItems, onEdit, onDelete, onRestore, onToggleStock }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {/* =========================
            HEADER
        ========================= */}

        <thead>
          <tr>
            <th>Món Ăn</th>

            <th>Danh Mục</th>

            <th>Đơn Giá</th>

            <th>Trạng Thái Kho</th>

            <th className={styles.actionsHeader}>Thao Tác CRUD</th>
          </tr>
        </thead>

        {/* =========================
            BODY
        ========================= */}

        <tbody>
          {menuItems.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Không tìm thấy món ăn nào phù hợp.
              </td>
            </tr>
          ) : (
            menuItems.map((item) => {
              // =========================
              // STATUS
              // =========================

              const isInactive = item.productStatus === "INACTIVE";

              return (
                <tr key={item.id}>
                  {/* =========================
                          FOOD
                      ========================= */}

                  <td>
                    <div className={styles.food}>
                      <div className={styles.image}>
                        {item.urlImg ? (
                          <img src={item.urlImg} alt={item.name} />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>

                      <div className={styles.foodInfo}>
                        <strong>{item.name}</strong>
                      </div>
                    </div>
                  </td>

                  {/* =========================
                          CATEGORY
                      ========================= */}

                  <td>
                    <span className={styles.category}>
                      {item.categoryName || "Chưa có danh mục"}
                    </span>
                  </td>

                  {/* =========================
                          PRICE
                      ========================= */}

                  <td className={styles.price}>{formatCurrency(item.price)}</td>

                  {/* =========================
                          STATUS
                      ========================= */}

                  <td>
                    {isInactive ? (
                      <div className={styles.stopSelling}>
                        <Ban size={17} />
                        <span>Ngừng bán</span>
                      </div>
                    ) : (
                      <StockToggleButton
                        status={item.status}
                        onClick={() => onToggleStock(item)}
                      />
                    )}
                  </td>

                  {/* =========================
                          ACTION
                      ========================= */}

                  <td>
                    <ActionGroup>
                      <ActionButton
                        action="edit"
                        title={`Sửa ${item.name}`}
                        onClick={() => onEdit(item)}
                      />

                      {isInactive ? (
                        <ActionButton
                          action="restore"
                          title={`Khôi phục ${item.name}`}
                          onClick={() => onRestore(item)}
                        />
                      ) : (
                        <ActionButton
                          action="delete"
                          title={`Ngừng bán ${item.name}`}
                          onClick={() => onDelete(item)}
                        />
                      )}
                    </ActionGroup>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MenuTable;
