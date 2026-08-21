export const KITCHEN_MENU_ITEMS = [
  {
    id: "M01",
    name: "Hủ Tiếu Nam Vang",
    price: 45000,
    status: "in_stock",
  },
  {
    id: "M02",
    name: "Hủ Tiếu Khô Đặc Biệt",
    price: 65000,
    status: "in_stock",
  },
  {
    id: "M03",
    name: "Hủ Tiếu Bò Viên",
    price: 55000,
    status: "in_stock",
  },
  {
    id: "M04",
    name: "Hủ Tiếu Mực",
    price: 65000,
    status: "in_stock",
  },
  {
    id: "M05",
    name: "Trà Đá",
    price: 5000,
    status: "in_stock",
  },
  {
    id: "M06",
    name: "Sữa Đậu Nành",
    price: 15000,
    status: "out_of_stock",
  },
  {
    id: "M07",
    name: "Nước Ngọt",
    price: 15000,
    status: "in_stock",
  },
  {
    id: "M08",
    name: "Xí Quách Thêm",
    price: 20000,
    status: "in_stock",
  },
];

export const KITCHEN_ORDERS = [
  {
    id: "DI104",
    orderType: "dine_in",
    tableId: "T-03",
    tableName: "T-03",
    waiterName: "Vũ Nam",
    status: "cooking",
    elapsedSeconds: 370,

    items: [
      {
        id: "OI101",
        menuItemId: "M01",
        name: "Hủ Tiếu Nam Vang",
        quantity: 2,
        note: "1 tô không hành",
        kdsStatus: "cooking",
      },
      {
        id: "OI102",
        menuItemId: "M08",
        name: "Xí Quách Thêm",
        quantity: 1,
        note: "",
        kdsStatus: "pending",
      },
    ],
  },

  {
    id: "TA001",
    orderType: "take_away",
    tableId: null,
    tableName: "Mang Về",
    waiterName: "Thu Ngân A",
    status: "cooking",
    elapsedSeconds: 155,

    items: [
      {
        id: "OI201",
        menuItemId: "M02",
        name: "Hủ Tiếu Khô Đặc Biệt",
        quantity: 3,
        note: "Không giá",
        kdsStatus: "pending",
      },
      {
        id: "OI202",
        menuItemId: "M06",
        name: "Sữa Đậu Nành",
        quantity: 1,
        note: "",
        kdsStatus: "ready",
      },
    ],
  },

  {
    id: "DI105",
    orderType: "dine_in",
    tableId: "T-05",
    tableName: "T-05",
    waiterName: "Lan",
    status: "ready",
    elapsedSeconds: 215,

    items: [
      {
        id: "OI301",
        menuItemId: "M04",
        name: "Hủ Tiếu Mực",
        quantity: 1,
        note: "Ít hành",
        kdsStatus: "ready",
      },
    ],
  },

  {
    id: "DI106",
    orderType: "dine_in",
    tableId: "N-02",
    tableName: "N-02",
    waiterName: "Nam",
    status: "cooking",
    elapsedSeconds: 95,

    items: [
      {
        id: "OI401",
        menuItemId: "M03",
        name: "Hủ Tiếu Bò Viên",
        quantity: 4,
        note: "",
        kdsStatus: "pending",
      },
      {
        id: "OI402",
        menuItemId: "M07",
        name: "Nước Ngọt",
        quantity: 4,
        note: "",
        kdsStatus: "ready",
      },
    ],
  },

  {
    id: "DL007",
    orderType: "delivery",
    tableId: null,
    tableName: "Giao Hàng",
    waiterName: "Thu Ngân A",
    status: "cooking",
    elapsedSeconds: 260,

    items: [
      {
        id: "OI501",
        menuItemId: "M01",
        name: "Hủ Tiếu Nam Vang",
        quantity: 2,
        note: "Đóng riêng nước dùng",
        kdsStatus: "cooking",
      },
    ],
  },
];
