import { ORDER_STATUS, ORDER_TYPE } from "../constants/orderStatus";

export const INITIAL_ORDERS = [
  {
    id: "#DI104",

    orderType: ORDER_TYPE.DINE_IN,

    tableId: "03",
    tableName: "Bàn T-03 - Eve",

    customerName: "Eve",
    guestCount: 4,

    waiterName: "Lê Phục Vụ",

    createdAt: "07/08/2026 17:25",

    items: [
      {
        id: "OI001",
        menuItemId: "M01",
        name: "Hủ Tiếu Nam Vang",
        price: 45000,
        quantity: 2,
        note: "Nhiều hành, không giá",
      },
      {
        id: "OI002",
        menuItemId: "M07",
        name: "Xí quách thêm",
        price: 25000,
        quantity: 1,
        note: "Cho thêm nước béo",
      },
    ],

    status: ORDER_STATUS.COOKING,

    progressPercentage: 75,
    progressLabel: "75% Đang chế biến",

    subtotal: 115000,
    vatAmount: 9200,
    discountAmount: 0,

    totalAmount: 124200,
  },

  {
    id: "#DI105",

    orderType: ORDER_TYPE.DINE_IN,

    tableId: "05",
    tableName: "Bàn T-05 - Minh",

    customerName: "Minh",
    guestCount: 2,

    waiterName: "Lê Phục Vụ",

    createdAt: "07/08/2026 17:32",

    items: [
      {
        id: "OI003",
        menuItemId: "M05",
        name: "Hủ Tiếu Mực",
        price: 65000,
        quantity: 1,
        note: "Không ớt",
      },
    ],

    status: ORDER_STATUS.READY,

    progressPercentage: 100,
    progressLabel: "100% Chờ phục vụ",

    subtotal: 65000,
    vatAmount: 5200,

    totalAmount: 70200,
  },

  {
    id: "#TA001",

    orderType: ORDER_TYPE.TAKE_AWAY,

    tableName: "Mang Về",

    customerName: "Khách mang về",
    guestCount: 1,

    waiterName: "Thu Ngân A",

    createdAt: "07/08/2026 17:36",

    items: [
      {
        id: "OI004",
        menuItemId: "M04",
        name: "Hủ Tiếu Khô Đặc Biệt",
        price: 65000,
        quantity: 3,
        note: "Tách nước lèo riêng, thêm sa tế",
      },
      {
        id: "OI005",
        menuItemId: "M09",
        name: "Sữa đậu nành",
        price: 15000,
        quantity: 1,
        note: "Ít đường",
      },
    ],

    status: ORDER_STATUS.PENDING_PAYMENT,

    progressPercentage: 100,
    progressLabel: "Chờ thanh toán",

    subtotal: 210000,
    vatAmount: 16800,

    totalAmount: 226800,
  },

  {
    id: "#DL001",

    orderType: ORDER_TYPE.DELIVERY,

    tableName: "Giao Hàng",

    customerName: "Nguyễn Minh Anh",
    guestCount: 1,

    waiterName: "Thu Ngân A",

    createdAt: "07/08/2026 17:40",

    items: [
      {
        id: "OI006",
        menuItemId: "M02",
        name: "Hủ Tiếu Mỹ Tho",
        price: 50000,
        quantity: 2,
        note: "",
      },
    ],

    status: ORDER_STATUS.NEW,

    progressPercentage: 10,
    progressLabel: "10% Mới tạo",

    subtotal: 100000,
    vatAmount: 8000,

    totalAmount: 108000,
  },

  {
    id: "#DI101",

    orderType: ORDER_TYPE.DINE_IN,

    tableId: "01",
    tableName: "Bàn T-01",

    customerName: "Khách bàn 01",
    guestCount: 2,

    waiterName: "Nam",

    createdAt: "07/08/2026 16:45",

    items: [
      {
        id: "OI007",
        menuItemId: "M01",
        name: "Hủ Tiếu Nam Vang",
        price: 45000,
        quantity: 2,
        note: "",
      },
    ],

    status: ORDER_STATUS.COMPLETED,

    progressPercentage: 100,
    progressLabel: "Đã hoàn thành",

    subtotal: 90000,
    vatAmount: 7200,

    totalAmount: 97200,

    paymentMethod: "cash",
    paidAt: "07/08/2026 17:10",
  },
];
