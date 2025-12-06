// src/AdminStockPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AdminStockPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); 
  const [sortBy, setSortBy] = useState("name"); 
  const [sortDir, setSortDir] = useState("asc"); 

  const LOW_STOCK_THRESHOLD = 5;

  //  Fetch all products with stock
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      
      const res = await axios.get(
        "http://13.62.225.195/api/product/all" 
      );

      if (res.data && res.data.success === false) {
        throw new Error(res.data.message || "Failed to load products.");
      }

      // Support both: res.data.products OR res.data
      const data = res.data.products || res.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load products. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //  Filter + search + sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search by name or category
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const category =
          typeof p.category === "string"
            ? p.category.toLowerCase()
            : p.category?.name?.toLowerCase() || "";
        return name.includes(q) || category.includes(q);
      });
    }

    // Stock filter
    list = list.filter((p) => {
      const stock = Number(p.stock ?? p.quantity ?? 0);

      if (stockFilter === "in") return stock > 0;
      if (stockFilter === "out") return stock <= 0;
      if (stockFilter === "low") return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
      return true; // all
    });

    // Sorting
    list.sort((a, b) => {
      let valA;
      let valB;

      if (sortBy === "name") {
        valA = a.name?.toLowerCase() || "";
        valB = b.name?.toLowerCase() || "";
      } else if (sortBy === "stock") {
        valA = Number(a.stock ?? a.quantity ?? 0);
        valB = Number(b.stock ?? b.quantity ?? 0);
      } else if (sortBy === "price") {
        valA = Number(a.price ?? 0);
        valB = Number(b.price ?? 0);
      } else {
        valA = "";
        valB = "";
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [products, search, stockFilter, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return "Out of stock";
    if (stock <= LOW_STOCK_THRESHOLD) return "Low stock";
    return "In stock";
  };

  const getStockBadgeClasses = (stock) => {
    if (stock <= 0)
      return "bg-red-500/10 text-red-300 border-red-500/40";
    if (stock <= LOW_STOCK_THRESHOLD)
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/40";
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-300 text-sm">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-slate-900/80 border border-red-400/40 px-6 py-5 rounded-2xl shadow-lg text-center">
          <p className="text-red-300 text-sm mb-3">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchProducts}
              className="px-4 py-2 rounded-full bg-slate-800 text-slate-100 text-xs sm:text-sm hover:bg-slate-700 transition"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-full border border-slate-600 text-slate-200 text-xs sm:text-sm hover:bg-slate-800 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs sm:text-sm hover:bg-slate-800/80 transition flex items-center gap-1.5"
            >
              <span className="text-lg -mt-[1px]">←</span>
              <span>Back</span>
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide">
                Stock Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                View and monitor product inventory across your store.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs sm:text-sm text-slate-400">
              Total products:{" "}
              <span className="text-cyan-300 font-medium">
                {products.length}
              </span>
            </span>
            <span className="text-[11px] text-slate-500">
              Showing {filteredProducts.length} after filters.
            </span>
          </div>
        </div>

        {/* CONTROLS + TABLE CARD */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
          {/* CONTROLS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 sm:mb-5">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by product or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl bg-slate-950/60 border border-slate-700 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-end">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="rounded-2xl bg-slate-950/60 border border-slate-700 px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
              >
                <option value="all">All stock</option>
                <option value="in">In stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl bg-slate-950/60 border border-slate-700 px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
              >
                <option value="name">Sort by name</option>
                <option value="stock">Sort by stock</option>
                <option value="price">Sort by price</option>
              </select>

              <button
                onClick={() =>
                  setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="rounded-2xl bg-slate-950/60 border border-slate-700 px-3 py-2 text-xs sm:text-sm text-slate-100 hover:bg-slate-800/80 transition"
              >
                {sortDir === "asc" ? "▲ Asc" : "▼ Desc"}
              </button>
            </div>
          </div>

          {/* TABLE */}
          {filteredProducts.length === 0 ? (
            <div className="py-10 flex flex-col items-center">
              <p className="text-sm sm:text-base text-slate-300">
                No products match your current filters.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing the search or changing stock filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-slate-900/90 border-b border-slate-800/80">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left font-medium text-slate-400">
                      Product
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left font-medium text-slate-400">
                      Category
                    </th>
                    <th
                      className="px-3 sm:px-4 py-3 text-right font-medium text-slate-400 cursor-pointer"
                      onClick={() => toggleSort("price")}
                    >
                      Price
                    </th>
                    <th
                      className="px-3 sm:px-4 py-3 text-right font-medium text-slate-400 cursor-pointer"
                      onClick={() => toggleSort("stock")}
                    >
                      Stock
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-right font-medium text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map((p, index) => {
                    const stock = Number(p.stock ?? p.quantity ?? 0);
                    const categoryName =
                      typeof p.category === "string"
                        ? p.category
                        : p.category?.name || "—";

                    return (
                      <motion.tr
                        key={p._id || index}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.02 }}
                        className="bg-slate-900/60 hover:bg-slate-800/60 transition"
                      >
                        <td className="px-3 sm:px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.image && (
                              <div className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-950/70 border border-slate-700/70 overflow-hidden items-center justify-center">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-contain p-1.5"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-100 line-clamp-1">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {p.sku || p._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-slate-300">
                          {categoryName}
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-right text-slate-200">
                          {p.price !== undefined ? (
                            <span>₹{Number(p.price).toLocaleString()}</span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-right text-slate-200">
                          {stock}
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] sm:text-xs ${getStockBadgeClasses(
                              stock
                            )}`}
                          >
                            {getStockStatus(stock)}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminStockPage;
