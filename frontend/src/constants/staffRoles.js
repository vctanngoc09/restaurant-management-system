export const STAFF_ROLE = {
  ADMIN: "admin",
  CASHIER: "cashier",
  CHEF: "chef",
  WAITER: "waiter",
};

export const STAFF_ROLES = [
  {
    value: STAFF_ROLE.WAITER,
    label: "Phục Vụ",
    englishLabel: "Waiter",
  },
  {
    value: STAFF_ROLE.CASHIER,
    label: "Thu Ngân",
    englishLabel: "Cashier",
  },
  {
    value: STAFF_ROLE.CHEF,
    label: "Bếp",
    englishLabel: "Kitchen / Chef",
  },
  {
    value: STAFF_ROLE.ADMIN,
    label: "Quản Lý",
    englishLabel: "Admin",
  },
];

export const STAFF_ROLE_LABELS = {
  [STAFF_ROLE.ADMIN]: "Quản Lý",
  [STAFF_ROLE.CASHIER]: "Thu Ngân",
  [STAFF_ROLE.CHEF]: "Bếp",
  [STAFF_ROLE.WAITER]: "Phục Vụ",
};
