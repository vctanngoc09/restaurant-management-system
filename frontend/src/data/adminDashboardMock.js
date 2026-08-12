// =============================================
// ADMIN DASHBOARD MOCK DATA
// Sau này gọi API backend thì thay file này.
// =============================================

export const DASHBOARD_SUMMARY = {
  todayRevenue: 34500000,
  revenueGrowth: 14.2,

  totalOrders: 424,
  actualOrders: 4,

  averageBill: 81368,
  averageItems: 2.4,

  occupiedTables: 4,
  totalTables: 8,
};

// =============================================
// REVENUE CHART
// =============================================

export const HOURLY_REVENUE_DATA = [
  {
    hour: "06:00",
    revenue: 1200000,
    orders: 18,
  },
  {
    hour: "08:00",
    revenue: 3800000,
    orders: 52,
  },
  {
    hour: "10:00",
    revenue: 2400000,
    orders: 34,
  },
  {
    hour: "12:00",
    revenue: 8500000,
    orders: 112,
  },
  {
    hour: "14:00",
    revenue: 4200000,
    orders: 48,
  },
  {
    hour: "16:00",
    revenue: 2100000,
    orders: 28,
  },
  {
    hour: "18:00",
    revenue: 7900000,
    orders: 98,
  },
  {
    hour: "20:00",
    revenue: 5600000,
    orders: 64,
  },
];

export const WEEKLY_REVENUE_DATA = [
  {
    day: "Thứ 2",
    revenue: 34500000,
    orders: 468,
  },
  {
    day: "Thứ 3",
    revenue: 38200000,
    orders: 512,
  },
  {
    day: "Thứ 4",
    revenue: 31000000,
    orders: 430,
  },
  {
    day: "Thứ 5",
    revenue: 36800000,
    orders: 495,
  },
  {
    day: "Thứ 6",
    revenue: 42500000,
    orders: 580,
  },
  {
    day: "Thứ 7",
    revenue: 58900000,
    orders: 790,
  },
  {
    day: "Chủ Nhật",
    revenue: 64200000,
    orders: 845,
  },
];

export const MONTHLY_REVENUE_DATA = [
  { month: "Tháng 1", revenue: 820000000 },
  { month: "Tháng 2", revenue: 950000000 },
  { month: "Tháng 3", revenue: 890000000 },
  { month: "Tháng 4", revenue: 920000000 },
  { month: "Tháng 5", revenue: 1050000000 },
  { month: "Tháng 6", revenue: 1120000000 },
  { month: "Tháng 7", revenue: 1180000000 },
  { month: "Tháng 8", revenue: 1080000000 },
  { month: "Tháng 9", revenue: 990000000 },
  { month: "Tháng 10", revenue: 1040000000 },
  { month: "Tháng 11", revenue: 1100000000 },
  { month: "Tháng 12", revenue: 1350000000 },
];

// =============================================
// TOP SELLING
// =============================================

export const TOP_SELLING_DISHES = [
  {
    name: "Hủ Tiếu Nam Vang",
    count: 184,
    revenue: 8280000,
  },
  {
    name: "Hủ Tiếu Mỹ Tho",
    count: 142,
    revenue: 7100000,
  },
  {
    name: "Hủ Tiếu Khô ĐB",
    count: 98,
    revenue: 6370000,
  },
  {
    name: "Chả Giò (4 cuốn)",
    count: 115,
    revenue: 4025000,
  },
  {
    name: "Trà Đá",
    count: 320,
    revenue: 1600000,
  },
];

// =============================================
// PAYMENT
// =============================================

export const PAYMENT_METHODS = [
  {
    id: "cash",
    name: "Tiền Mặt",
    englishName: "Cash",
    percentage: 55,
    amount: 18975000,
    description: "Thanh toán trực tiếp tại két",
  },
  {
    id: "vietqr",
    name: "Chuyển Khoản VietQR",
    englishName: "",
    percentage: 38,
    amount: 13110000,
    description: "Mã QR tự động khớp lệnh",
  },
  {
    id: "card",
    name: "Thẻ POS",
    englishName: "Credit",
    percentage: 7,
    amount: 2415000,
    description: "Quẹt thẻ máy POS cầm tay",
  },
];

// =============================================
// QUICK MENU STOCK
// =============================================

export const QUICK_MENU_ITEMS = [
  {
    id: "M01",
    name: "Hủ Tiếu Nam Vang",
    price: 45000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "M02",
    name: "Hủ Tiếu Mỹ Tho",
    price: 50000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "M03",
    name: "Hủ Tiếu Sa Đéc",
    price: 55000,
    status: "out_of_stock",
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "M04",
    name: "Hủ Tiếu Khô Đặc Biệt",
    price: 65000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "M05",
    name: "Hủ Tiếu Mực",
    price: 65000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "M06",
    name: "Hủ Tiếu Bò Viên",
    price: 55000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80",
  },
];
