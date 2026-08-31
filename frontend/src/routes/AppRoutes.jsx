import { Navigate, Route, Routes } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import { ROLES } from "../constants/roles";

import authService from "../services/authService";

import useAuth from "../hooks/useAuth";

import AppLayout from "../layouts/AppLayout";

import Login from "../pages/auth/Login/Login";

import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import Expenses from "../pages/admin/Expenses/Expenses";
import Orders from "../pages/admin/Orders/Orders";
import Menu from "../pages/admin/Menu/Menu";
import Staff from "../pages/admin/Staff/Staff";
import Tables from "../pages/admin/Tables/Tables";
import RestaurantManagement from "../pages/admin/RestaurantManagement/RestaurantManagement";

import CashierDashboard from "../pages/cashier/CashierDashboard/CashierDashboard";

import ChefDashboard from "../pages/chef/ChefDashboard/ChefDashboard";

import WaiterDashboard from "../pages/waiter/WaiterDashboard/WaiterDashboard";
import AdminLayout from "../layouts/AdminLayout";
function AppRoutes() {
  const { isAuthenticated, roles } = useAuth();

  const rootRedirect = isAuthenticated
    ? authService.getHomeRedirectPath(roles)
    : "/login";

  return (
    <Routes>
      {/* =========================
          ROOT
      ========================= */}
      <Route path="/" element={<Navigate to={rootRedirect} replace />} />

      {/* =========================
          PUBLIC
      ========================= */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* =========================
          PROTECTED
      ========================= */}
      <Route element={<ProtectedRoute />}>
        {/* Tất cả page phía trong đều có Header */}
        <Route element={<AppLayout />}>
          {/* ADMIN */}
          <Route
            path="/admin"
            element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}
          >
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route path="expenses" element={<Expenses />} />

              <Route path="orders" element={<Orders />} />

              <Route path="menu" element={<Menu />} />

              <Route path="staff" element={<Staff />} />

              <Route path="tables" element={<Tables />} />

              <Route path="restaurant" element={<RestaurantManagement />} />
            </Route>
          </Route>

          {/* CASHIER */}
          <Route
            path="/cashier"
            element={<RoleRoute allowedRoles={[ROLES.CASHIER]} />}
          >
            <Route index element={<CashierDashboard />} />
          </Route>

          {/* CHEF */}
          <Route
            path="/chef"
            element={<RoleRoute allowedRoles={[ROLES.CHEF]} />}
          >
            <Route index element={<ChefDashboard />} />
          </Route>

          {/* WAITER */}
          <Route
            path="/waiter"
            element={<RoleRoute allowedRoles={[ROLES.WAITER]} />}
          >
            <Route index element={<WaiterDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* =========================
          404
      ========================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
