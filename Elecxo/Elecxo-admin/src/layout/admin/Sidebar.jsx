import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";

import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  FolderPlusIcon,
  ClipboardDocumentListIcon, // <-- NEW
} from "@heroicons/react/24/solid";

export function DefaultSidebar() {
  const location = useLocation();

  // Reusable active state checker
  const isActive = (path) =>
    location.pathname === path
      ? "bg-gradient-to-r from-amber-400/90 to-emerald-400/90 text-slate-950 shadow-md shadow-amber-500/40"
      : "text-emerald-100 hover:bg-slate-800/80 hover:text-amber-200";

  return (
    <>
      {/* ------------------- DESKTOP SIDEBAR (md and above) ------------------- */}
      <Card className="hidden md:flex h-screen w-full max-w-[17rem] p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl shadow-black/60 border-r border-slate-800/90 flex-col relative overflow-hidden">
        {/* Soft glow accents */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-10 -left-8 h-28 w-28 rounded-full bg-emerald-500/40 blur-3xl" />
          <div className="absolute bottom-10 -right-10 h-32 w-32 rounded-full bg-amber-400/35 blur-3xl" />
        </div>

        {/* Brand header */}
        <div className="relative mb-4 flex items-center gap-3 px-2 pt-1">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.8)]">
            <span className="text-xs font-extrabold tracking-widest text-slate-950">
              ZK
            </span>
          </div>
          <div>
            <Typography
              variant="h5"
              className="text-lg font-semibold tracking-wide text-amber-50"
            >
              Zaku Admin
            </Typography>
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-200/80">
              Jewellery Panel
            </p>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto mt-2">
          <List className="gap-1">
            {/* Dashboard */}
            <Link to="/admin/dashboard">
              <ListItem
                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${isActive(
                  "/admin/dashboard"
                )}`}
              >
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5 opacity-90" />
                </ListItemPrefix>
                <span className="text-sm font-medium">Dashboard</span>
              </ListItem>
            </Link>

            {/* Add Products */}
            <Link to="/admin/addproducts">
              <ListItem
                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${isActive(
                  "/admin/addproducts"
                )}`}
              >
                <ListItemPrefix>
                  <ShoppingBagIcon className="h-5 w-5 opacity-90" />
                </ListItemPrefix>
                <span className="text-sm font-medium">Add Products</span>
              </ListItem>
            </Link>

            {/* Add Category */}
            <Link to="/admin/addcategory">
              <ListItem
                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${isActive(
                  "/admin/addcategory"
                )}`}
              >
                <ListItemPrefix>
                  <FolderPlusIcon className="h-5 w-5 opacity-90" />
                </ListItemPrefix>
                <span className="text-sm font-medium">Add Category</span>
              </ListItem>
            </Link>

            {/* Stock Page */}
            <Link to="/admin/stockssee">
              <ListItem
                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${isActive(
                  "/admin/stockssee"
                )}`}
              >
                <ListItemPrefix>
                  <ShoppingBagIcon className="h-5 w-5 opacity-90" />
                </ListItemPrefix>
                <span className="text-sm font-medium">Stocks</span>
              </ListItem>
            </Link>

            {/* All Users Orders */}
            <Link to="/admin/orders">
              <ListItem
                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${isActive(
                  "/admin/orders"
                )}`}
              >
                <ListItemPrefix>
                  <ClipboardDocumentListIcon className="h-5 w-5 opacity-90" />
                </ListItemPrefix>
                <span className="text-sm font-medium">All Users Orders</span>
              </ListItem>
            </Link>

            {/* Settings */}
            <Link to="/admin/categories">
              <ListItem
                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${isActive(
                  "/admin/categories"
                )}`}
              >
                <ListItemPrefix>
                  <Cog6ToothIcon className="h-5 w-5 opacity-90" />
                </ListItemPrefix>
                <span className="text-sm font-medium">Settings</span>
              </ListItem>
            </Link>
          </List>
        </div>

        {/* Footer text */}
        <div className="relative mt-3 border-t border-slate-800/80 pt-3">
          <p className="text-[10px] text-slate-400/90 tracking-wide">
            Crafted for{" "}
            <span className="text-amber-300 font-semibold">Zaku Jewellery</span>
          </p>
        </div>
      </Card>

      {/* ------------------- MOBILE BOTTOM NAV (below md) ------------------- */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-800/90 shadow-[0_-10px_30px_rgba(0,0,0,0.75)] z-40 backdrop-blur-xl">
        <div className="flex justify-around items-center py-2 text-[11px]">
          {/* Dashboard */}
          <Link
            to="/admin/dashboard"
            className="flex flex-col items-center gap-0.5"
          >
            <PresentationChartBarIcon
              className={`h-5 w-5 ${
                location.pathname === "/admin/dashboard"
                  ? "text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)]"
                  : "text-slate-400"
              }`}
            />
            <span
              className={
                location.pathname === "/admin/dashboard"
                  ? "text-amber-200 font-medium"
                  : "text-slate-300"
              }
            >
              Dashboard
            </span>
          </Link>

          {/* Products */}
          <Link
            to="/admin/addproducts"
            className="flex flex-col items-center gap-0.5"
          >
            <ShoppingBagIcon
              className={`h-5 w-5 ${
                location.pathname === "/admin/addproducts"
                  ? "text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)]"
                  : "text-slate-400"
              }`}
            />
            <span
              className={
                location.pathname === "/admin/addproducts"
                  ? "text-amber-200 font-medium"
                  : "text-slate-300"
              }
            >
              Products
            </span>
          </Link>

          {/* Category */}
          <Link
            to="/admin/addcategory"
            className="flex flex-col items-center gap-0.5"
          >
            <FolderPlusIcon
              className={`h-5 w-5 ${
                location.pathname === "/admin/addcategory"
                  ? "text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)]"
                  : "text-slate-400"
              }`}
            />
            <span
              className={
                location.pathname === "/admin/addcategory"
                  ? "text-amber-200 font-medium"
                  : "text-slate-300"
              }
            >
              Category
            </span>
          </Link>

          {/* Stocks */}
          <Link
            to="/admin/stockssee"
            className="flex flex-col items-center gap-0.5"
          >
            <ShoppingBagIcon
              className={`h-5 w-5 ${
                location.pathname === "/admin/stockssee"
                  ? "text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)]"
                  : "text-slate-400"
              }`}
            />
            <span
              className={
                location.pathname === "/admin/stockssee"
                  ? "text-amber-200 font-medium"
                  : "text-slate-300"
              }
            >
              Stocks
            </span>
          </Link>

          {/* All Users Orders */}
          <Link
            to="/admin/orders"
            className="flex flex-col items-center gap-0.5"
          >
            <ClipboardDocumentListIcon
              className={`h-5 w-5 ${
                location.pathname === "/admin/orders"
                  ? "text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)]"
                  : "text-slate-400"
              }`}
            />
            <span
              className={
                location.pathname === "/admin/orders"
                  ? "text-amber-200 font-medium"
                  : "text-slate-300"
              }
            >
              Orders
            </span>
          </Link>

          {/* Settings */}
          <Link
            to="/admin/categories"
            className="flex flex-col items-center gap-0.5"
          >
            <Cog6ToothIcon
              className={`h-5 w-5 ${
                location.pathname === "/admin/categories"
                  ? "text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)]"
                  : "text-slate-400"
              }`}
            />
            <span
              className={
                location.pathname === "/admin/categories"
                  ? "text-amber-200 font-medium"
                  : "text-slate-300"
              }
            >
              Settings
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
