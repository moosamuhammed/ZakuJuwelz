// src/pages/Checkout.jsx
import React, { useState, useMemo } from "react";
import { CreditCard, MapPin, Truck, ShieldCheck } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertBox from "../components/Alertbox";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://13.62.225.195/api";

function Checkout({ taxRate = 0.18, codFee = 50 }) {
  const outletContext = useOutletContext() || {};
  const { cart = [] } = outletContext;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [toast, setToast] = useState(null);

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const showToast = (type, title, message, duration = 3000) => {
    setToast({ type, title, message, duration });
    setTimeout(() => setToast(null), duration + 200);
  };

  const handleShippingChange = (field, value) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  // Normalize cart items for display
  const cartItems = useMemo(() => {
    const safeCart = Array.isArray(cart) ? cart : [];

    return safeCart.map((item) => ({
      id: item._id,
      name: item.productId?.name || "Product",
      meta: `Qty: ${item.quantity || 1}${
        item.productId?.brand ? ` · ${item.productId.brand}` : ""
      }`,
      // line total
      price: (item.productId?.price || 0) * (item.quantity || 1),
    }));
  }, [cart]);

  // Totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = selectedShipping === "express" ? 199 : 0;
  const paymentCharge = selectedPayment === "cod" ? codFee : 0;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shippingCost + paymentCharge + tax;

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      showToast(
        "warning",
        "Cart is empty",
        "Please add some items to your cart before placing an order."
      );
      return;
    }

    // Very basic validation for required fields
    if (
      !shipping.firstName ||
      !shipping.lastName ||
      !shipping.addressLine1 ||
      !shipping.city ||
      !shipping.state ||
      !shipping.postalCode ||
      !shipping.phone
    ) {
      showToast(
        "warning",
        "Missing details",
        "Please fill out all required shipping fields."
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast(
        "warning",
        "Login required",
        "Please log in before placing an order."
      );
      return;
    }

    // Build items array for backend from the original cart
    const safeCart = Array.isArray(cart) ? cart : [];
    const orderItems = safeCart.map((item) => ({
      // If productId is populated, use item.productId._id; otherwise assume it's already an id
      productId: item.productId?._id || item.productId,
      quantity: item.quantity || 1,
      // store unit price at time of order
      price: item.productId?.price || 0,
    }));

    const orderPayload = {
      items: orderItems,
      totalAmount: total,
      paymentMethod:
        selectedPayment === "cod"
          ? "COD"
          : selectedPayment === "upi"
          ? "UPI"
          : "Razorpay", // adjust if you use Stripe etc.
      shippingAddress: {
        fullName: `${shipping.firstName} ${shipping.lastName}`.trim(),
        phone: shipping.phone,
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2,
        city: shipping.city,
        state: shipping.state,
        postalCode: shipping.postalCode,
        country: "India",
      },
      // Optional metadata
      meta: {
        shippingMethod: selectedShipping,
        shippingCost,
        tax,
        paymentCharge,
      },
    };

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/orders/userorder`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order created:", data);
      showToast(
        "success",
        "Order placed",
        "Your order has been placed successfully."
      );

      // Redirect to My Orders after a short delay
      setTimeout(() => {
        navigate("/my-orders");
      }, 1000);
    } catch (err) {
      console.error("Place order error:", err);
      showToast(
        "error",
        "Order failed",
        err.response?.data?.message ||
          "Something went wrong while placing the order."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10 text-slate-100">
      {/* Toast */}
      {toast && (
        <AlertBox
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          position="top-right"
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-400/40 shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              <CreditCard className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Checkout
              </h1>
              <p className="text-sm text-slate-400">
                Complete your order and get your goodies delivered to you.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.35)]">
            <ShieldCheck className="w-4 h-4" />
            256-bit secure checkout
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3">
            {[
              { id: 1, label: "Shipping" },
              { id: 2, label: "Payment" },
              { id: 3, label: "Review" },
            ].map((s, index, arr) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;

              return (
                <div key={s.id} className="flex-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => setStep(s.id)}
                    className="flex items-center gap-2 group"
                  >
                    <div
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-200 ${
                        isActive
                          ? "bg-sky-500 text-slate-950 border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]"
                          : isCompleted
                          ? "bg-emerald-500 text-slate-950 border-emerald-400"
                          : "bg-slate-900 text-slate-400 border-slate-700 group-hover:border-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : s.id}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isActive
                          ? "text-sky-300"
                          : isCompleted
                          ? "text-emerald-300"
                          : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>

                  {index < arr.length - 1 && (
                    <div className="flex-1 h-[1px] mx-2 bg-gradient-to-r from-slate-700 via-slate-700 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
          {/* LEFT: Forms */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Shipping Address
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500">Step 1 of 3</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={shipping.firstName}
                    onChange={(e) =>
                      handleShippingChange("firstName", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Aarav"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={shipping.lastName}
                    onChange={(e) =>
                      handleShippingChange("lastName", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Sharma"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={shipping.addressLine1}
                    onChange={(e) =>
                      handleShippingChange("addressLine1", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Flat 502, Sunrise Residency"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={shipping.addressLine2}
                    onChange={(e) =>
                      handleShippingChange("addressLine2", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Near City Mall"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={shipping.city}
                    onChange={(e) =>
                      handleShippingChange("city", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={shipping.state}
                    onChange={(e) =>
                      handleShippingChange("state", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={shipping.postalCode}
                    onChange={(e) =>
                      handleShippingChange("postalCode", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="400001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) =>
                      handleShippingChange("phone", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Options */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Shipping Method
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500">
                  Choose how fast you want it
                </span>
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedShipping("standard")}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                    selectedShipping === "standard"
                      ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.45)]"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      Standard Delivery
                    </p>
                    <p className="text-xs text-slate-400">
                      4–7 business days · Free
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-300">
                    ₹0
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedShipping("express")}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                    selectedShipping === "express"
                      ? "border-sky-400 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.45)]"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      Express Delivery
                    </p>
                    <p className="text-xs text-slate-400">
                      1–2 business days · Recommended
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-sky-300">
                    ₹199
                  </span>
                </button>
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Payment
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500">Step 2 of 3</span>
              </div>

              <div className="grid gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedPayment("card")}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                    selectedPayment === "card"
                      ? "border-sky-400 bg-sky-500/10 shadow-[0_0_18px_rgba(56,189,248,0.5)]"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <span className="font-medium text-slate-100">
                    Credit / Debit Card
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Visa · MasterCard · Rupay
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment("upi")}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                    selectedPayment === "upi"
                      ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_18px_rgba(16,185,129,0.5)]"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <span className="font-medium text-slate-100">UPI</span>
                  <span className="text-[11px] text-slate-400">
                    GPay · PhonePe · Paytm
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment("cod")}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                    selectedPayment === "cod"
                      ? "border-slate-300 bg-slate-100/10"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <span className="font-medium text-slate-100">
                    Cash on Delivery
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Extra ₹{codFee} COD fee
                  </span>
                </button>
              </div>

              {selectedPayment === "card" && (
                <div className="grid gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                      placeholder="Name on card"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                        placeholder="MM / YY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment === "upi" && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    placeholder="yourname@upi"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    We&apos;ll send a collect request to your UPI app.
                  </p>
                </div>
              )}

              {selectedPayment === "cod" && (
                <p className="mt-2 text-[11px] text-slate-400">
                  Please keep exact change ready. COD is available only for
                  selected pin codes.
                </p>
              )}
            </section>
          </div>

          {/* RIGHT: Order Summary */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-sky-500/40 bg-slate-900/90 shadow-[0_18px_50px_rgba(15,23,42,0.9)] p-5 sm:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300 mb-4 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400" />
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Your cart is empty. Add something to get started.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm text-slate-100">{item.name}</p>
                        {item.meta && (
                          <p className="text-[11px] text-slate-500">
                            {item.meta}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-100">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-700 pt-3 mt-2 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "Free"
                      : `₹${shippingCost.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Tax ({Math.round(taxRate * 100)}%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>

                {paymentCharge > 0 && (
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>COD Fee</span>
                    <span>₹{paymentCharge.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="border-t border-slate-700 pt-3 mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-100">
                    Total
                  </span>
                  <span className="text-xl font-semibold text-sky-400">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                className={`
                  mt-5 w-full inline-flex items-center justify-center
                  rounded-xl px-4 py-3 text-sm font-semibold
                  bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
                  text-slate-950
                  shadow-[0_18px_40px_rgba(79,70,229,0.75)]
                  hover:brightness-110
                  active:scale-[0.98]
                  transition-all duration-200
                  ${
                    cartItems.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                {cartItems.length === 0
                  ? "Add items to place order"
                  : "Place Order Securely"}
              </button>

              <p className="mt-3 text-[11px] text-slate-500 text-center">
                By placing your order, you agree to our Terms & Conditions and
                Privacy Policy.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
