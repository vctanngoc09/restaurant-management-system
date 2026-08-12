import { useState } from "react";

import { Search, Soup, ToggleLeft, ToggleRight } from "lucide-react";

import { QUICK_MENU_ITEMS } from "../../../../../data/adminDashboardMock";
import { formatCurrency } from "../../../../../utils/formatCurrency";

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

        <div className={styles.search}>
          <Search size={16} />

          <input
            type="text"
            placeholder="Tìm món nhanh..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.grid}>
        {filteredMenuItems.map((item) => {
          const inStock = item.status === "in_stock";

          return (
            <article key={item.id} className={styles.item}>
              <div className={styles.info}>
                <div className={styles.image}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <Soup size={22} />
                  )}
                </div>

                <div>
                  <strong>{item.name}</strong>

                  <span>{formatCurrency(item.price)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleStock(item.id)}
                className={inStock ? styles.available : styles.unavailable}
              >
                {inStock ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}

                {inStock ? "Sẵn sàng" : "Hết món"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default QuickMenuStock;
