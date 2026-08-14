import {
  ActionButton,
  ActionGroup,
} from "../../../../../components/common/ActionButton";

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
                  <ActionGroup>
                    <ActionButton
                        action="edit"
                        title="Sửa khoản chi"
                        onClick={() => onEdit(expense)}
                    />

                    <ActionButton
                        action="delete"
                        title="Xóa khoản chi"
                        onClick={() => onDelete(expense)}
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

export default ExpenseTable;
