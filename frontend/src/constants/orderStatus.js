export const ORDER_STATUS = {
  NEW: "new",
  COOKING: "cooking",
  READY: "ready",
  PENDING_PAYMENT: "pending_payment",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const ORDER_TYPE = {
  DINE_IN: "dine_in",
  TAKE_AWAY: "take_away",
  DELIVERY: "delivery",
};

export const ORDER_STATUS_OPTIONS = [
  {
    value: "all",
    label: "Tất cả trạng thái",
  },
  {
    value: ORDER_STATUS.NEW,
    label: "Mới tạo",
  },
  {
    value: ORDER_STATUS.COOKING,
    label: "Đang nấu",
  },
  {
    value: ORDER_STATUS.READY,
    label: "Chờ phục vụ",
  },
  {
    value: ORDER_STATUS.PENDING_PAYMENT,
    label: "Chờ thanh toán",
  },
  {
    value: ORDER_STATUS.COMPLETED,
    label: "Đã hoàn thành",
  },
  {
    value: ORDER_STATUS.CANCELLED,
    label: "Đã hủy đơn",
  },
];

export const ORDER_TYPE_OPTIONS = [
  {
    value: "all",
    label: "Tất cả loại đơn",
  },
  {
    value: ORDER_TYPE.DINE_IN,
    label: "Tại chỗ (Dine-in)",
  },
  {
    value: ORDER_TYPE.TAKE_AWAY,
    label: "Mang về (Takeaway)",
  },
  {
    value: ORDER_TYPE.DELIVERY,
    label: "Giao hàng (Delivery)",
  },
];
