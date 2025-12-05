import {
  ShoppingCart,
  User,
  Search,
  Package,
  Sun,
  Moon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../public/logo.png";

function Navbar({ cartItems = [] }) {
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      const darkMode = storedTheme === "dark";
      document.documentElement.classList.toggle("dark", darkMode);
      setIsDark(darkMode);
    } else {
      // If no stored theme, use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      setIsDark(prefersDark);
    }
  }, []);

  const handleThemeToggle = () => {
    const next = !isDark;
    setIsDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const token = localStorage.getItem("token");
  const cartCount = cartItems.length;

  return (
    <nav
      className="
        sticky top-0 z-30 w-full
        bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900
        border-b border-white/10
        shadow-[0_10px_40px_rgba(15,23,42,0.6)]
        backdrop-blur-xl
      "
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1 group">
              <div
                className="
                  w-10 h-10 rounded-3xl
                  bg-black
                  flex items-center justify-center
                "
              >
                <img src={logo} alt="logo" />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold text-slate-50">
                  Zaku
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400">
                  Juwelz
                </span>
              </div>
            </Link>
          </div>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="flex-1 mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full border border-gray-700 bg-slate-900/70
                  text-slate-100 rounded-full py-2 pl-10 pr-4
                  focus:ring-2 focus:ring-sky-500 outline-none
                "
              />

              <Search
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                onClick={(e) => handleSearch(e)}
              />
            </div>
          </form>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex items-center gap-3">
            {/* THEME TOGGLE */}
            <button
              type="button"
              onClick={handleThemeToggle}
              className="
                w-9 h-9 flex items-center justify-center
                rounded-full border
                border-white/20 bg-white/5
                text-slate-100
                hover:bg-white/10
                hover:shadow-[0_0_16px_rgba(129,140,248,0.7)]
                transition-all duration-200
              "
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* MY ORDERS (only when logged in) */}
            {token && (
              <Link to="/my-orders">
                <button
                  className="
                    hidden sm:inline-flex items-center gap-2
                    text-xs sm:text-sm font-medium
                    px-3 sm:px-4 py-1.5
                    rounded-full
                    bg-slate-800/80
                    text-slate-100
                    border border-white/10
                    hover:bg-slate-700
                    hover:shadow-[0_0_18px_rgba(56,189,248,0.4)]
                    transition-all duration-150
                  "
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </button>
              </Link>
            )}

            {/* LOGOUT / LOGIN */}
            <div>
              {token ? (
                <button
                  onClick={handleLogout}
                  className="
                    inline-flex items-center gap-2
                    text-xs sm:text-sm font-medium
                    px-3 sm:px-4 py-1.5
                    rounded-full
                    bg-gradient-to-r from-rose-600 to-red-500
                    text-white
                    shadow-lg shadow-rose-500/40
                    hover:brightness-110 active:scale-95
                    transition-all duration-150
                    border border-white/10
                  "
                >
                  <User className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              ) : (
                <Link to="/login">
                  <div
                    className="
                      w-9 h-9 flex items-center justify-center
                      rounded-full bg-white/5 border border-white/15
                      text-slate-100 hover:bg-white/10
                      hover:shadow-[0_0_20px_rgba(129,140,248,0.5)]
                      transition-all duration-200
                    "
                  >
                    <User className="w-4 h-4" />
                  </div>
                </Link>
              )}
            </div>

            {/* CART */}
            <Link to="/addtocart">
              <div
                className="
                  relative w-9 h-9 flex items-center justify-center
                  rounded-full bg-white/5 border border-white/15
                  text-slate-100 hover:bg-white/10
                  hover:shadow-[0_0_20px_rgba(56,189,248,0.6)]
                  transition-all duration-200
                "
              >
                <ShoppingCart className="w-4 h-4" />

                <span
                  className="
                    absolute -top-1 -right-1
                    text-[10px] px-1.5 py-[1px]
                    rounded-full bg-emerald-500 text-white
                    border border-slate-900
                  "
                >
                  {cartCount}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
