import { useEffect, useMemo, useState } from "react";

import AddButton from "../../../components/common/AddButton";

import { toast } from "react-toastify";

import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import StaffCard from "../../../features/admin/components/staff/StaffCard/StaffCard";

import StaffFormModal from "../../../features/admin/components/staff/StaffFormModal/StaffFormModal";

import styles from "./Staff.module.css";

import SearchInput from "../../../components/common/SearchInput/SearchInput";

import staffService from "../../../features/admin/services/staffService";

function Staff() {
  const EMPTY_STAFF_FORM = {
    fullName: "",
    username: "",
    password: "",
    phone: "",
    roles: ["waiter"],
  };

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  // Thêm state cho bộ lọc trạng thái
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [staffForm, setStaffForm] = useState(EMPTY_STAFF_FORM);

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const response = await staffService.getAll();

      setStaffList(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
          error.response?.data?.message || "Không thể tải danh sách nhân viên.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // =========================
  // ADD STAFF
  // =========================

  const handleOpenAdd = () => {
    setEditingStaff(null);

    setStaffForm({
      ...EMPTY_STAFF_FORM,
    });

    setIsModalOpen(true);
  };

  // =========================
  // EDIT STAFF
  // =========================

  const normalizeRoles = (roles = []) => {
    return roles.map((role) => role.replace("ROLE_", "").toLowerCase());
  };

  const handleOpenEdit = (staff) => {
    setEditingStaff(staff);

    setStaffForm({
      fullName: staff.fullName,
      username: staff.username,
      password: "",
      phone: staff.phone || "",
      roles: normalizeRoles(staff.roles),
    });

    setIsModalOpen(true);
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = async (event) => {
    event.preventDefault();

    const fullName = staffForm.fullName.trim();
    const username = staffForm.username.trim();
    const phone = staffForm.phone.trim();
    const password = staffForm.password.trim();

    if (!fullName) {
      toast.error("Vui lòng nhập họ tên nhân viên.");
      return;
    }

    if (!username) {
      toast.error("Vui lòng nhập tên đăng nhập.");
      return;
    }

    if (!editingStaff && !password) {
      toast.error("Vui lòng nhập mật khẩu.");
      return;
    }

    if (!staffForm.roles || staffForm.roles.length === 0) {
      toast.error("Vui lòng chọn ít nhất một vai trò cho nhân viên.");

      return;
    }

    const payload = {
      fullName,
      username,
      phone,
      roles: staffForm.roles,
    };

    if (!editingStaff || password) {
      payload.password = password;
    }

    try {
      if (editingStaff) {
        const response = await staffService.update(editingStaff.id, payload);

        const updatedStaff = response.data;

        setStaffList((currentStaff) =>
            currentStaff.map((staff) =>
                staff.id === editingStaff.id ? updatedStaff : staff,
            ),
        );

        toast.success("Cập nhật nhân viên thành công!");
      } else {
        const response = await staffService.create(payload);

        const newStaff = response.data;

        setStaffList((currentStaff) => [...currentStaff, newStaff]);

        toast.success("Thêm nhân viên thành công!");
      }

      setIsModalOpen(false);
      setEditingStaff(null);
      setStaffForm(EMPTY_STAFF_FORM);
    } catch (error) {
      console.error(error);

      toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi lưu nhân viên.",
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (staff) => {
    const confirmed = window.confirm(
        `Xác nhận vô hiệu hóa nhân viên "${staff.fullName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await staffService.deactivate(staff.id);

      setStaffList((currentStaff) =>
          currentStaff.map((item) =>
              item.id === staff.id
                  ? {
                    ...item,
                    status: "INACTIVE",
                  }
                  : item,
          ),
      );

      toast.success(`Đã vô hiệu hóa nhân viên ${staff.fullName}.`);
    } catch (error) {
      console.error(error);

      toast.error(
          error.response?.data?.message || "Không thể vô hiệu hóa nhân viên.",
      );
    }
  };

  const handleRestore = async (staff) => {
    const confirmed = window.confirm(
        `Khôi phục nhân viên "${staff.fullName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await staffService.restore(staff.id);

      const restoredStaff = response.data;

      setStaffList((currentStaff) =>
          currentStaff.map((item) =>
              item.id === staff.id ? restoredStaff : item,
          ),
      );

      toast.success(`Đã khôi phục nhân viên ${staff.fullName}.`);
    } catch (error) {
      console.error(error);

      toast.error(
          error.response?.data?.message || "Không thể khôi phục nhân viên.",
      );
    }
  };

  // Cập nhật useMemo để xử lý cả từ khóa tìm kiếm và bộ lọc trạng thái
  const filteredStaff = useMemo(() => {
    let result = staffList;

    // 1. Lọc theo trạng thái trước
    if (statusFilter !== "ALL") {
      result = result.filter((staff) => staff.status === statusFilter);
    }

    // 2. Lọc theo từ khóa tìm kiếm
    const keyword = searchQuery.trim().toLowerCase();

    if (keyword) {
      result = result.filter((staff) => {
        return (
            String(staff.id).toLowerCase().includes(keyword) ||
            staff.fullName?.toLowerCase().includes(keyword) ||
            staff.username?.toLowerCase().includes(keyword) ||
            staff.phone?.toLowerCase().includes(keyword) ||
            staff.roles?.join(" ").toLowerCase().includes(keyword) ||
            staff.status?.toLowerCase().includes(keyword)
        );
      });
    }

    return result;
  }, [staffList, searchQuery, statusFilter]);

  return (
      <div className={styles.page}>
        {/* =======================
          GLOBAL ADMIN HEADER
      ======================= */}

        <AdminPageHeader title="Quản Lý Nhân Viên" />

        {/* =======================
          STAFF MANAGEMENT
      ======================= */}

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Quản Lý Nhân Viên & Phân Quyền</h2>

              <p>Quản lý tài khoản, thông tin và quyền truy cập của nhân viên</p>
            </div>

            <AddButton onClick={handleOpenAdd}>Thêm Nhân Viên</AddButton>
          </div>

          {/* Cập nhật thanh công cụ để chứa Select giống OrderFilters */}
          <div className={styles.toolbar}>
            <div className={styles.filterGroup}>
              <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Tìm tên, mã NV, vai trò, SĐT..."
                  className={styles.searchInput}
              />

              <select
                  className={styles.filterSelect}
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
            </div>

            <div className={styles.result}>
              Hiển thị <strong>{filteredStaff.length}</strong>
              {" / "}
              <strong>{staffList.length}</strong>
              {" nhân viên"}
            </div>
          </div>

          {/* STAFF CARDS */}

          {loading ? (
              <div className={styles.emptyState}>
                Đang tải danh sách nhân viên...
              </div>
          ) : filteredStaff.length === 0 ? (
              <div className={styles.emptyState}>
                Không tìm thấy nhân viên phù hợp.
              </div>
          ) : (
              <div className={styles.grid}>
                {filteredStaff.map((staff) => (
                    <StaffCard
                        key={staff.id}
                        staff={staff}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                    />
                ))}
              </div>
          )}
        </section>

        {/* =======================
          ADD / EDIT MODAL
      ======================= */}

        <StaffFormModal
            open={isModalOpen}
            editingStaff={editingStaff}
            form={staffForm}
            onChange={setStaffForm}
            onClose={() => {
              setIsModalOpen(false);
              setEditingStaff(null);
            }}
            onSubmit={handleSave}
        />
      </div>
  );
}

export default Staff;