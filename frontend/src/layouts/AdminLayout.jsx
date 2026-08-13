import { Outlet } from "react-router-dom";

import AdminSidebar from "../features/admin/components/common/AdminSidebar/AdminSidebar";

import styles from "./AdminLayout.module.css";

function AdminLayout() {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />

      <main className={styles.adminContent}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
