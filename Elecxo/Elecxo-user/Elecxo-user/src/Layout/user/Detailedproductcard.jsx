// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Truck, ShieldCheck } from "lucide-react";

function ProductDetail() {
  const { id } = useParams(); // /product/:id
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch single product
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ matches your backend: getproductbyid
      const res = await axios.get(
        `http://localhost:4000/product/getproduct/${id}`
      );

      if (!res.data?.success || !res.data.product) {
        setError("Product not found");
      } else {
        setProduct(res.data.product);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Unable to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add to Cart (reusable for both buttons)
  const addToCart = async (qty = 1) => {
    if (!product?._id) return false;

    try {
      setAdding(true);
      await axios.post(
        "http://localhost:4000/cart/addtocart",
        {
          productId: product._id,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart. Please try again.");
      return false;
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCartClick = async () => {
    const ok = await addToCart(1);
    if (ok) {
      navigate("/addtocart");
    }
  };

  const handleBuyNowClick = async () => {
    const ok = await addToCart(1);
    if (ok) {
      navigate("/checkout");
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 🧊 Skeleton loader
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="w-full max-w-5xl px-4">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-80 rounded-3xl bg-slate-800" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-slate-800 rounded-lg" />
              <div className="h-5 w-1/2 bg-slate-800 rounded-lg" />
              <div className="h-5 w-1/3 bg-slate-800 rounded-lg" />
              <div className="h-24 w-full bg-slate-800 rounded-2xl" />
              <div className="h-10 w-1/2 bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="text-center text-slate-100 space-y-4">
          <p className="text-xl font-semibold">{error || "Product not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // helpers for display
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice) || null;

  // ✅ normalize stock safely (handles undefined / string / NaN)
  const rawStock = product.stock ?? 0;
  const stockValue = Number(rawStock);
  const safeStock = Number.isNaN(stockValue) ? 0 : stockValue;
  const inStock = safeStock > 0;

  return (
    <div className="min-h-screen w-full bg-slate-950 flex justify-center">
      <div className="w-full max-w-6xl px-4 py-10">
        {/* Breadcrumb + back button */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-slate-700 bg-slate-900/80 text-[11px] hover:border-sky-500 hover:text-sky-300 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("/")}
              className="hover:text-sky-400 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-slate-200 line-clamp-1">
              {product.name}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            256-bit secure checkout
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* LEFT: Image & info pills */}
          <div className="space-y-4">
            <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-sky-500 via-purple-500 to-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.45)]">
              <div className="relative rounded-[1.4rem] overflow-hidden bg-slate-900/90 border border-white/10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 md:h-[22rem] object-cover transform hover:scale-105 transition-transform duration-300 ease-out"
                />
                {/* Floating stock tag */}
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full backdrop-blur-md border text-[11px] flex items-center gap-2
                    ${
                      inStock
                        ? "bg-black/50 border-emerald-400/60 text-emerald-100"
                        : "bg-black/60 border-red-400/60 text-red-100"
                    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      inStock ? "bg-emerald-400 animate-ping" : "bg-red-400"
                    }`}
                  />
                  {inStock ? `In Stock (${safeStock})` : "Out of Stock"}
                </div>
              </div>
            </div>

            {/* Small info pills */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl bg-slate-900/90 border border-sky-500/30 px-3 py-2 flex flex-col gap-1">
                <span className="text-slate-400">Category</span>
                <span className="text-slate-100 font-medium line-clamp-1">
                  {product.name || "General"}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-900/90 border border-purple-500/30 px-3 py-2 flex flex-col gap-1">
                <span className="text-slate-400">Brand</span>
                <span className="text-slate-100 font-medium line-clamp-1">
                  {product.brand || "zaku juwelz"}
                </span>
              </div>
              {/* <div className="rounded-2xl bg-slate-900/90 border border-emerald-500/30 px-3 py-2 flex flex-col gap-1">
                <span className="text-slate-400">SKU</span>
                <span className="text-slate-100 font-medium line-clamp-1">
                  {product.sku || "—"}
                </span>
              </div> */}
            </div>
          </div>

          {/* RIGHT: Details, pricing, actions */}
          <div className="space-y-6">
            {/* Title + badge */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-sky-500/40 px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-sky-200">
                  Featured Product
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-slate-400">
                {product.details ||
                  product.shortDescription ||
                  "Experience a premium quality product crafted with attention to detail and designed to elevate your everyday life."}
              </p>
            </div>

            {/* Rating & shipping perks */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{product.rating || "4.8"}</span>
                <span className="text-slate-500">
                  ({product.reviewsCount || "128"} reviews)
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              <div className="inline-flex items-center gap-1 text-slate-400">
                <Truck className="w-3 h-3 text-sky-400" />
                <span>Free standard delivery over ₹499</span>
              </div>
            </div>

            {/* Price block */}
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-emerald-300">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  {oldPrice && oldPrice > price && (
                    <span className="text-sm text-slate-500 line-through">
                      ₹{oldPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Inclusive of all taxes · 7-day return policy
                </p>
                {/* 🔹 Stock text under price */}
                <p
                  className={`text-xs mt-1 font-medium ${
                    inStock ? "text-emerald-300" : "text-red-400"
                  }`}
                >
                  {inStock
                    ? safeStock <= 5
                      ? `Hurry! Only ${safeStock} left in stock`
                      : `Available · ${safeStock} in stock`
                    : "Currently unavailable"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-slate-400">Estimated delivery</p>
                <p className="text-xs text-slate-100 font-medium">
                  3–5 business days
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBuyNowClick}
                disabled={adding || !inStock}
                className={`relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold
                  bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-slate-950 shadow-[0_18px_40px_rgba(79,70,229,0.75)]
                  hover:brightness-110 active:scale-[0.98] transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {inStock ? (adding ? "Processing..." : "Buy Now") : "Out of Stock"}
              </button>

              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={adding || !inStock}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold border border-slate-700 bg-slate-900/60 text-slate-100 hover:border-sky-500 hover:text-sky-100 hover:bg-slate-900 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {inStock ? "Add to Cart" : "Unavailable"}
              </button>
            </div>

            {/* Description */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/5 p-4 md:p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-100">
                Description
              </h2>
              <p className="text-xs md:text-sm leading-relaxed text-slate-300">
                {product.description ||
                  "This product is made with high-quality materials and designed for long-lasting performance. Whether you're using it at home, work, or on the go, it delivers reliable functionality and a premium feel. Carefully engineered to balance style and usability, it's a perfect addition to your daily essentials."}
              </p>
            </div>

            {/* Highlights */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-4 md:p-5">
              <h2 className="text-sm font-semibold text-slate-100 mb-3">
                Highlights
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Premium build quality
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Modern, minimal design
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Designed for everyday use
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  Great value for money
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
