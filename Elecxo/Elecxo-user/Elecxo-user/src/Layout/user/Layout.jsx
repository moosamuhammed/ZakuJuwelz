import React, { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  // ✅ Shared cart state lives here
  const [cart, setCart] = useState([]);

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
        text-slate-100
      "
    >
      {/* Top navigation */}
      <Navbar cartItems={cart} />

      {/* Main app container */}
      <div
        className="
          max-w-6xl
          mx-auto
          px-2 sm:px-4 md:px-6 lg:px-8
          pt-3 sm:pt-4 md:pt-6
          pb-6 sm:pb-8 md:pb-10
        "
      >
        {/* Subtle background glow */}
        <div className="relative">
          <div
            className="
              pointer-events-none
              absolute -top-10 -left-6
              w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40
              bg-sky-500/20 blur-3xl rounded-full
            "
          />
          <div
            className="
              pointer-events-none
              absolute -bottom-16 -right-6
              w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52
              bg-indigo-500/20 blur-3xl rounded-full
            "
          />

          {/* Main content card */}
          <main
            className="
              relative z-10
              mt-3 sm:mt-4
              rounded-2xl sm:rounded-3xl
              border border-white/5 sm:border-white/10
              bg-slate-900/70 sm:bg-slate-900/60
              backdrop-blur-xl sm:backdrop-blur-2xl
              shadow-[0_10px_30px_rgba(15,23,42,0.75)]
              sm:shadow-[0_18px_60px_rgba(15,23,42,0.75)]
              p-3 sm:p-4 md:p-6 lg:p-7
              transition-all duration-200
            "
          >
            {/* Content wrapper */}
            <div className="min-h-[55vh] sm:min-h-[60vh]">
              {/* ✅ Pass cart + setCart to children via Outlet context */}
              <Outlet context={{ cart, setCart }} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
