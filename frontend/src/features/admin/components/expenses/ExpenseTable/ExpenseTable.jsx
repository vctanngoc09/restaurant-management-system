import { Pencil, Trash2 } from "lucide-react";

import { formatCurrency } from "../../../../../utils/formatCurrency";

import styles from "./ExpenseTable.module.css";

function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã Khoản Chi</th>
            <th>Ngày</th>
            <th>Hạng Mục Chi</th>
            <th>Người Chi (Phê Duyệt)</th>
            <th>Số Tiền</th>
            <th>Ghi Chú</th>
            <th className={styles.actionsColumn}>Thao Tác</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>
                Chưa có khoản chi nào phù hợp với bộ lọc.
              </td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td className={styles.id}>{expense.id}</td>

                <td>{expense.date}</td>

                <td className={styles.category}>{expense.category}</td>

                <td>{expense.spender}</td>

                <td className={styles.amount}>
                  -{formatCurrency(expense.amount)}
                </td>

                <td className={styles.note} title={expense.note}>
                  {expense.note || "Không có ghi chú"}
                </td>

                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      title="Sửa khoản chi"
                      className={styles.editButton}
                      onClick={() => onEdit(expense)}
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      title="Xóa khoản chi"
                      className={styles.deleteButton}
                      onClick={() => onDelete(expense)}
                    >
                      <Trash2 size={15} />
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

export default ExpenseTable;
