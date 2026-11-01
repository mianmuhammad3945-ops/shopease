import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, titleCase } from "../utils/format.js";
import Stars from "./Stars.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-white transition hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="flex h-48 items-center justify-center p-4">
        <img src={product.image} alt={product.title} loading="lazy" className="max-h-full object-contain" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 border-t p-4">
        <span className="text-xs font-medium text-indigo-600">{titleCase(product.category)}</span>
        <Link to={`/product/${product.id}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-medium hover:text-indigo-600">
          {product.title}
        </Link>
        <Stars rate={product.rating.rate} count={product.rating.count} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <button
            onClick={() => addToCart(product)}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
