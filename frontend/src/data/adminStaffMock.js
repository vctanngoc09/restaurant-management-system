import { STAFF_ROLE } from "../constants/staffRoles";

export const INITIAL_STAFF = [
  {
    id: "ST01",
    name: "Nguyễn Văn A",
    role: STAFF_ROLE.CASHIER,
    pin: "1234",
    shift: "Ca Sáng (06:00 - 14:00)",
    phone: "0901234567",
    status: "active",
  },
  {
    id: "ST02",
    name: "Trần Thị Owner",
    role: STAFF_ROLE.ADMIN,
    pin: "2468",
    shift: "Ca Hành Chính (08:00 - 17:00)",
    phone: "0902222222",
    status: "active",
  },
  {
    id: "ST03",
    name: "Phạm Bếp Trưởng",
    role: STAFF_ROLE.CHEF,
    pin: "5555",
    shift: "Ca Sáng (06:00 - 14:00)",
    phone: "0903333333",
    status: "active",
  },
  {
    id: "ST04",
    name: "Lê Phục Vụ",
    role: STAFF_ROLE.WAITER,
    pin: "4321",
    shift: "Ca Chiều (14:00 - 22:00)",
    phone: "0904444444",
    status: "active",
  },
];

export const EMPTY_STAFF_FORM = {
  name: "",
  role: STAFF_ROLE.WAITER,
  pin: "1234",
  shift: "Ca Sáng (06:00 - 14:00)",
  phone: "",
};
