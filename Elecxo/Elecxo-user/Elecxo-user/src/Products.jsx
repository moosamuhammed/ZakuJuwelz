import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

// 🔑 CHANGE THIS PORT to your actual backend port
const API_BASE_URL = "http://13.62.225.195/api";

const ProductsPage = () => {
  const query = useQuery();
  const searchTerm = query.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        let url = `${API_BASE_URL}/product/getproduct`;

        if (searchTerm.trim()) {
          url = `${API_BASE_URL}/product/search?search=${encodeURIComponent(
            searchTerm.trim()
          )}`;
        }

        const res = await fetch(url);

        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
          const text = await res.text();
          console.error("Backend error response:", text);
          setError(`Failed to load products (status ${res.status})`);
          setProducts([]);
          setLoading(false);
          return;
        }

        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Expected JSON, got this instead:\n", text);
          setError("Server returned invalid response (not JSON)");
          setProducts([]);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!data.success) {
          setError("Failed to load products");
          setProducts([]);
          setLoading(false);
          return;
        }

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data.product)) {
          setProducts(data.product);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Cannot connect to server (is backend running?)");
      }

      setLoading(false);
    };

    fetchProducts();
  }, [searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-slate-100">
      <h1 className="text-2xl font-semibold mb-4">
        {searchTerm ? `Results for "${searchTerm}"` : "All Products"}
      </h1>

      {loading && <p className="text-slate-300">Loading products...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-slate-400">No products found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {products.map((p) => {
          // ✅ normalize stock safely (handles undefined / string / NaN)
          const rawStock = p.stock ?? 0;
          const stockValue = Number(rawStock);
          const safeStock = Number.isNaN(stockValue) ? 0 : stockValue;

          return (
            <div
              key={p._id}
              className={`bg-slate-900/60 border border-white/10 rounded-xl p-3 shadow-sm hover:shadow-sky-500/20 transition ${
                safeStock === 0 ? "opacity-70" : ""
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                onError={(e) => (e.target.src = "/no-image.png")}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h2 className="text-sm font-medium truncate">{p.name}</h2>

              {p.price && (
                <p className="text-xs text-emerald-400 mt-1 font-semibold">
                  ₹ {p.price}
                </p>
              )}

              {p.details && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {p.details}
                </p>
              )}

              {/* 🔹 Stock info */}
              <p
                className={`text-[11px] mt-2 font-semibold ${
                  safeStock > 0 ? "text-emerald-300" : "text-red-400"
                }`}
              >
                {safeStock > 0
                  ? `In Stock: ${safeStock}`
                  : "Out of Stock"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
