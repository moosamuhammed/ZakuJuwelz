import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://13.62.225.195/api/admin/login"; 


const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      let data;

      // Safely handle non-JSON (like 404 HTML)
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server returned status ${res.status}`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Save token and navigate
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-4">
      {/* Glow circles in background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-20 -left-10 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute -bottom-10 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-slate-900/70 border border-yellow-100/10 rounded-3xl shadow-2xl shadow-yellow-900/20 p-8 relative overflow-hidden">
          {/* Decorative corner line */}
          <div className="absolute -right-10 -top-10 h-36 w-36 border border-yellow-500/20 rounded-full" />
          <div className="absolute -right-3 -top-3 h-20 w-20 border border-emerald-400/20 rounded-full" />

          {/* Logo / brand mark */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 via-amber-300 to-emerald-300 flex items-center justify-center shadow-lg shadow-yellow-500/40">
                <span className="text-2xl">💍</span>
              </div>
              <div className="absolute inset-0 rounded-full border border-white/40 blur-[1px]" />
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-[0.25em] uppercase text-slate-100 text-center">
              Aurum
              <span className="block text-xs font-normal tracking-[0.45em] text-yellow-200/70">
                Jewellery
              </span>
            </h1>
          </div>

          <div className="space-y-1 text-center mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-yellow-100/80">
              Admin Portal
            </p>
            <p className="text-xs text-slate-300/80">
              Sign in to manage collections, orders & exclusive launches.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 text-xs text-red-300 bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-medium tracking-wide text-slate-200"
              >
                Admin email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="you@aurumjewels.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-yellow-100/20 rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-300/70 transition shadow-sm shadow-black/40"
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <span className="text-xs text-yellow-200/70">✉️</span>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-medium tracking-wide text-slate-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter secure password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-yellow-100/20 rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300/70 transition shadow-sm shadow-black/40"
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <span className="text-xs text-emerald-200/80">🔒</span>
                </div>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-[11px] text-slate-300/80">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-500/60 bg-slate-900/80 text-yellow-400 focus:ring-yellow-400/60"
                />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                className="underline underline-offset-2 decoration-yellow-400/70 hover:decoration-yellow-300 transition"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-emerald-300 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 shadow-lg shadow-yellow-500/40 hover:shadow-yellow-400/60 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Verifying..." : "Enter Vault"}</span>
              <span className="text-sm">⟶</span>
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-4 text-[10px] text-center text-slate-400/80">
            Access restricted to authorised Aurum Jewellery staff only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
