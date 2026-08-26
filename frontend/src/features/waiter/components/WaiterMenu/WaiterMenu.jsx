import { ImageIcon, Plus, Search } from "lucide-react";

import { useMemo, useState } from "react";

import styles from "./WaiterMenu.module.css";

function WaiterMenu({ menuItems, cart, onAddToCart }) {
  const [category, setCategory] = useState("all");

  const [search, setSearch] = useState("");

  // ==================================================
  // CATEGORIES
  // TẠO TỪ PRODUCT DATA BACKEND
  // ==================================================

  const categories = useMemo(() => {
    const categoryMap = new Map();

    menuItems.forEach((item) => {
      if (item.categoryId && item.categoryName) {
        categoryMap.set(
          String(item.categoryId),

          {
            id: String(item.categoryId),

            label: item.categoryName,
          },
        );
      }
    });

    return [
      {
        id: "all",

        label: "Tất cả món",
      },

      ...Array.from(categoryMap.values()),
    ];
  }, [menuItems]);

  // ==================================================
  // FILTER MENU
  // ==================================================

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      // =========================
      // CATEGORY
      // =========================

      const categoryMatch =
        category === "all" || String(item.categoryId) === category;

      // =========================
      // SEARCH
      // =========================

      const searchMatch = !query || item.name.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [menuItems, category, search]);

  return (
    <main className={styles.menu}>
      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className={styles.filters}>
        {/* CATEGORY */}

        <div className={styles.categories}>
          {categories.map((item) => (
            <button
              type="button"
              key={item.id}
              className={category === item.id ? styles.categoryActive : ""}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* SEARCH */}

        <div className={styles.search}>
          <Search size={16} />

          <input
            value={search}
            type="text"
            placeholder={"Tìm tên món..."}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {/* ==================================================
          MENU GRID
      ================================================== */}

      <div className={styles.grid}>
        {filteredItems.map((item) => {
          const inStock = item.status === "in_stock";

          const cartItem = cart.find(
            (cartItem) => cartItem.menuItem.id === item.id,
          );

          return (
            <article key={item.id} className={styles.menuItem}>
              {/* =========================
      IMAGE
  ========================= */}

              <div className={styles.imageBox}>
                {item.urlImg ? (
                  <img
                    src={item.urlImg}
                    alt={item.name}
                    className={!inStock ? styles.outOfStockImage : ""}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <ImageIcon size={34} />
                  </div>
                )}

                {/* STOCK BADGE */}

                <span
                  className={`${styles.stockBadge} ${
                    inStock ? styles.availableBadge : styles.outOfStockBadge
                  }`}
                >
                  <i />

                  {inStock ? "Còn món" : "Hết món"}
                </span>

                {/* CART COUNT */}

                {cartItem && (
                  <span className={styles.cartCount}>{cartItem.quantity}x</span>
                )}
              </div>

              {/* =========================
      INFO
  ========================= */}

              <div className={styles.menuInfo}>
                <div className={styles.menuText}>
                  <h3 title={item.name}>{item.name}</h3>

                  <p>{item.categoryName}</p>
                </div>

                {/* PRICE + ADD */}

                <div className={styles.menuFooter}>
                  <strong className={styles.price}>
                    {item.price.toLocaleString("vi-VN")}đ
                  </strong>

                  <button
                    type="button"
                    className={styles.addButton}
                    disabled={!inStock}
                    title={inStock ? `Thêm ${item.name}` : "Món hiện đã hết"}
                    onClick={() => onAddToCart(item)}
                  >
                    <Plus size={19} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ==================================================
          EMPTY
      ================================================== */}

      {filteredItems.length === 0 && (
        <div className={styles.noData}>Không tìm thấy món phù hợp.</div>
      )}
    </main>
  );
}

export default WaiterMenu;
