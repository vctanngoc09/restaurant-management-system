import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "react-toastify";

import chefService from "../services/chefService";

// ==================================================
// ORDER TYPE
// ==================================================

function normalizeOrderType(type) {
  switch (type) {
    case "DINE_IN":
      return "dine_in";

    case "TAKE_AWAY":
      return "take_away";

    case "DELIVERY":
      return "delivery";

    default:
      return type?.toLowerCase() || "dine_in";
  }
}

// ==================================================
// ITEM STATUS
// ==================================================

function normalizeItemStatus(status) {
  return status?.toLowerCase() || "pending";
}

// ==================================================
// ITEM
// ==================================================

function normalizeItem(item) {
  return {
    id: item.id,

    productId: item.productId,

    menuItemId: item.productId,

    name: item.productName,

    price: Number(item.price) || 0,

    quantity: Number(item.quantity) || 0,

    note: item.note || "",

    status: normalizeItemStatus(item.status),

    lineTotal: Number(item.lineTotal) || 0,
  };
}

// ==================================================
// KITCHEN TICKET
// ==================================================

function normalizeTicket(ticket) {
  return {
    // =========================
    // TICKET
    // =========================

    id: ticket.id,

    batchNumber: ticket.batchNumber,

    status: ticket.status?.toLowerCase(),

    firedAt: ticket.firedAt,

    startedAt: ticket.startedAt,

    readyAt: ticket.readyAt,

    doneAt: ticket.doneAt,

    // =========================
    // ORDER
    // =========================

    orderId: ticket.orderId,

    orderType: normalizeOrderType(ticket.orderType),

    // =========================
    // TABLE
    // =========================

    tableId: ticket.tableId,

    tableNumber: ticket.tableNumber,

    // =========================
    // STAFF
    // =========================

    staffId: ticket.staffId,

    staffName: ticket.staffName,

    waiterName: ticket.staffName || "Phục vụ",

    // =========================
    // ITEMS
    // =========================

    items: Array.isArray(ticket.items) ? ticket.items.map(normalizeItem) : [],
  };
}

// ==================================================
// EMPTY BOARD
// ==================================================

const EMPTY_BOARD = {
  waiting: [],
  processing: [],
  ready: [],
};

// ==================================================
// KITCHEN STATE
// ==================================================

