import React, { useState } from "react";
import TextInput from "../../components/Input";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AlertBox from "../../components/Alertbox"; 

function Signup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (type, title, message, duration = 3000) => {
    setToast({ type, title, message, duration });
    setTimeout(() => setToast(null), duration + 200);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast(
        "warning",
        "Missing details",
        "Please fill in name, email and password."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://13.62.225.195/api/auth/register",
        { name, email, password }
      );

      showToast(
        "success",
        "Account created ",
        response.data.message || "Your account has been created successfully."
      );

      // small delay so user can see the toast
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        "Signup failed",
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 flex items-center justify-center px-4 py-8">
      {/*  Toast / alert */}
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
        {/* Left: Brand / Story */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-8 xl:p-10 bg-gradient-to-b from-indigo-500/40 via-slate-900/60 to-slate-950/90 border-r border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-sky-400/90 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              J
            </div>
            {/* Brand name – change if needed */}
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Zaku <span className="text-sky-300">Juwelz</span>
            </h1>
          </div>

          <div className="mt-10">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
              Start your{" "}
              <span className="bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
                sparkle journey
              </span>
            </h2>
            <p className="mt-4 text-sm xl:text-base text-slate-200/80">
              Create your account to wishlist favourites, track your orders,
              and unlock exclusive jewellery collections crafted for you.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-200/90">
              <div className="rounded-2xl border border-white/15 bg-slate-900/40 px-3 py-3">
                <p className="font-semibold">Custom picks</p>
                <p className="mt-1 text-[11px] text-slate-300/80">
                  Get recommendations based on your occasions and style.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-slate-900/40 px-3 py-3">
                <p className="font-semibold">Member rewards</p>
                <p className="mt-1 text-[11px] text-slate-300/80">
                  Earn points and offers every time you shine with us.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-[11px] text-slate-300/70">
            Questions?{" "}
            <span className="text-sky-300 font-semibold">
              support@zakujuwelz.com
            </span>
          </p>
        </div>

        {/* Right: Signup form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 xl:p-10">
          <div className="w-full max-w-sm">
            {/* Brand for mobile */}
            <div className="md:hidden mb-6 flex items-center justify-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-sky-400/90 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                J
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Zaku <span className="text-sky-300">Juwelz</span>
              </h1>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-300 text-center">
              Join our community and never miss a new collection.
            </p>

            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-200/80 ml-1">
                  Full name
                </label>
                <TextInput
                  placeholder="Your name"
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
              </div>

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
                  placeholder="Create a password"
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:shadow-indigo-500/60 hover:translate-y-[1px] active:translate-y-[2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>Sign up</>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-sky-300 hover:text-sky-200"
              >
                Log in
              </Link>
            </p>

            <p className="mt-3 text-center text-[11px] text-slate-400">
              By signing up, you agree to our{" "}
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

export default Signup;
