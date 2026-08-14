import { useMemo, useState } from "react";

import { Plus } from "lucide-react";
import AddButton from "../../../components/common/AddButton";

import { toast } from "react-toastify";

import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import TableCard from "../../../features/admin/components/tables/TableCard/TableCard";

import TableFormModal from "../../../features/admin/components/tables/TableFormModal/TableFormModal";
import SearchInput from "../../../components/common/SearchInput/SearchInput";
import {
  EMPTY_TABLE_FORM,
  INITIAL_TABLES,
} from "../../../data/adminTablesMock";

import { TABLE_AREA, TABLE_STATUS } from "../../../constants/tableConfig";

import styles from "./Tables.module.css";

function Tables() {
  const [searchQuery, setSearchQuery] = useState("");
  // =========================
  // DATA
  // =========================

  const [tables, setTables] = useState(INITIAL_TABLES);

  // =========================
  // FILTER
  // =========================

  const [areaFilter, setAreaFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // MODAL
  // =========================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingTable, setEditingTable] = useState(null);

  const [tableForm, setTableForm] = useState(EMPTY_TABLE_FORM);

  // =========================
  // STATISTICS
  // =========================

  const occupiedCount = tables.filter(
    (table) => table.status === TABLE_STATUS.OCCUPIED,
  ).length;

  const emptyCount = tables.filter(
    (table) => table.status === TABLE_STATUS.EMPTY,
  ).length;

  // =========================
  // FILTER DATA
  // =========================

  const filteredTables = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return tables.filter((table) => {
      const matchesArea = areaFilter === "all" || table.area === areaFilter;

      const matchesStatus =
        statusFilter === "all" || table.status === statusFilter;

      const displayCode =
        table.area === TABLE_AREA.OUTDOOR
          ? `N-${table.number}`
          : `T-${table.number}`;

      const areaLabel =
        table.area === TABLE_AREA.OUTDOOR ? "ngoài trời" : "trong nhà";

      const matchesSearch =
        !keyword ||
        displayCode.toLowerCase().includes(keyword) ||
        table.id.toLowerCase().includes(keyword) ||
        table.number.toLowerCase().includes(keyword) ||
        areaLabel.includes(keyword);

      return matchesArea && matchesStatus && matchesSearch;
    });
  }, [tables, areaFilter, statusFilter, searchQuery]);

  // =========================
  // ADD
  // =========================

  const handleOpenAdd = () => {
    setEditingTable(null);

    /*
      Tìm số bàn tiếp theo.
    */

    const nextNumber = String(tables.length + 1).padStart(2, "0");

    setTableForm({
      number: nextNumber,
      area: TABLE_AREA.INDOOR,
    });

    setIsModalOpen(true);
  };

  // =========================
  // EDIT
  // =========================

  const handleOpenEdit = (table) => {
    setEditingTable(table);

    setTableForm({
      number: table.number,
      area: table.area,
    });

    setIsModalOpen(true);
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = (event) => {
    event.preventDefault();

    const number = tableForm.number.trim();

    if (!number) {
      toast.error("Vui lòng nhập số bàn.");

      return;
    }

    /*
      Kiểm tra trùng bàn.

      Ví dụ:
      indoor + 01
      không được có 2 lần.
    */

    const duplicated = tables.some(
      (table) =>
        table.number === number &&
        table.area === tableForm.area &&
        table.id !== editingTable?.id,
    );

    if (duplicated) {
      toast.error("Số bàn này đã tồn tại trong khu vực.");

      return;
    }

    // =========================
    // UPDATE
    // =========================

    if (editingTable) {
      setTables((currentTables) =>
        currentTables.map((table) =>
          table.id === editingTable.id
            ? {
                ...table,

                number,
                area: tableForm.area,
              }
            : table,
        ),
      );

      toast.success("Cập nhật bàn ăn thành công!");
    }

    // =========================
    // ADD
    // =========================
    else {
      const prefix = tableForm.area === TABLE_AREA.OUTDOOR ? "N" : "T";

      /*
        Tạo ID tạm thời.
      */

      let newId = `${prefix}${number}`;

      /*
        Trường hợp ID đã tồn tại
        thì thêm timestamp tạm.
      */

      if (tables.some((table) => table.id === newId)) {
        newId = `${prefix}${Date.now()}`;
      }

      const newTable = {
        id: newId,

        number,

        area: tableForm.area,

        status: TABLE_STATUS.EMPTY,

        guestCount: 0,

        itemCount: 0,

        currentOrderId: null,

        currentTotal: 0,
      };

      setTables((currentTables) => [...currentTables, newTable]);

      toast.success("Thêm bàn ăn thành công!");
    }

    setIsModalOpen(false);

    setEditingTable(null);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (table) => {
    /*
      Không nên cho xóa bàn
      đang có khách.
    */

    if (table.status === TABLE_STATUS.OCCUPIED) {
      toast.error("Không thể xóa bàn đang có khách.");

      return;
    }

    const displayName =
      table.area === TABLE_AREA.OUTDOOR
        ? `N-${table.number}`
        : `T-${table.number}`;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa bàn ${displayName}?`,
    );

    if (!confirmed) {
      return;
    }

    setTables((currentTables) =>
      currentTables.filter((item) => item.id !== table.id),
    );

    toast.success(`Đã xóa bàn ${displayName}.`);
  };

  return (
    <div className={styles.page}>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <AdminPageHeader title="Quản Lý Sơ Đồ Bàn Ăn" />

      {/* =========================
          TABLE MANAGEMENT
      ========================= */}

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Quản Lý Sơ Đồ Bàn Ăn & Khu Vực</h2>

            <p>Thêm bàn mới, thay đổi vị trí Trong nhà / Ngoài trời</p>
          </div>

          <AddButton onClick={handleOpenAdd}>Thêm Bàn Ăn Mới</AddButton>
        </div>

        {/* =========================
            SUMMARY + FILTER
        ========================= */}

        <div className={styles.controlBar}>
          <div className={styles.summary}>
            <div>
              <span>Tổng số bàn</span>

              <strong>{tables.length}</strong>
            </div>

            <div className={styles.occupiedSummary}>
              <span>Có khách</span>

              <strong>{occupiedCount}</strong>
            </div>

            <div className={styles.emptySummary}>
              <span>Bàn trống</span>

              <strong>{emptyCount}</strong>
            </div>
          </div>

          <div className={styles.filters}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm theo mã bàn..."
              className={styles.searchInput}
            />

            <select
              value={areaFilter}
              onChange={(event) => setAreaFilter(event.target.value)}
            >
              <option value="all">Tất cả khu vực</option>

              <option value={TABLE_AREA.INDOOR}>Trong nhà</option>

              <option value={TABLE_AREA.OUTDOOR}>Ngoài trời</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>

              <option value={TABLE_STATUS.OCCUPIED}>Đang có khách</option>

              <option value={TABLE_STATUS.EMPTY}>Bàn trống</option>

              <option value={TABLE_STATUS.RESERVED}>Đã đặt trước</option>
            </select>
          </div>
        </div>

        {/* =========================
            TABLE GRID
        ========================= */}

        {filteredTables.length === 0 ? (
          <div className={styles.emptyState}>
            Không có bàn nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      <TableFormModal
        open={isModalOpen}
        editingTable={editingTable}
        form={tableForm}
        onChange={setTableForm}
        onClose={() => {
          setIsModalOpen(false);

          setEditingTable(null);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}

export default Tables;
