import { ChefHat, CreditCard, LayoutDashboard, Smartphone } from "lucide-react";

import { ROLES } from "./roles";

export const ROLE_NAVIGATION = [
  {
    role: ROLES.CASHIER,
    label: "Thu Ngân",
    path: "/cashier",
    icon: CreditCard,
  },
  {
    role: ROLES.CHEF,
    label: "Bếp",
    path: "/chef",
    icon: ChefHat,
  },
  {
    role: ROLES.WAITER,
    label: "Phục Vụ",
    path: "/waiter",
    icon: Smartphone,
  },
  {
    role: ROLES.ADMIN,
    label: "Admin Quản Lý",
    path: "/admin",
    icon: LayoutDashboard,
  },
];
