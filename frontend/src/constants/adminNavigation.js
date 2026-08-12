import {
  Grid3X3,
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export const ADMIN_NAVIGATION = [
  {
    label: "Tổng Quan & Doanh Thu",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Quản Lý Chi Phí",
    path: "/admin/expenses",
    icon: Receipt,
  },
  {
    label: "Quản Lý Đơn Hàng",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Quản Lý Thực Đơn",
    path: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    label: "Quản Lý Nhân Viên",
    path: "/admin/staff",
    icon: Users,
  },
  {
    label: "Sơ Đồ Bàn Ăn",
    path: "/admin/tables",
    icon: Grid3X3,
  },
];
