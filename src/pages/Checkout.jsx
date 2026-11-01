import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";

const initial = { name: "", email: "", phone: "", address: "", city: "", postal: "", note: "", payment: "cod" };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 3) e.name = "Enter your full name (at least 3 letters).";
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email or leave it empty.";
  if (!/^(\+92|0)?3\d{9}$/.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid mobile number, e.g. 0300 1234567.";
  if (f.address.trim().length < 10) e.address = "Enter your full address (house, street, area).";
  if (f.city.trim().length < 2) e.city = "Enter your city.";
  return e;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    const order = {
      id: "SE" + Date.now().toString().slice(-8),
      date: new Date().toLocaleString(),
      customer: form,
      items,
      total,
    };
    try {
      const old = JSON.parse(localStorage.getItem("shopease_orders")) || [];
      localStorage.setItem("shopease_orders", JSON.stringify([order, ...old]));
      localStorage.setItem("shopease_last_order", JSON.stringify(order));
    } catch {}
    clearCart();
    navigate("/order-success", { replace: true });
  };

  const field = (name, label, props = {}) => (
    <div className={props.wide ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">{label}</label>
      {props.textarea ? (
        <textarea id={name} name={name} rows="3" value={form[name]} onChange={handle} placeholder={props.placeholder}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${errors[name] ? "border-red-500" : "focus:border-indigo-500"}`} />
      ) : (
        <input id={name} name={name} type={props.type || "text"} value={form[name]} onChange={handle} placeholder={props.placeholder}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${errors[name] ? "border-red-500" : "focus:border-indigo-500"}`} />
      )}
      {errors[name] && <p className="mt-1 text-sm text-red-600" role="alert">{errors[name]}</p>}
    </div>
  );

  return (
    <div>
      <Link to="/cart" className="text-sm text-indigo-600 hover:underline">&larr; Back to cart</Link>
      <h1 className="my-4 text-2xl font-bold">Checkout</h1>

      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 text-lg font-bold">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", "Full name", { placeholder: "Ali Khan" })}
            {field("phone", "Phone number", { type: "tel", placeholder: "0300 1234567" })}
            {field("email", "Email (optional)", { type: "email", placeholder: "you@example.com", wide: true })}
            {field("address", "Full address", { textarea: true, wide: true, placeholder: "House #, street, area" })}
            {field("city", "City", { placeholder: "Lahore" })}
            {field("postal", "Postal code (optional)", { placeholder: "54000" })}
            {field("note", "Order note (optional)", { textarea: true, wide: true, placeholder: "Anything the rider should know" })}
          </div>

          <h2 className="mb-3 mt-6 text-lg font-bold">Payment</h2>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-indigo-600 bg-indigo-50 p-3">
            <input type="radio" name="payment" value="cod" checked readOnly className="accent-indigo-600" />
            <span className="font-medium">Cash on Delivery</span>
            <span className="text-sm text-slate-500">Pay when your order arrives</span>
          </label>
        </div>

        <aside className="h-fit rounded-xl border bg-white p-5">
          <h2 className="mb-3 text-lg font-bold">Your order</h2>
          <ul className="max-h-60 space-y-2 overflow-auto text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="line-clamp-1">{i.title} x {i.qty}</span>
                <span className="shrink-0">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <button type="submit" className="mt-5 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">
            Place Order
          </button>
        </aside>
      </form>
    </div>
  );
}
