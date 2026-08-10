import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import authService from "../services/authService";

function PublicRoute() {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const correctPath = authService.getHomeRedirectPath(roles);

  if (correctPath === "/login") {
    return <Outlet />;
  }

  return <Navigate to={correctPath} replace />;
}

export default PublicRoute;
