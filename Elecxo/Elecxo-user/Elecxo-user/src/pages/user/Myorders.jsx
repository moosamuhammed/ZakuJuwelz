// src/pages/user/Myorders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://13.62.225.195/api";

export default function Myorders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view your orders.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.response?.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
      } else {
        setError("Failed to load your orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* PAGE TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-amber-300">My Orders</h1>
          <p className="text-sm text-slate-400">
            Track all your jewellery orders.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-slate-300">Loading your orders...</p>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-red-400 mb-3">{error}</p>
        )}

        {/* NO ORDERS */}
        {!loading && !error && orders.length === 0 && (
          <p className="text-slate-300">You have no orders yet.</p>
        )}

        {/* ORDERS LIST */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-slate-700 bg-slate-900/70 p-4 rounded-xl shadow-md"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400">Order Code</p>
                    <p className="font-mono text-amber-300 text-sm">
                      {order.orderCode || order._id}
                    </p>
                    {order.createdAt && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    {order.paymentStatus && (
                      <p className="text-[11px] text-slate-400 mb-1">
                        Payment:{" "}
                        <span className="font-medium text-emerald-300">
                          {order.paymentStatus}
                        </span>
                      </p>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-300 capitalize">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-3">
                  <p className="text-xs text-slate-400">Items</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.productId?.name || "Product"} × {item.quantity} — ₹
                        {item.price}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total */}
                <div className="mt-3 border-t border-slate-800 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="text-lg font-bold text-emerald-400">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  {order.paymentMethod && (
                    <p className="text-[11px] text-slate-400">
                      Payment method:{" "}
                      <span className="font-medium text-slate-200">
                        {order.paymentMethod}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
