import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { ROLES } from "../constants/roles";
import authService from "../services/authService";
import Login from "../pages/auth/Login/Login";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import CashierDashboard from "../pages/cashier/CashierDashboard/CashierDashboard";
import ChefDashboard from "../pages/chef/ChefDashboard/ChefDashboard";
import WaiterDashboard from "../pages/waiter/WaiterDashboard/WaiterDashboard";
import useAuth from "../hooks/useAuth";

function AppRoutes() {
  const { isAuthenticated, roles } = useAuth();

  const rootRedirect = isAuthenticated
    ? authService.getHomeRedirectPath(roles)
    : "/login";

  return (
    <Routes>
      {/* KHU VỰC 1: XỬ LÝ ĐƯỜNG DẪN GỐC */}
      <Route path="/" element={<Navigate to={rootRedirect} replace />} />

      {/* KHU VỰC 2: CÔNG KHAI (Chỉ dành cho khách) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* KHU VỰC 3: BẢO MẬT NGHIÊM NGẶT (Đã đăng nhập) */}
      <Route element={<ProtectedRoute />}>
        {/* Nhánh Quản lý */}
        <Route
          path="/admin"
          element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Nhánh Bếp */}
        <Route path="/chef" element={<RoleRoute allowedRoles={[ROLES.CHEF]} />}>
          <Route index element={<ChefDashboard />} />
        </Route>

        {/* Nhánh Thu ngân */}
        <Route
          path="/cashier"
          element={<RoleRoute allowedRoles={[ROLES.CASHIER]} />}
        >
          <Route index element={<CashierDashboard />} />
        </Route>

        {/* Nhánh Phục vụ */}
        <Route
          path="/waiter"
          element={<RoleRoute allowedRoles={[ROLES.WAITER]} />}
        >
          <Route index element={<WaiterDashboard />} />
        </Route>
      </Route>

      {/* KHU VỰC 4: BẮT LỖI 404 (Gõ sai đường link) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
