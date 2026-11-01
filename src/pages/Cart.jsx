import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";

export default function Cart() {
  const { items, setQty, removeItem, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Add something you like and it will show up here.</p>
        <Link to="/" className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-600 hover:underline">Clear cart</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.id} className="flex gap-4 rounded-xl border bg-white p-4">
              <img src={i.image} alt={i.title} className="h-24 w-24 shrink-0 object-contain" />
              <div className="flex flex-1 flex-col gap-2">
                <Link to={`/product/${i.id}`} className="line-clamp-2 font-medium hover:text-indigo-600">{i.title}</Link>
                <span className="font-bold">{formatPrice(i.price)}</span>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center rounded-lg border">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="px-3 py-1 text-lg" aria-label="Decrease quantity">-</button>
                    <span className="w-8 text-center">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="px-3 py-1 text-lg" aria-label="Increase quantity">+</button>
                  </div>
                  <span className="text-sm text-slate-500">Subtotal: {formatPrice(i.price * i.qty)}</span>
                  <button onClick={() => removeItem(i.id)} className="text-sm text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border bg-white p-5">
          <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
          <div className="flex justify-between py-1 text-sm"><span>Items total</span><span>{formatPrice(total)}</span></div>
          <div className="flex justify-between py-1 text-sm"><span>Delivery</span><span className="text-green-600">Free</span></div>
          <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <Link to="/checkout" className="mt-5 block rounded-lg bg-indigo-600 py-3 text-center font-semibold text-white hover:bg-indigo-700">
            Confirm Order
          </Link>
          <Link to="/" className="mt-3 block text-center text-sm text-indigo-600 hover:underline">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
