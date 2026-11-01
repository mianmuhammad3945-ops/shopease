import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Enter your email and password.");
    const result = login(form);
    if (!result.ok) return setError(result.message);
    navigate("/");
  };

  const input = "w-full rounded-lg border px-3 py-3 focus:border-indigo-500 focus:outline-none";

  return (
    <div className="mx-auto mt-4 max-w-lg rounded-2xl border bg-white px-6 py-10 shadow-sm sm:px-10">
      {/* Logo in a circle + shop name */}
      <div className="flex flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-100 bg-white p-2 shadow">
          <img src="/pp1.jpeg" alt="ShopEase logo" className="h-full w-full object-contain" />
        </div>
        <p className="mt-3 text-2xl font-extrabold text-indigo-600">
          Shop<span className="text-slate-800">Ease</span>
        </p>
        <div className="mt-3 h-px w-full bg-slate-200" />
      </div>

      <h1 className="mt-8 text-2xl font-bold">Login</h1>
      <p className="mb-6 text-slate-500">Welcome back.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={input} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={input} />
        </div>
        <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account? <Link to="/signup" className="font-medium text-indigo-600 underline">Sign up</Link>
      </p>
    </div>
  );
}