import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  KITCHEN_MENU_ITEMS,
  KITCHEN_ORDERS,
} from "../../../data/kitchenMockData";

function useKitchenState() {
  const [orders, setOrders] = useState(KITCHEN_ORDERS);

  const [menuItems, setMenuItems] = useState(KITCHEN_MENU_ITEMS);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const [timers, setTimers] = useState(() => {
    return KITCHEN_ORDERS.reduce((result, order) => {
      result[order.id] = order.elapsedSeconds || 0;

      return result;
    }, {});
  });

  const activeOrderIds = useMemo(() => {
    return orders
      .filter(
        (order) => order.status !== "completed" && order.status !== "cancelled",
      )
      .map((order) => order.id);
  }, [orders]);

  const activeOrderKey = activeOrderIds.join("|");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };

        activeOrderIds.forEach((id) => {
          next[id] = (next[id] || 0) + 1;
        });

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrderKey]);

  const updateItemStatus = (orderId, itemId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        const nextItems = order.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                kdsStatus: nextStatus,
              }
            : item,
        );

        const allServed = nextItems.every(
          (item) => item.kdsStatus === "served",
        );

        const hasReady = nextItems.some((item) => item.kdsStatus === "ready");

        return {
          ...order,

          items: nextItems,

          status: allServed ? "completed" : hasReady ? "ready" : "cooking",
        };
      }),
    );
  };

  const markItemReady = (order, item) => {
    updateItemStatus(order.id, item.id, "ready");

    toast.success(`Đã xong ${item.quantity}x ${item.name}`);
  };

  const markItemServed = (order, item) => {
    updateItemStatus(order.id, item.id, "served");

    toast.success(`Đã giao ${item.quantity}x ${item.name} cho phục vụ`);
  };

  const toggleMenuItemStock = (menuItemId) => {
    let changedItem = null;

    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== menuItemId) {
          return item;
        }

        const nextStatus =
          item.status === "out_of_stock" ? "in_stock" : "out_of_stock";

        changedItem = {
          ...item,
          status: nextStatus,
        };

        return changedItem;
      }),
    );

    if (changedItem) {
      toast.info(
        changedItem.status === "out_of_stock"
          ? `Đã báo hết món: ${changedItem.name}`
          : `Đã mở bán lại: ${changedItem.name}`,
      );
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;

      toast.info(next ? "Đã bật âm thanh KDS" : "Đã tắt âm thanh KDS");

      return next;
    });
  };

  return {
    orders,
    menuItems,

    timers,

    soundEnabled,

    markItemReady,
    markItemServed,

    toggleMenuItemStock,
    toggleSound,
  };
}

export default useKitchenState;
