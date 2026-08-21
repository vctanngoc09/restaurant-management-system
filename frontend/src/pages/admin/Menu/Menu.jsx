import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import AddButton from "../../../components/common/AddButton";

import Pagination from "../../../components/common/Pagination/Pagination";

import AdminPageHeader from "../../../features/admin/components/common/AdminPageHeader/AdminPageHeader";

import MenuTable from "../../../features/admin/components/menu/MenuTable/MenuTable";

import MenuFormModal from "../../../features/admin/components/menu/MenuFormModal/MenuFormModal";

import ManageCategoriesButton from "../../../features/admin/components/categories/ManageCategoriesButton/ManageCategoriesButton";

import CategoryManagementModal from "../../../features/admin/components/categories/CategoryManagementModal/CategoryManagementModal";

import productService from "../../../features/admin/services/productService";

import categoryService from "../../../features/admin/services/categoryService";

import usePagination from "../../../hooks/usePagination";

import styles from "./Menu.module.css";

// =============================
// EMPTY FORM
// =============================

const EMPTY_MENU_FORM = {
  name: "",

  categoryId: "",

  price: "",

  urlImg: "",
};

function Menu() {
  // =============================
  // PRODUCT DATA
  // =============================

  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);

  // =============================
  // CATEGORY DATA
  // =============================

  const [categories, setCategories] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // =============================
  // PAGINATION
  // =============================

  const {
    page,

    size,

    totalPages,

    hasNext,

    hasPrevious,

    setPage,

    updatePagination,
  } = usePagination({
    initialPage: 0,

    initialSize: 8,
  });

  // =============================
  // MODAL
  // =============================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [menuForm, setMenuForm] = useState(EMPTY_MENU_FORM);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // =============================
  // FETCH CATEGORIES
  // =============================

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);

      const response = await categoryService.getAll();

      setCategories(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Không thể tải danh sách danh mục.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // =============================
  // FETCH PRODUCTS
  // =============================

  const fetchProducts = useCallback(
    async ({ showLoading = false } = {}) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        const response = await productService.getAll({
          page,
          size,
        });

        const pageData = response.data;

        const products = (pageData?.content || []).map((product) => ({
          id: product.id,

          name: product.name,

          price: product.price,

          urlImg: product.urlImg,

          categoryId: product.categoryId,

          categoryName: product.categoryName,

          productStatus: product.status,

          status:
            product.status === "AVAILABLE"
              ? "in_stock"
              : product.status === "OUT_OF_STOCK"
                ? "out_of_stock"
                : "inactive",
        }));

        setMenuItems(products);

        updatePagination(pageData);
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message || "Không thể tải danh sách món ăn.",
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },

    [page, size, updatePagination],
  );

  useEffect(() => {
    fetchProducts({
      showLoading: true,
    });
  }, [fetchProducts]);

  // =============================
  // CATEGORY CHANGED
  // =============================

  const handleCategoriesChanged = async () => {
    /*
     * Refresh dropdown category
     * trong MenuFormModal.
     */
    await fetchCategories();

    /*
     * Nếu vừa đổi tên Category
     * thì ProductResponse.categoryName
     * cũng cần được load lại.
     */
    await fetchProducts();
  };

  // =============================
  // OPEN ADD
  // =============================

  const handleOpenAdd = () => {
    setEditingItem(null);

    setMenuForm({
      ...EMPTY_MENU_FORM,
    });

    setIsModalOpen(true);
  };

  // =============================
  // OPEN EDIT
  // =============================

  const handleOpenEdit = (item) => {
    setEditingItem(item);

    setMenuForm({
      name: item.name || "",

      categoryId: item.categoryId ? String(item.categoryId) : "",

      price: item.price ?? "",

      urlImg: item.urlImg || "",
    });

    setIsModalOpen(true);
  };

  // =============================
  // CLOSE MODAL
  // =============================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setEditingItem(null);

    setMenuForm(EMPTY_MENU_FORM);
  };

  // =============================
  // SAVE
  // CREATE + UPDATE
  // =============================

  const handleSave = async (event) => {
    event.preventDefault();

    // =============================
    // NORMALIZE
    // =============================

    const name = menuForm.name.trim();

    const price = Number(menuForm.price);

    const categoryId = Number(menuForm.categoryId);

    const urlImg = menuForm.urlImg?.trim() || null;

    // =============================
    // VALIDATE NAME
    // =============================

    if (!name) {
      toast.error("Vui lòng nhập tên món ăn.");

      return;
    }

    // =============================
    // VALIDATE PRICE
    // =============================

    if (Number.isNaN(price) || price <= 0) {
      toast.error("Đơn giá phải lớn hơn 0.");

      return;
    }

    // =============================
    // VALIDATE CATEGORY
    // =============================

    if (Number.isNaN(categoryId) || categoryId <= 0) {
      toast.error("Vui lòng chọn danh mục.");

      return;
    }

    // =============================
    // CHECK CATEGORY EXISTS
    // =============================

    const selectedCategory = categories.find(
      (category) => Number(category.id) === categoryId,
    );

    if (!selectedCategory) {
      toast.error("Danh mục không hợp lệ.");

      return;
    }

    // =============================
    // PAYLOAD
    // =============================

    const payload = {
      name,

      price,

      urlImg,

      categoryId,
    };

    try {
      // =============================
      // UPDATE
      // =============================

      if (editingItem) {
        await productService.update(
          editingItem.id,

          payload,
        );

        toast.success(`Cập nhật món "${name}" thành công!`);
      }

      // =============================
      // CREATE
      // =============================
      else {
        await productService.create(payload);

        toast.success(`Thêm món "${name}" thành công!`);
      }

      // =============================
      // CLOSE MODAL
      // =============================

      handleCloseModal();

      // =============================
      // REFRESH
      // =============================

      /*
       * CREATE:
       * Product mới sort ID DESC
       * nên đưa về page 0.
       *
       * UPDATE:
       * giữ page hiện tại.
       */

      if (!editingItem && page !== 0) {
        setPage(0);
      } else {
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          (editingItem
            ? "Không thể cập nhật món ăn."
            : "Không thể thêm món ăn."),
      );
    }
  };

  // =============================
  // SOFT DELETE
  // -> INACTIVE
  // =============================

  const handleDelete = async (item) => {
    // =============================
    // ALREADY INACTIVE
    // =============================

    if (item.productStatus === "INACTIVE") {
      toast.error("Món này đã ngừng bán.");

      return;
    }

    // =============================
    // CONFIRM
    // =============================

    const confirmed = window.confirm(
      `Bạn có chắc muốn ngừng bán món "${item.name}" không?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      // =============================
      // API
      // =============================

      await productService.deactivate(item.id);

      toast.success(`Đã ngừng bán món "${item.name}".`);

      // =============================
      // REFRESH
      // =============================

      await fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Không thể ngừng bán món ăn.",
      );
    }
  };

  // =============================
  // RESTORE
  // INACTIVE -> AVAILABLE
  // =============================

  const handleRestore = async (item) => {
    if (item.productStatus !== "INACTIVE") {
      toast.error("Món này chưa ở trạng thái ngừng bán.");

      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn mở bán lại món "${item.name}" không?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await productService.restore(item.id);

      toast.success(`Mở bán lại món "${item.name}" thành công!`);

      await fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Không thể mở bán lại món ăn.",
      );
    }
  };

  // =============================
  // TOGGLE STOCK
  // AVAILABLE <-> OUT_OF_STOCK
  // =============================

  const handleToggleStock = async (item) => {
    // =============================
    // INACTIVE
    // =============================

    if (item.productStatus === "INACTIVE") {
      toast.error("Không thể đổi trạng thái món đã ngừng bán.");

      return;
    }

    try {
      // =============================
      // API
      // =============================

      const response = await productService.toggleAvailability(item.id);

      /*
       * Backend trả message:
       *
       * "Sản phẩm đã sẵn sàng để bán."
       *
       * hoặc
       *
       * "Sản phẩm đã chuyển sang trạng thái hết món."
       */

      toast.success(response.message || "Cập nhật trạng thái món thành công!");

      // =============================
      // REFRESH
      // =============================

      await fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Không thể thay đổi trạng thái món ăn.",
      );
    }
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
        {/* =========================
            PANEL HEADER
        ========================= */}

        <div className={styles.panelHeader}>
          <div>
            <h2>Quản Lý Danh Sách Thực Đơn</h2>

            <p>Thêm, sửa, ngừng bán món ăn, chỉnh sửa giá bán & hình ảnh</p>
          </div>

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "10px",
            }}
          >
            <ManageCategoriesButton
              onClick={() => setIsCategoryModalOpen(true)}
            />

            <AddButton onClick={handleOpenAdd}>Thêm Món Mới</AddButton>
          </div>
        </div>

        {/* =========================
            PRODUCT TABLE
        ========================= */}

        {loading ? (
          <div
            style={{
              padding: "40px",

              textAlign: "center",
            }}
          >
            Đang tải danh sách món ăn...
          </div>
        ) : (
          <MenuTable
            menuItems={menuItems}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onToggleStock={handleToggleStock}
          />
        )}

        {/* =========================
            PAGINATION
        ========================= */}

        <Pagination
          page={page}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={setPage}
        />
      </section>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      <MenuFormModal
        open={isModalOpen}
        editingItem={editingItem}
        form={menuForm}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onChange={setMenuForm}
        onClose={handleCloseModal}
        onSubmit={handleSave}
      />

      {/* =========================
            CATEGORY MANAGEMENT MODAL
        ========================= */}

      <CategoryManagementModal
        open={isCategoryModalOpen}
        categories={categories}
        onClose={() => setIsCategoryModalOpen(false)}
        onChanged={handleCategoriesChanged}
      />
    </div>
  );
}

export default Menu;
