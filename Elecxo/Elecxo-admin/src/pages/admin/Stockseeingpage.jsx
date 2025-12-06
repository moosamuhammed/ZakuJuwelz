// Stocks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://13.62.225.195/api/stock";

export default function Stocks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const url = `${API_BASE_URL}/allstock`;
      console.log("Calling:", url);

      const res = await axios.get(url);
      console.log("GET /allstock:", res.data);

      if (!Array.isArray(res.data)) {
        throw new Error("Server response is not an array");
      }

      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStock = async (id, amount) => {
    try {
      setSavingId(id);
      setError("");

      const res = await axios.patch(`${API_BASE_URL}/updatestock/${id}`, {
        amount,
      });

      console.log("PATCH /updatestock:", res.data);
      const { stock } = res.data;

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock } : p))
      );
    } catch (err) {
      console.error("Error updating stock:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update stock"
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleSetStock = async (id) => {
    const value = window.prompt("Enter new stock value:");
    if (value === null) return;

    const stock = Number(value);
    if (Number.isNaN(stock) || stock < 0) {
      alert("Invalid stock number");
      return;
    }

    try {
      setSavingId(id);
      setError("");

      const res = await axios.put(`${API_BASE_URL}/setstock/${id}`, {
        stock,
      });

      console.log("PUT /setstock:", res.data);
      const { product } = res.data;

      setProducts((prev) => prev.map((p) => (p._id === id ? product : p)));
    } catch (err) {
      console.error("Error setting stock:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to set stock"
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-6 text-slate-50">
      {/* Glow accents */}
      <div className="pointer-events-none fixed inset-0 opacity-40 -z-10">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-[-4rem] right-[-3rem] h-40 w-40 rounded-full bg-amber-400/25 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto bg-slate-950/70 border border-slate-800/80 rounded-2xl shadow-[0_22px_55px_rgba(0,0,0,0.9)] p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-200/80">
              Inventory · Stocks
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold text-amber-50 tracking-tight">
              Stock Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Adjust and monitor stock levels across your jewellery collection.
            </p>
          </div>

          <button
            onClick={fetchProducts}
            className="self-start sm:self-auto px-4 py-2 text-xs sm:text-sm rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-medium shadow-md shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-300 transition-all duration-200"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-3 p-3 text-sm rounded-xl border border-rose-500/50 bg-rose-950/70 text-rose-100 shadow-md shadow-rose-900/40">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm sm:text-base text-slate-200 mt-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Loading stock data…
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="space-y-3 md:hidden mt-2">
              {products.map((p) => {
                const stockNum = Number(p.stock ?? 0);
                const lowStock = stockNum >= 0 && stockNum <= 5;

                return (
                  <div
                    key={p._id}
                    className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/90 p-3 shadow-[0_14px_35px_rgba(0,0,0,0.85)] flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h2 className="font-medium text-sm text-amber-50 line-clamp-2">
                          {p.name}
                        </h2>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          ID: <span className="font-mono">{p._id.slice(0, 6)}...</span>
                        </p>
                      </div>

                      <span
                        className={`text-[11px] px-2 py-1 rounded-full border ${
                          lowStock
                            ? "border-rose-400/70 bg-rose-950/60 text-rose-100"
                            : "border-emerald-400/70 bg-emerald-950/40 text-emerald-100"
                        }`}
                      >
                        Stock:{" "}
                        <span className="font-semibold tracking-wide">
                          {p.stock}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end mt-1">
                      <button
                        disabled={savingId === p._id}
                        onClick={() => handleUpdateStock(p._id, -1)}
                        className="px-3 py-1 text-[11px] rounded-full bg-rose-950/70 border border-rose-500/70 text-rose-100 hover:bg-rose-500 hover:text-slate-950 transition-all duration-200 disabled:opacity-50"
                      >
                        -1
                      </button>
                      <button
                        disabled={savingId === p._id}
                        onClick={() => handleUpdateStock(p._id, +1)}
                        className="px-3 py-1 text-[11px] rounded-full bg-emerald-950/70 border border-emerald-400/70 text-emerald-100 hover:bg-emerald-400 hover:text-slate-950 transition-all duration-200 disabled:opacity-50"
                      >
                        +1
                      </button>
                      <button
                        disabled={savingId === p._id}
                        onClick={() => handleSetStock(p._id)}
                        className="px-4 py-1 text-[11px] rounded-full bg-amber-400 text-slate-950 font-medium border border-amber-300/80 hover:bg-amber-300 transition-all duration-200 disabled:opacity-50"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                );
              })}

              {products.length === 0 && (
                <p className="text-center text-slate-300 text-sm py-4">
                  No products found.
                </p>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto mt-4">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-amber-200 uppercase tracking-[0.18em]">
                        Product
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-amber-200 uppercase tracking-[0.18em]">
                        Stock
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-amber-200 uppercase tracking-[0.18em]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const stockNum = Number(p.stock ?? 0);
                      const lowStock = stockNum >= 0 && stockNum <= 5;

                      return (
                        <tr
                          key={p._id}
                          className="border-t border-slate-800/80 hover:bg-slate-900/70 transition-colors"
                        >
                          <td className="px-4 py-3 align-middle">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-amber-50">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {p._id}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right align-middle">
                            <span
                              className={`inline-flex items-center justify-end text-xs px-3 py-1 rounded-full border ${
                                lowStock
                                  ? "border-rose-400/70 bg-rose-950/60 text-rose-100"
                                  : "border-emerald-400/70 bg-emerald-950/40 text-emerald-100"
                              }`}
                            >
                              {p.stock}
                              {lowStock && (
                                <span className="ml-2 text-[10px] uppercase tracking-wide">
                                  Low
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right align-middle space-x-2">
                            <button
                              disabled={savingId === p._id}
                              onClick={() => handleUpdateStock(p._id, -1)}
                              className="px-3 py-1 rounded-full bg-rose-950/70 border border-rose-500/70 text-rose-100 text-xs hover:bg-rose-500 hover:text-slate-950 transition-all duration-200 disabled:opacity-50"
                            >
                              -1
                            </button>
                            <button
                              disabled={savingId === p._id}
                              onClick={() => handleUpdateStock(p._id, +1)}
                              className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/70 text-emerald-100 text-xs hover:bg-emerald-400 hover:text-slate-950 transition-all duration-200 disabled:opacity-50"
                            >
                              +1
                            </button>
                            <button
                              disabled={savingId === p._id}
                              onClick={() => handleSetStock(p._id)}
                              className="px-4 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-medium border border-amber-300/80 hover:bg-amber-300 transition-all duration-200 disabled:opacity-50"
                            >
                              Set
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {products.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-6 text-center text-slate-300 text-sm"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
