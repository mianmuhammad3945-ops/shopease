import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

function load() {
  try { return JSON.parse(localStorage.getItem("shopease_cart")) || []; }
  catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  // save cart on every change so it survives refresh
  useEffect(() => {
    try { localStorage.setItem("shopease_cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const addToCart = (p, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { id: p.id, title: p.title, price: p.price, image: p.image, qty }];
    });

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clearCart = () => setItems([]);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeItem, setQty, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
