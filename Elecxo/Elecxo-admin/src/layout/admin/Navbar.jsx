import React from "react";
import { useNavigate } from "react-router-dom";
import { PowerIcon } from "@heroicons/react/24/solid";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="w-full px-6 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-400/20 shadow-xl shadow-black/40 flex justify-between items-center backdrop-blur-xl">
      
      {/* Left: Title */}
      <h1 className="text-xl font-semibold tracking-wide text-amber-200 drop-shadow-[0_0_10px_rgba(255,200,100,0.5)]">
         <span className="font-light text-emerald-300"></span>
      </h1>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-gradient-to-r from-rose-500/90 to-rose-600 text-white px-4 py-2 rounded-lg shadow-md shadow-rose-700/40 hover:from-rose-400 hover:to-rose-500 transition-all duration-200"
      >
        <PowerIcon className="h-5 w-5" />
        Logout
      </button>
    </div>
  );
}

export default Navbar;
