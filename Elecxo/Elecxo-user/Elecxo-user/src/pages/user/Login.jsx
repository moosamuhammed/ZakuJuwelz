import React, { useState } from "react";
import TextInput from "../../components/Input";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AlertBox from "../../components/Alertbox"; // animated alert component

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (
    type,
    title,
    message,
    duration = 3000
  ) => {
    setToast({ type, title, message, duration });

    // clear toast state after it finishes
    setTimeout(() => setToast(null), duration + 200);
  };

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast(
        "warning",
        "Missing details",
        "Please enter both email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:4000/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);

      showToast(
        "success",
        "Welcome back ✨",
        response.data.message || "Logged in successfully!"
      );

      // small delay so user can see the toast before redirect
      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        "Login failed",
        error?.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 flex items-center justify-center px-4 py-8">
      {/* 🔔 Animated alert (top-right) */}
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

      {/* Background decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row rounded-3xl shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl overflow-hidden">
        {/* Left: Brand / Hero section */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-8 xl:p-10 bg-gradient-to-b from-indigo-500/40 via-slate-900/60 to-slate-950/90 border-r border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-sky-400/90 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              J
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              zaku <span className="text-sky-300">juwelz</span>
            </h1>
          </div>

          <div className="mt-10">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
              Elevate every{" "}
              <span className="bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
                moment with shine
              </span>
            </h2>
            <p className="mt-4 text-sm xl:text-base text-slate-200/80">
              Sign in to discover handcrafted jewellery, curated collections,
              and exclusive member-only designs for your special occasions.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-200/90">
              <div className="rounded-2xl border border-white/15 bg-slate-900/40 px-3 py-3">
                <p className="font-semibold">Certified brilliance</p>
                <p className="mt-1 text-[11px] text-slate-300/80">
                  Every diamond and gemstone is quality-checked and certified.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-slate-900/40 px-3 py-3">
                <p className="font-semibold">Exclusive collections</p>
                <p className="mt-1 text-[11px] text-slate-300/80">
                  Get early access to festive launches and limited editions.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-[11px] text-slate-300/70">
            Need help?{" "}
            <span className="text-sky-300 font-semibold">
              support@zakujuwelz.com
            </span>
          </p>
        </div>

        {/* Right: Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 xl:p-10">
          <div className="w-full max-w-sm">
            {/* Logo for mobile */}
            <div className="md:hidden mb-6 flex items-center justify-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-sky-400/90 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                J
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Jewel<span className="text-sky-300">Aura</span>
              </h1>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-300 text-center">
              Log in to continue exploring your favourite jewellery pieces.
            </p>

            <form onSubmit={login} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-200/80 ml-1">
                  Email address
                </label>
                <TextInput
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-200/80 ml-1">
                  Password
                </label>
                <TextInput
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 mt-1">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-500/60 bg-slate-900/60 text-sky-400 focus:ring-sky-400"
                  />
                  <label htmlFor="remember" className="cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sky-300 hover:text-sky-200 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:shadow-indigo-500/60 hover:translate-y-[1px] active:translate-y-[2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>Log in</>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-300">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-sky-300 hover:text-sky-200"
              >
                Sign up
              </Link>
            </p>

            <p className="mt-3 text-center text-[11px] text-slate-400">
              By logging in, you agree to our{" "}
              <span className="underline underline-offset-2 cursor-pointer">
                Terms
              </span>{" "}
              and{" "}
              <span className="underline underline-offset-2 cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
