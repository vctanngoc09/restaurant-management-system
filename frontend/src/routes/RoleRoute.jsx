import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import authService from "../services/authService";

function RoleRoute({ allowedRoles }) {
  const { roles } = useAuth();

  const hasPermission = roles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    const correctPath = authService.getHomeRedirectPath(roles);

    return <Navigate to={correctPath} replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
