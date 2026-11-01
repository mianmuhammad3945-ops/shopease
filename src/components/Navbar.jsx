import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/pp1.jpeg" alt="ShopEase logo" className="h-9 w-auto" />
          <span className="text-2xl font-extrabold text-indigo-600">
            Shop<span className="text-slate-800">Ease</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium sm:gap-5">
          <Link to="/" className="hover:text-indigo-600">Shop</Link>

          {user ? (
            <>
              <span className="hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={logout} className="text-indigo-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="hover:text-indigo-600">Sign up</Link>
            </>
          )}

          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L20 7H6" />
            </svg>
            Cart
            {count > 0 && (
              <span className="rounded-full bg-white px-2 text-xs font-bold text-indigo-600">{count}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}