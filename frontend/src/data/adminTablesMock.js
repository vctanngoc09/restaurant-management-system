import { TABLE_AREA, TABLE_STATUS } from "../constants/tableConfig";

export const INITIAL_TABLES = [
  {
    id: "T01",
    number: "01",
    area: TABLE_AREA.INDOOR,
    status: TABLE_STATUS.OCCUPIED,

    guestCount: 4,
    itemCount: 2,

    currentOrderId: "#DI101",
    currentTotal: 120000,
  },

  {
    id: "T02",
    number: "02",
    area: TABLE_AREA.INDOOR,
    status: TABLE_STATUS.EMPTY,

    guestCount: 0,
    itemCount: 0,

    currentOrderId: null,
    currentTotal: 0,
  },

  {
    id: "T03",
    number: "03",
    area: TABLE_AREA.INDOOR,
    status: TABLE_STATUS.OCCUPIED,

    guestCount: 2,
    itemCount: 1,

    currentOrderId: "#DI104",
    currentTotal: 85500,
  },

  {
    id: "T04",
    number: "04",
    area: TABLE_AREA.INDOOR,
    status: TABLE_STATUS.EMPTY,

    guestCount: 0,
    itemCount: 0,

    currentOrderId: null,
    currentTotal: 0,
  },

  {
    id: "T05",
    number: "05",
    area: TABLE_AREA.INDOOR,
    status: TABLE_STATUS.OCCUPIED,

    guestCount: 1,
    itemCount: 3,

    currentOrderId: "#DI105",
    currentTotal: 42000,
  },

  {
    id: "T06",
    number: "06",
    area: TABLE_AREA.INDOOR,
    status: TABLE_STATUS.EMPTY,

    guestCount: 0,
    itemCount: 0,

    currentOrderId: null,
    currentTotal: 0,
  },

  {
    id: "N01",
    number: "01",
    area: TABLE_AREA.OUTDOOR,
    status: TABLE_STATUS.EMPTY,

    guestCount: 0,
    itemCount: 0,

    currentOrderId: null,
    currentTotal: 0,
  },

  {
    id: "N02",
    number: "02",
    area: TABLE_AREA.OUTDOOR,
    status: TABLE_STATUS.OCCUPIED,

    guestCount: 6,
    itemCount: 8,

    currentOrderId: "#DI106",
    currentTotal: 210000,
  },
];

export const EMPTY_TABLE_FORM = {
  number: "",
  area: TABLE_AREA.INDOOR,
};
