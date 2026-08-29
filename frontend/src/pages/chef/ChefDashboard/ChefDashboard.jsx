import { useMemo, useRef, useState } from "react";

import KitchenHeader from "../../../features/chef/components/KitchenHeader/KitchenHeader";

import KitchenFilters from "../../../features/chef/components/KitchenFilters/KitchenFilters";

import KitchenColumn from "../../../features/chef/components/KitchenColumn/KitchenColumn";

import useKitchenState from "../../../features/chef/hooks/useKitchenState";

import styles from "./ChefDashboard.module.css";

const DEFAULT_WIDTHS = [33.33, 33.33, 33.34];

const MIN_COLUMN_WIDTH = 20;

function ChefDashboard() {
  const kitchen = useKitchenState();

  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");

  // ==================================================
  // RESIZABLE COLUMNS
  // ==================================================

  const boardRef = useRef(null);

  const [columnWidths, setColumnWidths] = useState(DEFAULT_WIDTHS);

  const startResize = (index, event) => {
    event.preventDefault();

    const board = boardRef.current;

    if (!board) {
      return;
    }

    const rect = board.getBoundingClientRect();

    /*
     * 2 handles x 7px.
     */
    const usableWidth = rect.width - 14;

    const startX = event.clientX;

    const startWidths = [...columnWidths];

    document.body.style.cursor = "col-resize";

    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent) => {
      const deltaPx = moveEvent.clientX - startX;

      const deltaPercent = (deltaPx / usableWidth) * 100;

      const leftStart = startWidths[index];

      const rightStart = startWidths[index + 1];

      /*
       * Không cho một cột
       * nhỏ hơn 20%.
       */
      const minDelta = MIN_COLUMN_WIDTH - leftStart;

      const maxDelta = rightStart - MIN_COLUMN_WIDTH;

      const safeDelta = Math.max(
        minDelta,

        Math.min(maxDelta, deltaPercent),
      );

      const next = [...startWidths];

      next[index] = leftStart + safeDelta;

      next[index + 1] = rightStart - safeDelta;

      setColumnWidths(next);
    };

    const stopResize = () => {
      document.body.style.cursor = "";

      document.body.style.userSelect = "";

      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", stopResize);
    };

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", stopResize);
  };

  const resetColumns = () => {
    setColumnWidths(DEFAULT_WIDTHS);
  };

  // ==================================================
  // FILTER
  // ==================================================

  const filterTickets = (tickets) => {
    const keyword = searchQuery.trim().toLowerCase();

    return tickets.filter((ticket) => {
      if (orderTypeFilter !== "all" && ticket.orderType !== orderTypeFilter) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const orderMatch = String(ticket.orderId).includes(keyword);

      const tableMatch = String(ticket.tableNumber || "")
        .toLowerCase()
        .includes(keyword);

      const itemMatch = ticket.items.some(
        (item) =>
          item.name?.toLowerCase().includes(keyword) ||
          item.note?.toLowerCase().includes(keyword),
      );

      return orderMatch || tableMatch || itemMatch;
    });
  };

  const waitingTickets = useMemo(
    () => filterTickets(kitchen.board.waiting),
    [kitchen.board.waiting, orderTypeFilter, searchQuery],
  );

  const processingTickets = useMemo(
    () => filterTickets(kitchen.board.processing),
    [kitchen.board.processing, orderTypeFilter, searchQuery],
  );

  const readyTickets = useMemo(
    () => filterTickets(kitchen.board.ready),
    [kitchen.board.ready, orderTypeFilter, searchQuery],
  );

  return (
    <main className={styles.page}>
      <KitchenHeader
        waitingCount={kitchen.board.waiting.length}
        processingCount={kitchen.board.processing.length}
        readyCount={kitchen.board.ready.length}
        loading={kitchen.loading}
        soundEnabled={kitchen.soundEnabled}
        onToggleSound={kitchen.toggleSound}
        onRefresh={() => kitchen.reload()}
      />

      <KitchenFilters
        tickets={kitchen.tickets}
        orderTypeFilter={orderTypeFilter}
        onOrderTypeChange={setOrderTypeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {kitchen.error && <div className={styles.error}>{kitchen.error}</div>}

      {kitchen.loading ? (
        <div className={styles.loading}>Đang tải dữ liệu bếp...</div>
      ) : (
        <div
          ref={boardRef}
          className={styles.board}
          style={{
            gridTemplateColumns: `${columnWidths[0]}fr 7px ${columnWidths[1]}fr 7px ${columnWidths[2]}fr`,
          }}
        >
          {/* ==================================================
              WAITING
          ================================================== */}

          <div className={styles.columnWrapper}>
            <KitchenColumn
              type="waiting"
              title="CHỜ NẤU"
              tickets={waitingTickets}
              getElapsed={kitchen.getElapsed}
              actionKey={kitchen.actionKey}
              onStartTicket={kitchen.startTicket}
              onItemAction={kitchen.updateItem}
              onCompleteTicket={kitchen.completeTicket}
            />
          </div>

          {/* ==================================================
              RESIZE 1
          ================================================== */}

          <button
            type="button"
            className={styles.resizeHandle}
            title="Kéo để thay đổi độ rộng cột"
            onPointerDown={(event) => startResize(0, event)}
            onDoubleClick={resetColumns}
          >
            <span />
          </button>

          {/* ==================================================
              PROCESSING
          ================================================== */}

          <div className={styles.columnWrapper}>
            <KitchenColumn
              type="processing"
              title="ĐANG NẤU"
              tickets={processingTickets}
              getElapsed={kitchen.getElapsed}
              actionKey={kitchen.actionKey}
              onStartTicket={kitchen.startTicket}
              onItemAction={kitchen.updateItem}
              onCompleteTicket={kitchen.completeTicket}
            />
          </div>

          {/* ==================================================
              RESIZE 2
          ================================================== */}

          <button
            type="button"
            className={styles.resizeHandle}
            title="Kéo để thay đổi độ rộng cột"
            onPointerDown={(event) => startResize(1, event)}
            onDoubleClick={resetColumns}
          >
            <span />
          </button>

          {/* ==================================================
              READY
          ================================================== */}

          <div className={styles.columnWrapper}>
            <KitchenColumn
              type="ready"
              title="MÓN SẴN SÀNG"
              tickets={readyTickets}
              getElapsed={kitchen.getElapsed}
              actionKey={kitchen.actionKey}
              onStartTicket={kitchen.startTicket}
              onItemAction={kitchen.updateItem}
              onCompleteTicket={kitchen.completeTicket}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default ChefDashboard;
