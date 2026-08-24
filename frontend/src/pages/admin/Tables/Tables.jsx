import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import AddButton from "../../../components/common/AddButton";

import SearchInput from "../../../components/common/SearchInput/SearchInput";

import Pagination from "../../../components/common/Pagination/Pagination";

import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import TableCard from "../../../features/admin/components/tables/TableCard/TableCard";

import TableFormModal from "../../../features/admin/components/tables/TableFormModal/TableFormModal";

import ManageAreasButton from "../../../features/admin/components/areas/ManageAreasButton/ManageAreasButton";

import AreaManagementModal from "../../../features/admin/components/areas/AreaManagementModal/AreaManagementModal";

import tableService from "../../../features/admin/services/tableService";

import areaService from "../../../features/admin/services/areaService";

import usePagination from "../../../hooks/usePagination";

import styles from "./Tables.module.css";

// =========================
// EMPTY FORM
// =========================

const EMPTY_TABLE_FORM = {
  number: "",
  areaId: "",
};

function Tables() {
  // =========================
  // DATA
  // =========================

  const [tables, setTables] = useState([]);

  const [areas, setAreas] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // SEARCH + FILTER
  // =========================

  const [searchQuery, setSearchQuery] = useState("");

  const [areaFilter, setAreaFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // MODAL
  // =========================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingTable, setEditingTable] = useState(null);

  const [tableForm, setTableForm] = useState(EMPTY_TABLE_FORM);

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

  // =========================
  // PAGINATION
  // =========================

  const {
    page,
    size,

    totalElements,
    totalPages,

    hasNext,
    hasPrevious,

    setPage,
    updatePagination,
  } = usePagination({
    initialPage: 0,
    initialSize: 8,
  });

  // =========================
  // FETCH TABLES
  // =========================

  const fetchTables = useCallback(async () => {
    try {
      const response = await tableService.getAll({
        page,
        size,

        keyword: searchQuery.trim() || undefined,

        areaId: areaFilter === "all" ? undefined : Number(areaFilter),

        status: statusFilter === "all" ? undefined : statusFilter,
      });

      const pageData = response.data;

      setTables(pageData?.content || []);

      updatePagination(pageData);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Không thể tải danh sách bàn.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, size, searchQuery, areaFilter, statusFilter, updatePagination]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // =========================
  // FETCH AREAS
  // =========================

  const fetchAreas = useCallback(async () => {
    try {
      const response = await areaService.getAll();

      setAreas(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Không thể tải danh sách khu vực.",
      );
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  // =========================
  // STATISTICS CURRENT PAGE
  // =========================

  const occupiedCount = tables.filter(
    (table) => table.status === "OCCUPIED",
  ).length;

  const availableCount = tables.filter(
    (table) => table.status === "AVAILABLE",
  ).length;

  // =========================
  // OPEN CREATE
  // =========================

  const handleOpenAdd = () => {
    setEditingTable(null);

    setTableForm({
      number: "",

      areaId: areas[0]?.id ? String(areas[0].id) : "",
    });

    setIsModalOpen(true);
  };

  // =========================
  // OPEN EDIT
  // =========================

  const handleOpenEdit = (table) => {
    setEditingTable(table);

    const number = table.tableNumber?.replace(/\D/g, "") || "";

    setTableForm({
      number,

      areaId: String(table.areaId || ""),
    });

    setIsModalOpen(true);
  };

  // =========================
  // SAVE CREATE / UPDATE
  // =========================

  const handleSave = async (event) => {
    event.preventDefault();

    const number = tableForm.number.trim();

    // =========================
    // VALIDATE
    // =========================

    if (!number) {
      toast.error("Vui lòng nhập số bàn.");

      return;
    }

    if (!tableForm.areaId) {
      toast.error("Vui lòng chọn khu vực.");

      return;
    }

    // =========================
    // FIND AREA
    // =========================

    const selectedArea = areas.find(
      (area) => String(area.id) === String(tableForm.areaId),
    );

    if (!selectedArea) {
      toast.error("Khu vực không hợp lệ.");

      return;
    }

    // =========================
    // BUILD TABLE NUMBER
    // =========================

    const isOutdoor = selectedArea.name?.toLowerCase().includes("ngoài");

    const prefix = isOutdoor ? "N" : "T";

    const normalizedNumber = number.padStart(2, "0");

    const tableNumber = `${prefix}-${normalizedNumber}`;

    // =========================
    // PAYLOAD
    // =========================

    const payload = {
      tableNumber,
      areaId: Number(tableForm.areaId),
    };

    try {
      // =========================
      // UPDATE
      // =========================

      if (editingTable) {
        const response = await tableService.update(editingTable.id, payload);

        const updatedTable = response.data;

        /*
          Update local trước để UI
          đổi ngay lập tức.
        */

        setTables((currentTables) =>
          currentTables.map((table) =>
            table.id === editingTable.id ? updatedTable : table,
          ),
        );

        toast.success(`Cập nhật bàn ${tableNumber} thành công!`);

        /*
          Đồng bộ lại pagination
          + dữ liệu backend.
        */

        await fetchTables();
      }

      // =========================
      // CREATE
      // =========================
      else {
        await tableService.create(payload);

        toast.success(`Thêm bàn ${tableNumber} thành công!`);

        /*
          Backend sort ID DESC nên
          bàn mới nằm ở page đầu.
        */

        if (page === 0) {
          await fetchTables();
        } else {
          setPage(0);
        }
      }

      // =========================
      // CLOSE MODAL
      // =========================

      setIsModalOpen(false);

      setEditingTable(null);

      setTableForm(EMPTY_TABLE_FORM);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          (editingTable ? "Không thể cập nhật bàn." : "Không thể thêm bàn."),
      );
    }
  };

  // =========================
  // SOFT DELETE
  // =========================

  const handleDelete = async (table) => {
    // Không cho xóa bàn có khách
    if (table.status === "OCCUPIED") {
      toast.error("Không thể ngừng hoạt động bàn đang có khách.");

      return;
    }

    // Đã inactive rồi
    if (table.status === "INACTIVE") {
      toast.error("Bàn này đã ngừng hoạt động.");

      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn ngừng hoạt động bàn ${table.tableNumber}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await tableService.deactivate(table.id);

      /*
        Backend là soft delete.

        Không remove card khỏi array.
        Chỉ đổi status -> INACTIVE.
      */

      setTables((currentTables) =>
        currentTables.map((item) =>
          item.id === table.id
            ? {
                ...item,
                status: "INACTIVE",
              }
            : item,
        ),
      );

      toast.success(`Đã ngừng hoạt động bàn ${table.tableNumber}.`);

      // Sync lại backend
      await fetchTables();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Không thể ngừng hoạt động bàn.",
      );
    }
  };

  // =========================
  // RESTORE
  // =========================

  const handleRestore = async (table) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn khôi phục bàn ${table.tableNumber}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await tableService.restore(table.id);

      const restoredTable = response.data;

      /*
            Backend trả TableResponse mới
            với AVAILABLE.
          */

      setTables((currentTables) =>
        currentTables.map((item) =>
          item.id === table.id ? restoredTable : item,
        ),
      );

      toast.success(`Khôi phục bàn ${table.tableNumber} thành công!`);

      await fetchTables();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Không thể khôi phục bàn.");
    }
  };

  // =========================
  // SEARCH CHANGE
  // =========================

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    /*
      Khi search phải về page đầu.
    */

    setPage(0);
  };

  // =========================
  // AREA FILTER CHANGE
  // =========================

  const handleAreaFilterChange = (event) => {
    setAreaFilter(event.target.value);

    setPage(0);
  };

  // =========================
  // STATUS FILTER CHANGE
  // =========================

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);

    setPage(0);
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
        {/* HEADER */}

        <div className={styles.panelHeader}>
          <div>
            <h2>Quản Lý Sơ Đồ Bàn Ăn & Khu Vực</h2>

            <p>Thêm bàn mới, thay đổi vị trí và trạng thái hoạt động</p>
          </div>

          <div className={styles.areaButton}>
            <ManageAreasButton onClick={() => setIsAreaModalOpen(true)} />

            <AddButton onClick={handleOpenAdd}>Thêm Bàn Ăn Mới</AddButton>
          </div>
        </div>

        {/* =========================
            SUMMARY + FILTER
        ========================= */}

        <div className={styles.controlBar}>
          {/* SUMMARY */}

          <div className={styles.summary}>
            <div>
              <span>Tổng số bàn</span>

              <strong>{totalElements}</strong>
            </div>

            <div className={styles.occupiedSummary}>
              <span>Có khách</span>

              <strong>{occupiedCount}</strong>
            </div>

            <div className={styles.emptySummary}>
              <span>Bàn trống</span>

              <strong>{availableCount}</strong>
            </div>
          </div>

          {/* FILTER */}

          <div className={styles.filters}>
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm theo mã bàn..."
              className={styles.searchInput}
            />

            {/* AREA */}

            <select value={areaFilter} onChange={handleAreaFilterChange}>
              <option value="all">Tất cả khu vực</option>

              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>

            {/* STATUS */}

            <select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="all">Tất cả trạng thái</option>

              <option value="AVAILABLE">Bàn trống</option>

              <option value="OCCUPIED">Đang có khách</option>

              <option value="MAINTENANCE">Đang bảo trì</option>

              <option value="INACTIVE">Ngừng hoạt động</option>
            </select>
          </div>
        </div>

        {/* =========================
            TABLE GRID
        ========================= */}

        {loading ? (
          <div className={styles.emptyState}>Đang tải danh sách bàn...</div>
        ) : tables.length === 0 ? (
          <div className={styles.emptyState}>Không có bàn nào phù hợp.</div>
        ) : (
          <>
            <div className={styles.grid}>
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onRestore={handleRestore}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      <TableFormModal
        open={isModalOpen}
        editingTable={editingTable}
        form={tableForm}
        areas={areas}
        onChange={setTableForm}
        onClose={() => {
          setIsModalOpen(false);

          setEditingTable(null);

          setTableForm(EMPTY_TABLE_FORM);
        }}
        onSubmit={handleSave}
      />

      <AreaManagementModal
        open={isAreaModalOpen}
        areas={areas}
        onClose={() => setIsAreaModalOpen(false)}
        onChanged={fetchAreas}
      />
    </div>
  );
}

export default Tables;
