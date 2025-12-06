// src/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function CategoryPage() {
  const { id } = useParams(); // /category/:id
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ NEW: Navigate to product details
  const handleProductClick = (productId) => {
    if (!productId) return;
    navigate(`/product/${productId}`); // Change path if your route is different
  };

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Category ID from URL:", id);

      const res = await axios.get(
        `http://13.62.225.195/api/product/productbycategory/${id}`
      );

      if (res.data && res.data.success === false) {
        throw new Error(res.data.message || "Failed to load category.");
      }

      setCategory(res.data.category || null);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error in fetchCategoryData:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load category. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCategoryData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-300 text-sm">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-slate-900/80 border border-red-400/40 px-6 py-5 rounded-2xl shadow-lg text-center">
          <p className="text-red-300 text-sm mb-3">
            {error || "Category not found."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-full bg-slate-800 text-slate-100 text-xs sm:text-sm hover:bg-slate-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6 sm:mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs sm:text-sm hover:bg-slate-800/80 transition flex items-center gap-1.5"
          >
            <span className="text-lg -mt-[1px]">←</span>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            {category.image && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900/80 border border-slate-600/70 overflow-hidden flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore the best products in{" "}
                <span className="text-cyan-400">{category.name}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center text-xs sm:text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          {products.length} item{products.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="max-w-6xl mx-auto bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-6 md:p-7 shadow-2xl">
        {/* Optional description/filter row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Browse through handpicked items from this category. Click a product
            to view more details.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs text-slate-400">
              Showing {products.length} product
              {products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* PRODUCT GRID / EMPTY STATE */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-14 h-14 rounded-full border border-slate-700 flex items-center justify-center mb-3">
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-sm sm:text-base text-slate-300">
              No products found in this category yet.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Please check again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product, index) => {
              const description = product.description || product.details;

              return (
                <motion.div
                  key={product._id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group rounded-2xl bg-slate-900 border border-slate-700/70 overflow-hidden cursor-pointer flex flex-col"
                >
                  <div className="relative w-full pt-[75%] bg-slate-800/80 overflow-hidden">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>

                  <div className="px-3 sm:px-4 py-3 flex-1 flex flex-col">
                    <h2 className="text-xs sm:text-sm md:text-base font-medium text-slate-50 line-clamp-2 mb-1">
                      {product.name}
                    </h2>

                    {description && (
                      <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mb-2">
                        {description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-800">
                      {product.price !== undefined && (
                        <span className="text-sm sm:text-base font-semibold text-emerald-400">
                          ₹{Number(product.price).toLocaleString()}
                        </span>
                      )}

                      {/* ⭐ VIEW BUTTON → PRODUCT DETAILS */}
                      <button
                        onClick={() => handleProductClick(product._id)}
                        className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full border border-cyan-400/60 text-cyan-300 group-hover:bg-cyan-500/10 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
