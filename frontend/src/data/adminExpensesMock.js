export const EXPENSE_TOTAL_REVENUE = 34500000;

export const EXPENSE_CATEGORIES = [
  {
    id: "all",
    label: "Tất Cả Khoản Chi",
  },
  {
    id: "Nhập nguyên liệu thịt",
    label: "Thịt & Hải sản",
  },
  {
    id: "Rau tươi & gia vị",
    label: "Rau & Gia vị",
  },
  {
    id: "Thanh toán tiền điện",
    label: "Tiện ích (Điện/Nước)",
  },
  {
    id: "Trả lương NV",
    label: "Lương NV",
  },
  {
    id: "Sửa chữa thiết bị",
    label: "Bảo trì & Thiết bị",
  },
];

export const INITIAL_EXPENSES = [
  {
    id: "EXP01",
    date: "01/08/2026",
    category: "Nhập nguyên liệu thịt",
    spender: "Lê Văn Hùng (Bếp trưởng)",
    amount: 4800000,
    note: "Nhập 40kg thịt sườn & giò heo từ Chợ Đầu Mối",
  },
  {
    id: "EXP02",
    date: "02/08/2026",
    category: "Rau tươi & gia vị",
    spender: "Lê Văn Hùng (Bếp trưởng)",
    amount: 1200000,
    note: "Giá, hẹ, ngò rí, tỏi băm, hủ tiếu bột lọc",
  },
  {
    id: "EXP03",
    date: "03/08/2026",
    category: "Thanh toán tiền điện",
    spender: "Nguyễn Văn An (Quản lý)",
    amount: 3500000,
    note: "Thanh toán hóa đơn điện EVN tháng 7",
  },
  {
    id: "EXP04",
    date: "04/08/2026",
    category: "Trả lương NV",
    spender: "Trần Thị Bình (Thu Ngân)",
    amount: 1500000,
    note: "Tạm ứng lương ca sáng cho NV Minh",
  },
  {
    id: "EXP05",
    date: "05/08/2026",
    category: "Sửa chữa thiết bị",
    spender: "Nguyễn Văn An (Quản lý)",
    amount: 1000000,
    note: "Bảo trì máy POS và thiết bị khu vực bếp",
  },
];

export const EMPTY_EXPENSE_FORM = {
  date: "07/08/2026",
  category: "Nhập nguyên liệu thịt",
  spender: "",
  amount: "",
  note: "",
};
