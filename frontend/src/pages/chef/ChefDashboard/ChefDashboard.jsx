import { useMemo, useState } from "react";

import useKitchenState from "../../../features/chef/hooks/useKitchenState";

import KitchenHeader from "../../../features/chef/components/KitchenHeader/KitchenHeader";
import KitchenFilters from "../../../features/chef/components/KitchenFilters/KitchenFilters";
import KitchenColumn from "../../../features/chef/components/KitchenColumn/KitchenColumn";
import OutOfStockModal from "../../../features/chef/components/OutOfStockModal/OutOfStockModal";

import styles from "./ChefDashboard.module.css";

function ChefDashboard() {
  const kitchen = useKitchenState();

  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);

  const activeOrders = useMemo(() => {
    return kitchen.orders.filter(
      (order) => order.status !== "completed" && order.status !== "cancelled",
    );
  }, [kitchen.orders]);

  const filteredOrders = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return activeOrders.filter((order) => {
      const matchType =
        orderTypeFilter === "all" || order.orderType === orderTypeFilter;

      if (!matchType) {
        return false;
      }

      if (!search) {
        return true;
      }

      const matchTable = (order.tableName || "").toLowerCase().includes(search);

      const matchId = order.id.toLowerCase().includes(search);

      const matchItem = order.items.some((item) =>
        item.name.toLowerCase().includes(search),
      );

      return matchTable || matchId || matchItem;
    });
  }, [activeOrders, orderTypeFilter, searchQuery]);

  const pendingOrders = useMemo(() => {
    return filteredOrders
      .map((order) => ({
        ...order,

        visibleItems: order.items.filter(
          (item) =>
            !item.kdsStatus ||
            item.kdsStatus === "pending" ||
            item.kdsStatus === "cooking",
        ),
      }))
      .filter((order) => order.visibleItems.length > 0);
  }, [filteredOrders]);

  const readyOrders = useMemo(() => {
    return filteredOrders
      .map((order) => ({
        ...order,

        visibleItems: order.items.filter((item) => item.kdsStatus === "ready"),
      }))
      .filter((order) => order.visibleItems.length > 0);
  }, [filteredOrders]);

  const pendingCount = pendingOrders.reduce(
    (total, order) =>
      total + order.visibleItems.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );

  const readyCount = readyOrders.reduce(
    (total, order) =>
      total + order.visibleItems.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );

  const outOfStockCount = kitchen.menuItems.filter(
    (item) => item.status === "out_of_stock",
  ).length;

  return (
    <div className={styles.chefPage}>
      <KitchenHeader
        pendingCount={pendingCount}
        readyCount={readyCount}
        outOfStockCount={outOfStockCount}
        soundEnabled={kitchen.soundEnabled}
        onToggleSound={kitchen.toggleSound}
        onOpenOutOfStock={() => setShowOutOfStockModal(true)}
      />

      <KitchenFilters
        activeOrders={activeOrders}
        orderTypeFilter={orderTypeFilter}
        onOrderTypeChange={setOrderTypeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className={styles.kitchenBoard}>
        <KitchenColumn
          type="pending"
          title="CHỜ CHẾ BIẾN"
          itemCount={pendingCount}
          orders={pendingOrders}
          timers={kitchen.timers}
          menuItems={kitchen.menuItems}
          onToggleStock={kitchen.toggleMenuItemStock}
          onItemAction={kitchen.markItemReady}
        />

        <KitchenColumn
          type="ready"
          title="ĐÃ XONG / CHỜ LẤY"
          itemCount={readyCount}
          orders={readyOrders}
          timers={kitchen.timers}
          menuItems={kitchen.menuItems}
          onToggleStock={kitchen.toggleMenuItemStock}
          onItemAction={kitchen.markItemServed}
        />
      </div>

      <OutOfStockModal
        open={showOutOfStockModal}
        menuItems={kitchen.menuItems}
        onToggleStock={kitchen.toggleMenuItemStock}
        onClose={() => setShowOutOfStockModal(false)}
      />
    </div>
  );
}

export default ChefDashboard;
