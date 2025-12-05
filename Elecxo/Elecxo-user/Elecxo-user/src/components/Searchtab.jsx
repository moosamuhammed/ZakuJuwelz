import { useEffect, useRef, useState } from "react";
// If you're using react-router:
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000"; // change if needed

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate(); // optional, for navigation on click

  // Helper: highlight the typed part inside product name
  const highlightMatch = (name, q) => {
    if (!q) return name;
    const lowerName = name.toLowerCase();
    const lowerQ = q.toLowerCase();
    const index = lowerName.indexOf(lowerQ);
    if (index === -1) return name;

    const before = name.slice(0, index);
    const match = name.slice(index, index + q.length);
    const after = name.slice(index + q.length);

    return (
      <>
        {before}
        <span className="bg-yellow-200/70 text-slate-900 rounded px-0.5">
          {match}
        </span>
        {after}
      </>
    );
  };

  // Debounced search on query change
  useEffect(() => {
    const trimmed = query.trim();

    // Clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If query is empty, reset
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      setError(null);
      setLoading(false);
      return;
    }

    // Debounce: wait 300ms after user stops typing
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/product/search?q=${encodeURIComponent(trimmed)}`
        );

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log("SEARCH /product/search →", data);

        // Expect { success: true, products: [...] }
        if (!data.success) {
          throw new Error(data.message || "Search failed");
        }

        const list = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data.product)
          ? data.product
          : [];

        setResults(list);
        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setError("Error searching products");
        setResults([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (product) => {
    setQuery(product.name || "");
    setOpen(false);

    // If you have a product details page:
    // navigate(`/product/${product._id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    // If you have a search results page:
    // navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Input wrapped in a form for Enter key support */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0 || error) setOpen(true);
            }}
            placeholder="Search products..."
            className="w-full rounded-full border border-slate-500 bg-slate-900/80 py-2.5 pl-9 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
          />
          {loading && (
            <span className="absolute inset-y-0 right-3 flex items-center text-xs text-sky-300">
              Searching…
            </span>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl shadow-black/60 z-30 max-h-80 overflow-y-auto backdrop-blur-xl">
          {/* Info row */}
          {query.trim() && (
            <div className="flex items-center justify-between px-3 py-2 text-[11px] text-slate-400 border-b border-slate-800">
              <span>
                Results for{" "}
                <span className="font-semibold text-slate-100">
                  “{query.trim()}”
                </span>
              </span>
              <span className="hidden sm:inline">
                Press <span className="bg-slate-800 px-1 rounded">Enter</span>{" "}
                to search all
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-3 py-2 text-xs text-rose-400 border-b border-slate-800">
              {error}
            </div>
          )}

          {/* No results */}
          {!error && results.length === 0 && !loading && (
            <div className="px-3 py-3 text-xs text-slate-400">
              No products found for{" "}
              <span className="font-semibold text-slate-100">
                “{query.trim()}”
              </span>
            </div>
          )}

          {/* Results */}
          {!error &&
            results.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => handleSelect(product)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-slate-800/80 transition-colors"
              >
                {/* Thumbnail */}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-9 w-9 rounded-md object-cover flex-shrink-0 ring-1 ring-slate-700"
                  />
                )}

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-50 truncate">
                    {product.name
                      ? highlightMatch(product.name, query.trim())
                      : "Unnamed product"}
                  </div>
                  {product.details && (
                    <div className="text-[11px] text-slate-400 truncate">
                      {product.details}
                    </div>
                  )}
                </div>

                {/* Price */}
                {typeof product.price !== "undefined" && (
                  <div className="text-xs font-semibold text-emerald-300">
                    ₹{product.price}
                  </div>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
