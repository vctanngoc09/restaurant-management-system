import { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import WaiterOrderHeader from "../WaiterOrderHeader/WaiterOrderHeader";
import WaiterCart from "../WaiterCart/WaiterCart";
import WaiterMenu from "../WaiterMenu/WaiterMenu";
import WaiterMobileBar from "../WaiterMobileBar/WaiterMobileBar";

import styles from "./WaiterOrderView.module.css";

function WaiterOrderView({
  table,
  existingOrder,

  orderType,
  menuItems,

  currentUserName,

  onBack,
  onSendToKitchen,
  onRequestPayment,
}) {
  const [guestCount, setGuestCount] = useState(2);

  const [cart, setCart] = useState([]);

  const [orderNote, setOrderNote] = useState("");


  useEffect(() => {
    setCart([]);

    setGuestCount(table?.guestCount > 0 ? table.guestCount : 2);

    /*
     * Nếu bàn đã có Order:
     * lấy note hiện tại để hiển thị.
     *
     * Nếu Order mới:
     * reset note.
     */
    setOrderNote(existingOrder?.note || "");
  }, [table?.id, orderType, existingOrder?.id]);

  // ==================================================
  // ADD TO CART
  // ==================================================

  const addToCart = (menuItem) => {
    if (menuItem.status === "out_of_stock") {
      toast.warning(`${menuItem.name} hiện đã hết món.`);

      return;
    }

    setCart((prev) => {
      const found = prev.findIndex((item) => item.menuItem.id === menuItem.id);

      if (found !== -1) {
        return prev.map((item, index) =>
          index === found
            ? {
                ...item,

                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...prev,

        {
          menuItem,

          quantity: 1,

          note: "",
        },
      ];
    });
  };

  const updateQuantity = (index, delta) => {
    setCart((prev) => {
      const item = prev[index];

      if (!item) {
        return prev;
      }

      const quantity = item.quantity + delta;

      if (quantity <= 0) {
        return prev.filter((_, currentIndex) => currentIndex !== index);
      }

      return prev.map((current, currentIndex) =>
        currentIndex === index
          ? {
              ...current,
              quantity,
            }
          : current,
      );
    });
  };

  const updateNote = (index, note) => {
    setCart((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              note,
            }
          : item,
      ),
    );
  };

  const newSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0,
    );
  }, [cart]);

  const existingSubtotal = existingOrder?.subtotal || 0;

  const combinedSubtotal = existingSubtotal + newSubtotal;

  const vatAmount = Math.round(combinedSubtotal * 0.08);

  const totalAmount = combinedSubtotal + vatAmount;

  const newItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // ==================================================
  // SEND
  // ==================================================

  const handleSend = async () => {
    const result = await onSendToKitchen({
      guestCount,

      cartItems: cart,

      // =========================
      // ORDER NOTE
      // =========================

      orderNote: orderNote.trim(),
    });

    if (result) {
      setCart([]);

      /*
       * Nếu vừa tạo Order mới,
       * note đã được lưu Backend.
       *
       * Giữ lại để UI hiển thị
       * note hiện tại của Order.
       */
    }
  };

  return (
    <div className={styles.container}>
      <WaiterOrderHeader
        table={table}
        orderType={orderType}
        guestCount={guestCount}
        currentUserName={currentUserName}
        onGuestCountChange={setGuestCount}
        onBack={onBack}
      />

      <div className={styles.workspace}>
        <WaiterMenu menuItems={menuItems} cart={cart} onAddToCart={addToCart} />

        <WaiterCart
          table={table}
          orderType={orderType}
          existingOrder={existingOrder}
          cart={cart}
          // =========================
          // ORDER NOTE
          // =========================

          orderNote={orderNote}
          onOrderNoteChange={setOrderNote}
          subtotal={combinedSubtotal}
          vatAmount={vatAmount}
          totalAmount={totalAmount}
          onUpdateQuantity={updateQuantity}
          onUpdateNote={updateNote}
          onClear={() => setCart([])}
          onSend={handleSend}
          onRequestPayment={onRequestPayment}
        />
      </div>

      <WaiterMobileBar
        itemCount={newItemCount}
        totalAmount={totalAmount}
        hasExistingOrder={Boolean(existingOrder)}
        onSend={handleSend}
        onRequestPayment={onRequestPayment}
      />
    </div>
  );
}

export default WaiterOrderView;
