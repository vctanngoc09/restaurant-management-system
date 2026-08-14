import { useState } from "react";

import { Soup } from "lucide-react";

import StockToggleButton from "../../../../../components/common/StockToggleButton";

import { QUICK_MENU_ITEMS } from "../../../../../data/adminDashboardMock";
import { formatCurrency } from "../../../../../utils/formatCurrency";
import SearchInput from "../../../../../components/common/SearchInput/SearchInput";
import styles from "./QuickMenuStock.module.css";

function QuickMenuStock() {
  const [searchQuery, setSearchQuery] = useState("");

  const [menuItems, setMenuItems] = useState(QUICK_MENU_ITEMS);

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleStock = (menuId) => {
    setMenuItems((currentItems) =>
      currentItems.map((item) =>
        item.id === menuId
          ? {
              ...item,

              status: item.status === "in_stock" ? "out_of_stock" : "in_stock",
            }
          : item,
      ),
    );
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2>Bật / Tắt Tình Trạng Món Tại Bếp (Nhanh)</h2>

          <p>
            Đồng bộ tức thì trạng thái [Còn món / Hết món] tới Bếp & Thu Ngân
          </p>
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm món nhanh..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.grid}>
          {filteredMenuItems.map((item) => (
              <article
                  key={item.id}
                  className={styles.item}
              >
                  <div className={styles.info}>
                      <div className={styles.image}>
                          {item.image ? (
                              <img
                                  src={item.image}
                                  alt={item.name}
                              />
                          ) : (
                              <Soup size={22} />
                          )}
                      </div>

                      <div>
                          <strong>{item.name}</strong>

                          <span>
          {formatCurrency(item.price)}
        </span>
                      </div>
                  </div>

                  <StockToggleButton
                      status={item.status}
                      onClick={() =>
                          handleToggleStock(item.id)
                      }
                  />
              </article>
          ))}
      </div>
    </section>
  );
}

export default QuickMenuStock;
