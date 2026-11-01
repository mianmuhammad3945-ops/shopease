import { titleCase } from "../utils/format.js";

export default function Filters({ categories, filters, setFilters, onReset, maxPrice }) {
  const toggleCategory = (c) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c],
    }));

  const input = "w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

  return (
    <div className="space-y-6 rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Filters</h2>
        <button onClick={onReset} className="text-sm text-indigo-600 hover:underline">Reset all</button>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Category</h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(c)}
                onChange={() => toggleCategory(c)}
                className="h-4 w-4 accent-indigo-600"
              />
              {titleCase(c)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Price (Rs.)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number" min="0" placeholder="Min" className={input}
            value={filters.minPrice}
            onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
          />
          <span className="text-slate-400">-</span>
          <input
            type="number" min="0" placeholder="Max" className={input}
            value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          />
        </div>
        <input
          type="range" min="0" max={maxPrice} step="500"
          value={filters.maxPrice === "" ? maxPrice : filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          className="mt-3 w-full accent-indigo-600"
          aria-label="Maximum price"
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Minimum rating</h3>
        <select
          className={input}
          value={filters.minRating}
          onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))}
        >
          <option value="0">Any rating</option>
          <option value="4">4 stars & up</option>
          <option value="3">3 stars & up</option>
          <option value="2">2 stars & up</option>
        </select>
      </div>
    </div>
  );
}
