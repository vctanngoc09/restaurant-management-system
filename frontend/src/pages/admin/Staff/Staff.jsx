import { useState, useMemo } from "react";

import AddButton from "../../../components/common/AddButton";

import { toast } from "react-toastify";

import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import StaffCard from "../../../features/admin/components/staff/StaffCard/StaffCard";

import StaffFormModal from "../../../features/admin/components/staff/StaffFormModal/StaffFormModal";

import { EMPTY_STAFF_FORM, INITIAL_STAFF } from "../../../data/adminStaffMock";

import styles from "./Staff.module.css";

import SearchInput from "../../../components/common/SearchInput/SearchInput"; 
function Staff() {
  // =========================
  // STAFF DATA
  // =========================

  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState("");
  // =========================
  // MODAL
  // =========================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingStaff, setEditingStaff] = useState(null);

  const [staffForm, setStaffForm] = useState(EMPTY_STAFF_FORM);

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

  const handleOpenEdit = (staff) => {
    setEditingStaff(staff);

    setStaffForm({
      name: staff.name,
      role: staff.role,
      pin: staff.pin,
      shift: staff.shift || "",
      phone: staff.phone || "",
    });

    setIsModalOpen(true);
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = (event) => {
    event.preventDefault();

    const name = staffForm.name.trim();

    const pin = staffForm.pin.trim();

    if (!name) {
      toast.error("Vui lòng nhập họ tên nhân viên.");

      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      toast.error("Mã PIN phải gồm đúng 4 chữ số.");

      return;
    }

    /*
      Nếu chỉnh sửa
    */
    if (editingStaff) {
      setStaffList((currentStaff) =>
        currentStaff.map((staff) =>
          staff.id === editingStaff.id
            ? {
                ...staff,
                ...staffForm,
                name,
                pin,
              }
            : staff,
        ),
      );

      toast.success("Cập nhật nhân viên thành công!");
    } else {
      /*
        Tìm ID lớn nhất.
        ST01 → 1
        ST02 → 2
      */

      const maxId = staffList.reduce((max, staff) => {
        const number = Number(staff.id.replace(/\D/g, "")) || 0;

        return Math.max(max, number);
      }, 0);

      const newStaff = {
        id: `ST${String(maxId + 1).padStart(2, "0")}`,

        ...staffForm,

        name,
        pin,

        status: "active",
      };

      setStaffList((currentStaff) => [...currentStaff, newStaff]);

      toast.success("Thêm nhân viên thành công!");
    }

    setIsModalOpen(false);

    setEditingStaff(null);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (staff) => {
    const confirmed = window.confirm(
      `Xác nhận xóa nhân viên "${staff.name}" (${staff.id})?`,
    );

    if (!confirmed) {
      return;
    }

    setStaffList((currentStaff) =>
      currentStaff.filter((item) => item.id !== staff.id),
    );

    toast.success(`Đã xóa nhân viên ${staff.name}.`);
  };

  const filteredStaff = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return staffList;
    }

    return staffList.filter((staff) => {
      return (
        staff.id.toLowerCase().includes(keyword) ||
        staff.name.toLowerCase().includes(keyword) ||
        staff.role.toLowerCase().includes(keyword) ||
        staff.phone?.toLowerCase().includes(keyword) ||
        staff.shift?.toLowerCase().includes(keyword)
      );
    });
  }, [staffList, searchQuery]);

  return (
    <div className={styles.page}>
      {/* =======================
          GLOBAL ADMIN HEADER
      ======================= */}

      <AdminPageHeader title="Quản Lý Nhân Viên & Mã PIN" />

      {/* =======================
          STAFF MANAGEMENT
      ======================= */}

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Quản Lý Nhân Viên & Phân Quyền</h2>

            <p>Quản lý tài khoản, mã PIN đăng nhập & ca trực của nhân viên</p>
          </div>

          <AddButton onClick={handleOpenAdd}>Thêm Nhân Viên</AddButton>
        </div>

        <div className={styles.toolbar}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm tên, mã NV, vai trò, SĐT..."
            className={styles.searchInput}
          />

          <div className={styles.result}>
            Hiển thị <strong>{filteredStaff.length}</strong>
            {" / "}
            <strong>{staffList.length}</strong>
            {" nhân viên"}
          </div>
        </div>

        {/* STAFF CARDS */}

        {filteredStaff.length === 0 ? (
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
