import api from "./api";
import AuthStorage from "./AuthStorage";
import { ROLES } from "../constants/roles";

const authService = {
  async login(credentials) {
    const response = await api.post("/api/auth/login", credentials);

    return response.data;
  },

  getHomeRedirectPath(roles = AuthStorage.getRoles()) {
    if (roles.includes(ROLES.ADMIN)) {
      return "/admin";
    }

    if (roles.includes(ROLES.CASHIER)) {
      return "/cashier";
    }

    if (roles.includes(ROLES.CHEF)) {
      return "/chef";
    }

    if (roles.includes(ROLES.WAITER)) {
      return "/waiter";
    }

    return "/login";
  },
};

export default authService;
