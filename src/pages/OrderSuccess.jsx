import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format.js";

export default function OrderSuccess() {
  let order = null;
  try { order = JSON.parse(localStorage.getItem("shopease_last_order")); } catch {}

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p>No recent order found.</p>
        <Link to="/" className="mt-3 inline-block text-indigo-600 underline">Go to shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 text-center sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">✓</div>
      <h1 className="mt-4 text-2xl font-bold">Order confirmed!</h1>
      <p className="mt-1 text-slate-600">Thank you, {order.customer.name}. We will call you on {order.customer.phone} to confirm.</p>

      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm">
        <p><b>Order ID:</b> {order.id}</p>
        <p><b>Date:</b> {order.date}</p>
        <p><b>Deliver to:</b> {order.customer.address}, {order.customer.city}</p>
        <p><b>Payment:</b> Cash on Delivery</p>
        <ul className="my-3 space-y-1 border-y py-3">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="line-clamp-1">{i.title} x {i.qty}</span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between text-base font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></p>
      </div>

      <Link to="/" className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
        Continue shopping
      </Link>
    </div>
  );
}
