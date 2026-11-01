import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { API_URL, formatPrice, titleCase } from "../utils/format.js";
import Stars from "../components/Stars.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(null); setError("");
    fetch(`${API_URL}/products/${id}`)
      .then((r) => r.json())
      .then((d) => (d && d.id ? setProduct(d) : setError("Product not found.")))
      .catch(() => setError("Could not load this product."));
  }, [id]);

  if (error) return <p className="py-20 text-center text-red-600">{error}</p>;
  if (!product) return <p className="py-20 text-center text-slate-500">Loading...</p>;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div>
      <Link to="/" className="text-sm text-indigo-600 hover:underline">&larr; Back to shop</Link>
      <div className="mt-4 grid gap-8 rounded-2xl border bg-white p-6 md:grid-cols-2">
        <div className="flex items-center justify-center p-4">
          <img src={product.image} alt={product.title} className="max-h-96 object-contain" />
        </div>
        <div className="space-y-4">
          <span className="text-sm font-medium text-indigo-600">{titleCase(product.category)}</span>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <Stars rate={product.rating.rate} count={product.rating.count} />
          <p className="text-3xl font-extrabold">{formatPrice(product.price)}</p>
          <p className="leading-relaxed text-slate-600">{product.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-lg" aria-label="Decrease quantity">-</button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-lg" aria-label="Increase quantity">+</button>
            </div>
            <button onClick={handleAdd} className="flex-1 rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">
              {added ? "Added!" : "Add to Cart"}
            </button>
          </div>
          <button
            onClick={() => { addToCart(product, qty); navigate("/cart"); }}
            className="w-full rounded-lg border-2 border-indigo-600 py-3 font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
