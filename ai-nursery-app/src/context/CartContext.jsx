import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  /* CART ITEMS — persisted to localStorage */
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  /* QUANTITIES — persisted to localStorage (FF-8 fix) */
  const [quantities, setQuantities] = useState(() => {
    const saved = localStorage.getItem("cartQuantities");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("cartQuantities", JSON.stringify(quantities));
  }, [quantities]);

  /* ADD TO CART — prevents duplicates (FF-7 fix) */
  const addToCart = (plant) => {
    const exists = cart.find((item) => item.id === plant.id);

    if (exists) {
      /* If already in cart, increase quantity instead of adding duplicate */
      setQuantities((prev) => ({
        ...prev,
        [plant.id]: (prev[plant.id] || 1) + 1,
      }));
    } else {
      setCart((prev) => [...prev, { ...plant, quantity: 1 }]);
      setQuantities((prev) => ({ ...prev, [plant.id]: 1 }));
    }
  };

  /* REMOVE FROM CART */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  /* INCREASE QUANTITY */
  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  /* DECREASE QUANTITY */
  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  /* GET QUANTITY FOR ITEM */
  const getQty = (id) => quantities[id] || 1;

  /* TOTAL ITEM COUNT for badge */
  const cartCount = cart.reduce((acc, item) => acc + getQty(item.id), 0);

  /* CLEAR CART */
  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        quantities,
        cartCount,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        getQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};