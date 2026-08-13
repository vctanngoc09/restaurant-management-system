import { MENU_CATEGORY } from "../constants/menuCategories";

export const INITIAL_MENU_ITEMS = [
  {
    id: "M01",
    name: "Hủ Tiếu Nam Vang",
    category: MENU_CATEGORY.HU_TIEU,
    price: 45000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80",
    description:
      "Tôm, thịt bằm, gan, trứng cút, mực, nước dùng đậm đà ngọt thanh",
  },
  {
    id: "M02",
    name: "Hủ Tiếu Mỹ Tho",
    category: MENU_CATEGORY.HU_TIEU,
    price: 50000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80",
    description: "Sợi hủ tiếu dai dai, xá xíu, thịt bằm, tôm tươi & xương ống",
  },
  {
    id: "M03",
    name: "Hủ Tiếu Sa Đéc",
    category: MENU_CATEGORY.HU_TIEU,
    price: 55000,
    status: "out_of_stock",
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=200&q=80",
    description:
      "Sợi bánh to dẻo thơm, xốt trộn Sa Đéc đậm đà kèm bát nước lèo",
  },
  {
    id: "M04",
    name: "Hủ Tiếu Khô Đặc Biệt",
    category: MENU_CATEGORY.HU_TIEU,
    price: 65000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=200&q=80",
    description:
      "Bánh hủ tiếu trụt xốt béo ngậy, tôm hùm đất, xá xíu & sườn non",
  },
  {
    id: "M05",
    name: "Hủ Tiếu Mực",
    category: MENU_CATEGORY.HU_TIEU,
    price: 65000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80",
    description: "Mực ống tươi rói, thịt viên, gừng sợi, hành phi thơm lừng",
  },
  {
    id: "M06",
    name: "Hủ Tiếu Bò Viên",
    category: MENU_CATEGORY.HU_TIEU,
    price: 55000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80",
    description:
      "Bò viên gân dai giòn, xí quách tươi & nước lèo thơm ngào ngạt",
  },
  {
    id: "M07",
    name: "Chả Giò (4 cuốn)",
    category: MENU_CATEGORY.KHAI_VI,
    price: 35000,
    status: "in_stock",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=200&q=80",
    description: "Chả giò tôm thịt giòn rụm ăn kèm rau sống mắm chua ngọt",
  },
  {
    id: "M08",
    name: "Trà Đá",
    category: MENU_CATEGORY.DO_UONG,
    price: 5000,
    status: "in_stock",
    image: "",
    description: "Trà đá mát lạnh",
  },
  {
    id: "M09",
    name: "Xí Quách Thêm",
    category: MENU_CATEGORY.MON_THEM,
    price: 25000,
    status: "in_stock",
    image: "",
    description: "Xí quách hầm mềm ăn kèm hủ tiếu",
  },
];

export const EMPTY_MENU_FORM = {
  name: "",
  category: MENU_CATEGORY.HU_TIEU,
  price: "",
  status: "in_stock",
  image: "",
  description: "",
};
