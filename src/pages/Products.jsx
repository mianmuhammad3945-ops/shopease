import localProducts from "../data/products.json";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import Filters from "../components/Filters.jsx";
import { toPKR } from "../utils/format.js";

const emptyFilters = { categories: [], minPrice: "", maxPrice: "", minRating: "0" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [filters, setFilters] = useState(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [params] = useSearchParams();

   useEffect(() => {
    setProducts(localProducts);
    setLoading(false);
  }, []);
  // allow links like /?category=electronics
  useEffect(() => {
    const c = params.get("category");
    if (c) setFilters((f) => ({ ...f, categories: [c] }));
  }, [params]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);
  const maxPrice = useMemo(
    () => Math.ceil(Math.max(0, ...products.map((p) => toPKR(p.price))) / 500) * 500 || 1000,
    [products]
  );

  const visible = useMemo(() => {
    const min = filters.minPrice === "" ? 0 : Number(filters.minPrice);
    const max = filters.maxPrice === "" ? Infinity : Number(filters.maxPrice);
    const q = search.trim().toLowerCase();

    let list = products.filter((p) => {
      const price = toPKR(p.price);
      return (
        (!q || p.title.toLowerCase().includes(q)) &&
        (filters.categories.length === 0 || filters.categories.includes(p.category)) &&
        price >= min && price <= max &&
        p.rating.rate >= Number(filters.minRating)
      );
    });

    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "name-asc": (a, b) => a.title.localeCompare(b.title),
      "name-desc": (a, b) => b.title.localeCompare(a.title),
      rating: (a, b) => b.rating.rate - a.rating.rate,
      popular: (a, b) => b.rating.count - a.rating.count,
    };
    if (sorters[sort]) list = [...list].sort(sorters[sort]);
    return list;
  }, [products, search, sort, filters]);

  const reset = () => { setFilters(emptyFilters); setSearch(""); setSort("default"); };

  if (loading) return <p className="py-20 text-center text-slate-500">Loading products...</p>;
  if (error) return <p className="py-20 text-center font-medium text-red-600">{error}</p>;

  return (
    <div>
      <section className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 p-6 text-white sm:p-10">
        <h1 className="text-2xl font-extrabold sm:text-4xl">Everything you need, one click away</h1>
        <p className="mt-2 max-w-xl text-indigo-100">Browse, filter, add to cart and pay on delivery.</p>
      </section>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded-lg border bg-white px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2.5 focus:border-indigo-500 focus:outline-none"
          aria-label="Sort products"
        >
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Reviewed</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-lg border bg-white px-4 py-2.5 font-medium lg:hidden"
        >
          {showFilters ? "Hide filters" : "Show filters"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className={showFilters ? "block" : "hidden lg:block"}>
          <Filters categories={categories} filters={filters} setFilters={setFilters} onReset={reset} maxPrice={maxPrice} />
        </aside>

        <section>
          <p className="mb-3 text-sm text-slate-500">{visible.length} products found</p>
          {visible.length === 0 ? (
            <div className="rounded-xl border bg-white py-16 text-center">
              <p className="font-medium">No products match your filters.</p>
              <button onClick={reset} className="mt-3 text-indigo-600 underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
