import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:4000/product/getcategory");
      console.log("Fetched categories:", res.data);
      setCategories(res.data.category || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const startEdit = (category) => {
    navigate(`/admin/editcategory/${category._id}`);
  };

  const handleDelete = async (categoryId) => {
    if (!categoryId) {
      alert("Invalid category ID");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this category?");
    if (!ok) return;

    try {
      setDeleteLoadingId(categoryId);

      console.log("Deleting category with ID:", categoryId);

      const res = await axios.delete(
        `http://localhost:4000/product/deletecategory/${categoryId}`
      );

      console.log("Delete response:", res.data);
      alert(res.data.message || "Category deleted");

      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
    } catch (err) {
      console.error("Error deleting category:", err);
      console.error("Error response:", err.response);
      alert(err.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-slate-50">
      {/* Glow accents */}
      <div className="pointer-events-none fixed inset-0 opacity-40 -z-10">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-[-4rem] right-[-3rem] h-40 w-40 rounded-full bg-amber-400/25 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-200/80">
              Collections · Categories
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-amber-50">
              Manage Categories
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Organize your jewellery lines into elegant categories.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/50 bg-rose-950/70 px-4 py-2 text-sm text-rose-100 shadow-md shadow-rose-900/40">
            {error}
          </div>
        )}

        {/* Loading / Empty */}
        {loading ? (
          <div className="mt-6 text-sm sm:text-base text-slate-200 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-6 text-sm sm:text-base text-slate-200 text-center shadow-[0_18px_40px_rgba(0,0,0,0.7)]">
            <p className="font-medium text-amber-100">
              No categories found yet.
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Start by adding categories to better showcase your jewellery
              collections.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards (< md) */}
            <div className="space-y-3 md:hidden">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/90 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.75)]"
                >
                  <div className="flex items-center space-x-3">
                    {category.image ? (
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300/30 to-emerald-400/30 blur-sm" />
                        <img
                          src={category.image}
                          alt={category.name}
                          className="relative h-11 w-11 sm:h-12 sm:w-12 object-cover rounded-full border border-amber-200/40"
                        />
                      </div>
                    ) : (
                      <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 border border-slate-600/80">
                        No Image
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-amber-50">
                        {category.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        ID:{" "}
                        <span className="font-mono">
                          {category._id.slice(0, 6)}...
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1 text-xs">
                    <button
                      onClick={() => startEdit(category)}
                      className="px-3 py-1 rounded-full border border-amber-300/70 text-amber-100 bg-slate-900/70 hover:bg-amber-300 hover:text-slate-950 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={deleteLoadingId === category._id}
                      className="px-3 py-1 rounded-full border border-rose-500/70 text-rose-200 bg-slate-900/70 hover:bg-rose-500 hover:text-slate-950 transition-all duration-200 disabled:opacity-60"
                    >
                      {deleteLoadingId === category._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table for md+ screens */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] mt-4">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-gradient-to-r from-slate-900 to-slate-950">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-amber-200 uppercase tracking-[0.18em]">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-amber-200 uppercase tracking-[0.18em]">
                      Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-amber-200 uppercase tracking-[0.18em]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-slate-900/60 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {category.image ? (
                          <div className="relative inline-block">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300/25 to-emerald-400/25 blur-sm" />
                            <img
                              src={category.image}
                              alt={category.name}
                              className="relative h-12 w-12 object-cover rounded-full border border-amber-200/40"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 border border-slate-600/80">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-amber-50">
                          {category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border border-amber-300/80 text-amber-100 bg-slate-900/70 hover:bg-amber-300 hover:text-slate-950 transition-all duration-200"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={deleteLoadingId === category._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border border-rose-500/80 text-rose-200 bg-slate-900/70 hover:bg-rose-500 hover:text-slate-950 transition-all duration-200 disabled:opacity-60"
                        >
                          <TrashIcon className="h-4 w-4" />
                          {deleteLoadingId === category._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryManagement;
