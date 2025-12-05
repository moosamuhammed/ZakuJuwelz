// src/pages/admin/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

const getAllOrders = () => {
  return axios.get(`${API_BASE_URL}/orders/getallorder`, authHeaders());
};

const updateOrderStatus = (orderId, status) => {
  return axios.patch(
    `${API_BASE_URL}/orders/updateorderstatus/${orderId}/status`,
    { status },
    authHeaders()
  );
};

const deleteOrder = (orderId) => {
  return axios.delete(
    `${API_BASE_URL}/orders/deleteorder/${orderId}`,
    authHeaders()
  );
};

const statusOptions = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

const statusColors = {
  Pending: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/40",
  Processing: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/40",
  Shipped: "bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-400/40",
  Completed: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/40",
  Cancelled: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/40",
  default: "bg-slate-700/40 text-slate-200 ring-1 ring-slate-500/40",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getAllOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      const message =
        err.response?.data?.message ||
        "Failed to load orders. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return;
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      const message =
        err.response?.data?.message || "Failed to update order status.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      setUpdatingId(orderId);
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      const message =
        err.response?.data?.message || "Failed to delete order.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-6 md:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 ring-1 ring-amber-400/40">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-amber-200">
              Admin · Orders
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Orders Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Monitor customer orders, update statuses, and keep fulfilment on track.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm hover:border-slate-400 hover:bg-slate-800/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_20px_60px_rgba(15,23,42,0.85)] backdrop-blur-xl">
        {/* Top strip */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            <span>
              Total orders:{" "}
              <span className="font-semibold text-slate-200">
                {orders.length}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-300">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border border-slate-600 border-t-transparent" />
            Loading orders...
          </div>
        ) : error ? (
          <div className="px-4 py-10 text-center text-sm text-rose-300">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-300">
            No orders found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-t border-slate-800 text-left text-sm text-slate-100">
              <thead>
                <tr className="bg-slate-900/80 text-xs uppercase tracking-[0.14em] text-slate-400">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  const user = order.userId || {};
                  const displayDate = order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-";

                  const total =
                    typeof order.totalAmount === "number"
                      ? order.totalAmount
                      : Number(order.totalAmount || 0);

                  const isLast = idx === orders.length - 1;
                  const borderClass = isLast
                    ? ""
                    : "border-b border-slate-800/70";

                  const statusClass =
                    statusColors[order.orderStatus] || statusColors.default;

                  return (
                    <tr
                      key={order._id}
                      className={`${borderClass} hover:bg-slate-900/60 transition-colors`}
                    >
                      {/* Order ID */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[11px] text-amber-200">
                            {order.orderCode || order._id}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            #{idx + 1} · Mongo ID
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-50">
                            {user.name || user.fullName || "Unknown"}
                          </span>
                          <span className="text-xs text-slate-400">
                            {user.email || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3 align-top">
                        <div className="space-y-1 max-w-xs">
                          {order.items?.map((item, i) => (
                            <div
                              key={item._id || i}
                              className="text-[11px] text-slate-200"
                            >
                              <span className="font-medium">
                                {item.productId?.name || "Product"}
                              </span>
                              <span className="text-slate-400">
                                {" "}
                                × {item.quantity} · ₹
                                {item.price ??
                                  item.productId?.price ??
                                  "0"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 align-top">
                        <div className="text-sm font-semibold text-emerald-300">
                          ₹{total.toFixed(2)}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-slate-100">
                            {order.paymentMethod || "N/A"}
                          </span>
                          {order.paymentStatus && (
                            <span className="inline-flex w-fit rounded-full bg-emerald-500/10 px-2 py-[2px] text-[10px] text-emerald-300 ring-1 ring-emerald-500/40">
                              {order.paymentStatus}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-[3px] text-[11px] ${statusClass}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {order.orderStatus || "Pending"}
                          </span>

                          <select
                            className="mt-1 text-[11px] rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-0 disabled:opacity-60"
                            value={order.orderStatus || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            disabled={updatingId === order._id}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 align-top">
                        <span className="text-[11px] text-slate-400">
                          {displayDate}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center justify-end gap-2">
                          {/* Placeholder for future "View" page */}
                          {/* <button className="text-xs text-sky-300 hover:underline">
                            View
                          </button> */}
                          <button
                            className="text-xs text-rose-300 hover:text-rose-200 hover:underline disabled:opacity-60"
                            onClick={() => handleDelete(order._id)}
                            disabled={updatingId === order._id}
                          >
                            {/* Delete */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
