import { Plus, Search } from "lucide-react";

import { useMemo, useState } from "react";

import styles from "./WaiterMenu.module.css";

const CATEGORIES = [
  {
    id: "all",
    label: "Tất cả món",
  },

  {
    id: "hu_tieu",
    label: "Hủ Tiếu",
  },

  {
    id: "khai_vi",
    label: "Khai Vị",
  },

  {
    id: "do_uong",
    label: "Đồ Uống",
  },

  {
    id: "trang_mieng",
    label: "Tráng Miệng",
  },

  {
    id: "mon_them",
    label: "Món Thêm",
  },

  {
    id: "combo",
    label: "Combo",
  },
];

function getFoodImage(item) {
  if (item.image) {
    return item.image;
  }

  switch (item.category) {
    case "hu_tieu":
      return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80";

    case "khai_vi":
      return "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=500&q=80";

    case "do_uong":
      return "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80";

    case "trang_mieng":
      return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80";

    case "mon_them":
      return "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80";

    default:
      return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80";
  }
}

function WaiterMenu({ menuItems, cart, onAddToCart }) {
  const [category, setCategory] = useState("all");

  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const categoryMatch = category === "all" || item.category === category;

      const searchMatch = !query || item.name.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [menuItems, category, search]);

  return (
    <main className={styles.menu}>
      <div className={styles.filters}>
        <div className={styles.categories}>
          {CATEGORIES.map((item) => (
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

        <div className={styles.search}>
          <Search size={16} />

          <input
            value={search}
            type="text"
            placeholder="Tìm tên món..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.grid}>
        {filteredItems.map((item) => {
          const inStock = item.status === "in_stock";

          const cartItem = cart.find(
            (cartItem) => cartItem.menuItem.id === item.id,
          );

          return (
            <article key={item.id} className={styles.menuItem}>
              <div className={styles.imageBox}>
                <img
                  src={getFoodImage(item)}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                />

                {!inStock && (
                  <div className={styles.outOverlay}>
                    <span>HẾT</span>
                  </div>
                )}

                {cartItem && (
                  <span className={styles.cartCount}>{cartItem.quantity}</span>
                )}
              </div>

              <div className={styles.menuInfo}>
                <div>
                  <h3>{item.name}</h3>

                  {item.description && <p>{item.description}</p>}

                  <strong>{item.price.toLocaleString("vi-VN")}đ</strong>
                </div>

                <div className={styles.addArea}>
                  <button
                    type="button"
                    disabled={!inStock}
                    onClick={() => onAddToCart(item)}
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className={styles.noData}>Không tìm thấy món phù hợp.</div>
      )}
    </main>
  );
}

export default WaiterMenu;
