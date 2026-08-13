import { useMemo, useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import ExpenseSummary from "../../../features/admin/components/expenses/ExpenseSummary/ExpenseSummary";

import ExpenseFilters from "../../../features/admin/components/expenses/ExpenseFilters/ExpenseFilters";

import ExpenseTable from "../../../features/admin/components/expenses/ExpenseTable/ExpenseTable";

import ExpenseFormModal from "../../../features/admin/components/expenses/ExpenseFormModal/ExpenseFormModal";

import {
  EMPTY_EXPENSE_FORM,
  EXPENSE_CATEGORIES,
  EXPENSE_TOTAL_REVENUE,
  INITIAL_EXPENSES,
} from "../../../data/adminExpensesMock";

import styles from "./Expenses.module.css";

function Expenses() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [editingExpense, setEditingExpense] = useState(null);

  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE_FORM);

  // ==============================
  // TOTAL
  // ==============================

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  // ==============================
  // FILTER
  // ==============================

  const filteredExpenses = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return expenses.filter((expense) => {
      const matchesCategory =
        selectedCategory === "all" || expense.category === selectedCategory;

      const matchesSearch =
        !keyword ||
        expense.category.toLowerCase().includes(keyword) ||
        expense.spender.toLowerCase().includes(keyword) ||
        expense.note.toLowerCase().includes(keyword) ||
        expense.date.includes(keyword) ||
        expense.id.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [expenses, searchQuery, selectedCategory]);

  // ==============================
  // ADD
  // ==============================

  const handleOpenAdd = () => {
    setEditingExpense(null);

    setExpenseForm({
      ...EMPTY_EXPENSE_FORM,
    });

    setIsExpenseModalOpen(true);
  };

  // ==============================
  // EDIT
  // ==============================

  const handleOpenEdit = (expense) => {
    setEditingExpense(expense);

    setExpenseForm({
      date: expense.date,
      category: expense.category,
      spender: expense.spender,
      amount: expense.amount,
      note: expense.note,
    });

    setIsExpenseModalOpen(true);
  };

  // ==============================
  // SAVE
  // ==============================

  const handleSave = (event) => {
    event.preventDefault();

    if (!expenseForm.spender.trim()) {
      toast.error("Vui lòng nhập người chi / phê duyệt.");

      return;
    }

    if (Number(expenseForm.amount) <= 0) {
      toast.error("Số tiền phải lớn hơn 0.");

      return;
    }

    if (editingExpense) {
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === editingExpense.id
            ? {
                ...expense,
                ...expenseForm,
              }
            : expense,
        ),
      );

      toast.success("Cập nhật khoản chi thành công!");
    } else {
      const nextNumber = expenses.length + 1;

      const newExpense = {
        id: `EXP${String(nextNumber).padStart(2, "0")}`,

        ...expenseForm,

        amount: Number(expenseForm.amount),
      };

      setExpenses((current) => [...current, newExpense]);

      toast.success("Thêm khoản chi thành công!");
    }

    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = (expense) => {
    const confirmed = window.confirm(
      `Xác nhận xóa khoản chi [${expense.category}]?`,
    );

    if (!confirmed) {
      return;
    }

    setExpenses((current) => current.filter((item) => item.id !== expense.id));

    toast.success("Đã xóa khoản chi.");
  };

  return (
    <div className={styles.page}>
      <AdminPageHeader title="Quản Lý Chi Phí Hoạt Động (Expenses)" />

      <ExpenseSummary
        totalRevenue={EXPENSE_TOTAL_REVENUE}
        totalExpenses={totalExpenses}
        expenseCount={expenses.length}
      />

      <section className={styles.ledger}>
        <div className={styles.ledgerHeader}>
          <div>
            <h2>Sổ Sách Quản Lý Khoản Chi</h2>

            <p>
              Theo dõi chi tiết chi phí nhập hàng, điện nước, lương nhân viên &
              bảo trì
            </p>
          </div>

          <button
            type="button"
            className={styles.addButton}
            onClick={handleOpenAdd}
          >
            <Plus size={17} />

            <span>Thêm Khoản Chi</span>
          </button>
        </div>

        <ExpenseFilters
          categories={EXPENSE_CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </section>

      <ExpenseFormModal
        open={isExpenseModalOpen}
        editingExpense={editingExpense}
        form={expenseForm}
        onChange={setExpenseForm}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}

export default Expenses;