function useKitchenState() {
  // ==================================================
  // BOARD
  // ==================================================

  const [board, setBoard] = useState(EMPTY_BOARD);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // ==================================================
  // ACTION
  //
  // Ví dụ:
  //
  // ticket:5
  // item:12:COOKING
  // ==================================================

  const [actionKey, setActionKey] = useState(null);

  // ==================================================
  // SOUND
  // ==================================================

  const [soundEnabled, setSoundEnabled] = useState(true);

  // ==================================================
  // CLOCK
  //
  // Dùng để timer trên card chạy.
  // ==================================================

  const [now, setNow] = useState(Date.now());

  // ==================================================
  // PREVIOUS WAITING IDS
  //
  // Dành cho notification sau này.
  // ==================================================

  const previousWaitingIds = useRef(new Set());

  const initializedRef = useRef(false);

  // ==================================================
  // LOAD BOARD
  // ==================================================

  const loadBoard = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        setError(null);

        // =========================
        // API
        // =========================

        const response = await chefService.getBoard();

        /*
         * chefService trả:
         *
         * {
         *   status,
         *   message,
         *   data: {
         *     waiting,
         *     processing,
         *     ready
         *   }
         * }
         */
        const data = response?.data || EMPTY_BOARD;

        // =========================
        // NORMALIZE
        // =========================

        const nextBoard = {
          waiting: Array.isArray(data.waiting)
            ? data.waiting.map(normalizeTicket)
            : [],

          processing: Array.isArray(data.processing)
            ? data.processing.map(normalizeTicket)
            : [],

          ready: Array.isArray(data.ready)
            ? data.ready.map(normalizeTicket)
            : [],
        };

        // =========================
        // NEW TICKET DETECTION
        // =========================

        if (initializedRef.current) {
          const hasNewTicket = nextBoard.waiting.some(
            (ticket) => !previousWaitingIds.current.has(ticket.id),
          );

          if (hasNewTicket && soundEnabled) {
            /*
             * Tạm dùng browser speech.
             *
             * Sau này WebSocket
             * có thể thay phần này.
             */
            try {
              const speech = new SpeechSynthesisUtterance(
                "Có đơn mới gửi xuống bếp",
              );

              speech.lang = "vi-VN";

              window.speechSynthesis?.speak(speech);
            } catch {
              // Browser không hỗ trợ
            }
          }
        }

        previousWaitingIds.current = new Set(
          nextBoard.waiting.map((ticket) => ticket.id),
        );

        initializedRef.current = true;

        setBoard(nextBoard);
      } catch (apiError) {
        console.error("LOAD CHEF BOARD ERROR:", apiError);

        const message =
          apiError.response?.data?.message ||
          apiError.message ||
          "Không thể tải dữ liệu bếp.";

        setError(message);

        if (!silent) {
          toast.error(message);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [soundEnabled],
  );

  // ==================================================
  // INITIAL LOAD
  // +
  // POLLING 5 SECONDS
  //
  // Sau này WebSocket
  // thì bỏ interval này.
  // ==================================================

  useEffect(() => {
    loadBoard();

    const interval = setInterval(() => {
      loadBoard(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [loadBoard]);

  // ==================================================
  // TIMER
  // ==================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==================================================
  // GET ELAPSED
  // ==================================================

  const getElapsed = (ticket) => {
    let time = null;

    if (ticket.status === "waiting") {
      time = ticket.firedAt;
    }

    if (ticket.status === "processing") {
      time = ticket.startedAt || ticket.firedAt;
    }

    if (ticket.status === "ready") {
      time = ticket.readyAt || ticket.startedAt || ticket.firedAt;
    }

    if (!time) {
      return 0;
    }

    const timestamp = new Date(time).getTime();

    if (Number.isNaN(timestamp)) {
      return 0;
    }

    return Math.max(
      0,

      Math.floor((now - timestamp) / 1000),
    );
  };

  // ==================================================
  // START TICKET
  //
  // WAITING -> PROCESSING
  // ==================================================

  const startTicket = async (ticket) => {
    if (!ticket?.id) {
      return null;
    }

    const key = `ticket:${ticket.id}`;

    if (actionKey === key) {
      return null;
    }

    try {
      setActionKey(key);

      const response = await chefService.startTicket(ticket.id);

      toast.success(
        `Đã bắt đầu ${
          ticket.orderType === "dine_in"
            ? `Bàn ${ticket.tableNumber}`
            : `Order #${ticket.orderId}`
        }`,
      );

      /*
       * Refresh toàn board
       * để ticket tự chuyển
       * WAITING -> PROCESSING.
       */
      await loadBoard(true);

      return response?.data;
    } catch (apiError) {
      console.error("START TICKET ERROR:", apiError);

      toast.error(
        apiError.response?.data?.message || "Không thể bắt đầu phiếu bếp.",
      );

      return null;
    } finally {
      setActionKey(null);
    }
  };

  // ==================================================
  // UPDATE ITEM
  // ==================================================

  const updateItem = async (item, targetStatus) => {
    if (!item?.id) {
      return null;
    }

    const key = `item:${item.id}:${targetStatus}`;

    if (actionKey === key) {
      return null;
    }

    try {
      setActionKey(key);

      const response = await chefService.updateItemStatus(
        item.id,
        targetStatus,
      );

      if (targetStatus === "COOKING") {
        toast.info(`Bắt đầu nấu ${item.quantity}x ${item.name}`);
      }

      if (targetStatus === "READY") {
        toast.success(`Đã xong ${item.quantity}x ${item.name}`);
      }

      /*
       * Backend có thể tự chuyển
       * KitchenTicket -> READY
       * khi toàn bộ món đã xong.
       *
       * Vì vậy reload board.
       */
      await loadBoard(true);

      return response?.data;
    } catch (apiError) {
      console.error("UPDATE CHEF ITEM ERROR:", apiError);

      toast.error(
        apiError.response?.data?.message ||
          "Không thể cập nhật trạng thái món.",
      );

      return null;
    } finally {
      setActionKey(null);
    }
  };

  // ==================================================
  // ALL ACTIVE TICKETS
  //
  // Dùng cho filter.
  // ==================================================

  const tickets = useMemo(
    () => [...board.waiting, ...board.processing, ...board.ready],
    [board],
  );

  // ==================================================
  // SOUND
  // ==================================================

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;

      toast.info(next ? "Đã bật âm thanh KDS" : "Đã tắt âm thanh KDS");

      return next;
    });
  };

  // ==================================================
  // COMPLETE ENTIRE TICKET
  // ==================================================

  const completeTicket = async (ticket) => {
    if (!ticket?.id) {
      return null;
    }

    const key = `complete:${ticket.id}`;

    if (actionKey === key) {
      return null;
    }

    try {
      setActionKey(key);

      const response = await chefService.completeTicket(ticket.id);

      toast.success(
        `Đã hoàn tất toàn bộ món của ${
          ticket.orderType === "dine_in"
            ? `Bàn ${ticket.tableNumber}`
            : `Order #${ticket.orderId}`
        }`,
      );

      /*
       * Ticket tự:
       *
       * PROCESSING
       * ->
       * READY
       */
      await loadBoard(true);

      return response?.data;
    } catch (apiError) {
      console.error("COMPLETE TICKET ERROR:", apiError);

      toast.error(
        apiError.response?.data?.message || "Không thể hoàn tất phiếu bếp.",
      );

      return null;
    } finally {
      setActionKey(null);
    }
  };

  // ==================================================
  // RETURN
  // ==================================================

  return {
    board,

    tickets,

    loading,

    error,

    actionKey,

    soundEnabled,

    getElapsed,

    startTicket,

    updateItem,

    completeTicket,

    toggleSound,

    reload: loadBoard,
  };
}

export default useKitchenState;
