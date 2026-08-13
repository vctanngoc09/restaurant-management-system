import { useMemo, useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import MenuFilters from "../../../features/admin/components/menu/MenuFilters/MenuFilters";

import MenuTable from "../../../features/admin/components/menu/MenuTable/MenuTable";

import MenuFormModal from "../../../features/admin/components/menu/MenuFormModal/MenuFormModal";

import {
  EMPTY_MENU_FORM,
  INITIAL_MENU_ITEMS,
} from "../../../data/adminMenuMock";

import styles from "./Menu.module.css";

function Menu() {
  // =============================
  // DATA
  // =============================

  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);

  // =============================
  // FILTER
  // =============================

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");

  // =============================
  // MODAL
  // =============================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [menuForm, setMenuForm] = useState(EMPTY_MENU_FORM);

  // =============================
  // FILTER MENU
  // =============================

  const filteredMenuItems = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // =============================
  // ADD
  // =============================

  const handleOpenAdd = () => {
    setEditingItem(null);

    setMenuForm({
      ...EMPTY_MENU_FORM,
    });

    setIsModalOpen(true);
  };

  // =============================
  // EDIT
  // =============================

  const handleOpenEdit = (item) => {
    setEditingItem(item);

    setMenuForm({
      name: item.name,
      category: item.category,
      price: item.price,
      status: item.status,
      image: item.image || "",
      description: item.description || "",
    });

    setIsModalOpen(true);
  };

  // =============================
  // SAVE
  // =============================

  const handleSave = (event) => {
    event.preventDefault();

    const name = menuForm.name.trim();

    const price = Number(menuForm.price);

    if (!name) {
      toast.error("Vui lòng nhập tên món ăn.");

      return;
    }

    if (price <= 0) {
      toast.error("Đơn giá phải lớn hơn 0.");

      return;
    }

    if (editingItem) {
      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,

                ...menuForm,

                name,
                price,
              }
            : item,
        ),
      );

      toast.success("Cập nhật món ăn thành công!");
    } else {
      const maxId = menuItems.reduce((max, item) => {
        const number = Number(item.id.replace(/\D/g, "")) || 0;

        return Math.max(max, number);
      }, 0);

      const newItem = {
        id: `M${String(maxId + 1).padStart(2, "0")}`,

        ...menuForm,

        name,
        price,
      };

      setMenuItems((currentItems) => [...currentItems, newItem]);

      toast.success("Thêm món ăn thành công!");
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  // =============================
  // DELETE
  // =============================

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa món "${item.name}" không?`,
    );

    if (!confirmed) {
      return;
    }

    setMenuItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem.id !== item.id),
    );

    toast.success(`Đã xóa món ${item.name}.`);
  };

  return (
    <div className={styles.page}>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <AdminPageHeader title="Quản Lý Thực Đơn & Kho Món" />

      {/* =========================
          MENU MANAGEMENT
      ========================= */}

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Quản Lý Danh Sách Thực Đơn</h2>

            <p>Thêm, sửa, xóa món ăn, chỉnh sửa giá bán & hình ảnh</p>
          </div>

          <button
            type="button"
            className={styles.addButton}
            onClick={handleOpenAdd}
          >
            <Plus size={17} />

            <span>Thêm Món Mới</span>
          </button>
        </div>

        <MenuFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className={styles.result}>
          Hiển thị <strong>{filteredMenuItems.length}</strong> /{" "}
          {menuItems.length} món
        </div>

        <MenuTable
          menuItems={filteredMenuItems}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </section>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      <MenuFormModal
        open={isModalOpen}
        editingItem={editingItem}
        form={menuForm}
        onChange={setMenuForm}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}

export default Menu;
