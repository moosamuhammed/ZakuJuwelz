// src/pages/AddToCart.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Trash2, ShoppingCart } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";

function AddToCart() {
  // 🧭 useNavigate for SPA navigation
  const navigate = useNavigate();

  // ✅ cart and setCart come from Layout (Outlet context)
  const outletContext = useOutletContext() || {};
  const { cart = [], setCart = () => {} } = outletContext;

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchCart = useCallback(
    async () => {
      if (!token) return;

      try {
        setError("");
        const response = await axios.get("http://localhost:4000/cart/getcart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartData = response.data?.cart;
        const cartDoc = Array.isArray(cartData) ? cartData[0] : cartData;
        const items = cartDoc?.cartItems || [];

        setCart(items); // ✅ updates shared cart
        console.log("Cart fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [token, setCart]
  );

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view your cart.");
      setLoading(false);
      return;
    }

    fetchCart();
  }, [token, fetchCart]);

  // Remove item from cart
  const removeItem = async (itemId) => {
    if (!token) {
      setError("You must be logged in to modify your cart.");
      return;
    }

    setUpdatingId(itemId);
    setError("");

    try {
      await axios.delete(`http://localhost:4000/cart/delete/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh cart after deleting the item
      await fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Update quantity (+ / -)
  const updateQuantity = async (itemId, delta) => {
    if (!token) {
      setError("You must be logged in to modify your cart.");
      return;
    }

    try {
      const item = cart.find((i) => i._id === itemId);
      if (!item) return;

      const newQty = (item.quantity || 1) + delta;

      // If qty goes below 1, remove the item
      if (newQty < 1) {
        return removeItem(itemId);
      }

      setUpdatingId(itemId);
      setError("");

      await axios.patch(
        "http://localhost:4000/cart/update",
        {
          itemId,
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const safeCart = Array.isArray(cart) ? cart : [];

  const subtotal = safeCart.reduce((sum, item) => {
    const price = item?.productId?.price || 0;
    const qty = item?.quantity || 0;
    return sum + price * qty;
  }, 0);

  const handleCheckout = () => {
    if (!safeCart.length) return;
    // ✅ Use navigate so it works nicely with React Router
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/40">
              <ShoppingCart className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50 tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-sm text-slate-400">
                Review your items before checkout.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300">
            Items:{" "}
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500/90 text-[11px] font-semibold text-slate-950">
              {safeCart.length}
            </span>
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
          {/* Cart items */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">
                Cart items
              </span>
              <span className="text-xs text-slate-400">
                {safeCart.length > 0
                  ? `${safeCart.length} item${
                      safeCart.length > 1 ? "s" : ""
                    } in your cart`
                  : "No items yet"}
              </span>
            </div>

            <div className="divide-y divide-slate-800">
              {loading ? (
                <div className="px-4 sm:px-6 py-10 flex flex-col items-center justify-center text-slate-400 text-sm">
                  <div className="w-8 h-8 border-2 border-emerald-400/60 border-t-transparent rounded-full animate-spin mb-3" />
                  Loading your cart...
                </div>
              ) : safeCart.length === 0 ? (
                <div className="px-4 sm:px-6 py-10 text-center">
                  <p className="text-slate-300 text-sm mb-2">
                    Your cart is empty.
                  </p>
                  <p className="text-slate-500 text-xs">
                    Add some products to see them here.
                  </p>
                </div>
              ) : (
                safeCart.map((item) => (
                  <div
                    key={item?._id}
                    className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center"
                  >
                    {/* Image */}
                    <div className="flex-shrink-0 w-full sm:w-24">
                      <div className="w-full h-28 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                        <img
                          src={item?.productId?.image}
                          alt={item?.productId?.name || "Product image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info + controls */}
                    <div className="flex-1 w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Text */}
                      <div className="space-y-1">
                        <h2 className="text-sm sm:text-base font-medium text-slate-50">
                          {item?.productId?.name || item?.name || "Product"}
                        </h2>
                        {item?.productId?.brand && (
                          <p className="text-xs text-slate-400">
                            {item.productId.brand}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 mt-1">
                          {item?.productId?.category && (
                            <span className="px-2 py-1 rounded-full bg-slate-900 border border-slate-700">
                              {item.productId.category}
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
                            In stock
                          </span>
                        </div>
                      </div>

                      {/* Price , qty , delete */}
                      <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                        <div className="text-right w-full sm:w-auto">
                          <p className="text-sm sm:text-base font-semibold text-emerald-400">
                            ₹
                            {(item?.productId?.price || 0).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Qty: {item?.quantity || 1}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                          {/* Quantity */}
                          <div className="inline-flex items-center rounded-full bg-slate-900 border border-slate-700 px-1.5 py-1">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              disabled={loading || updatingId === item._id}
                              className="w-7 h-7 flex items-center justify-center text-slate-300 text-lg hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease quantity"
                            >
                              –
                            </button>
                            <span className="mx-2 text-xs text-slate-200 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              disabled={loading || updatingId === item._id}
                              className="w-7 h-7 flex items-center justify-center text-slate-300 text-lg hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item._id)}
                            disabled={loading || updatingId === item._id}
                            className="inline-flex items-center justify-center rounded-full p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 shadow-xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-50 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t border-emerald-500/30 pt-3 mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">
                    Estimated Total
                  </span>
                  <span className="text-lg font-semibold text-emerald-400">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!safeCart.length}
                className={`
                  mt-5 w-full inline-flex items-center justify-center
                  rounded-xl px-4 py-3 text-sm font-semibold
                  transition-all duration-200
                  ${
                    !safeCart.length
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                  }
                `}
              >
                {!safeCart.length
                  ? "Add items to continue"
                  : "Proceed to Checkout"}
              </button>

              <p className="mt-3 text-[11px] text-slate-400 text-center">
                By continuing, you agree to our Terms & Conditions and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToCart;
