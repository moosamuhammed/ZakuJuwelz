import React, { useState } from "react";
import axios from "axios";

function Category() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);

    try {
      const response = await axios.post(
        "http://13.62.225.195/api/product/catogary/add",
        formData
      );
      console.log(response.data);
      alert(response.data.message);

      setImage(null);
      setName("");
    } catch (error) {
      console.error(
        "Error adding category:",
        error.response ? error.response.data : ""
      );
      alert("Failed to add category");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      {/* Glow accents */}
      <div className="pointer-events-none fixed inset-0 opacity-40 -z-10">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-[-4rem] right-[-3rem] h-40 w-40 rounded-full bg-amber-400/25 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_55px_rgba(0,0,0,0.9)] px-6 py-7">
          {/* Header */}
          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-200/80">
              Collections · Category
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-amber-50 tracking-tight">
              Add New Category
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Create a category to organize your jewellery pieces elegantly.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Image upload */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-amber-200 mb-1.5">
                Category Image
              </label>
              <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-xs text-slate-200 cursor-pointer hover:border-amber-300/80 hover:bg-slate-900 transition-all duration-200">
                <span className="truncate">
                  {image ? image.name : "Choose an image file…"}
                </span>
                <span className="ml-3 inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold text-slate-950">
                  Browse
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <p className="mt-1 text-[10px] text-slate-400">
                Recommended: square image, clear jewellery category visual.
              </p>
            </div>

            {/* Category name */}
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase tracking-wide text-amber-200">
                Category Name
              </label>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bridal Collection"
                  className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-500 text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-semibold text-sm px-6 py-2.5 shadow-[0_0_18px_rgba(250,204,21,0.7)] hover:from-amber-300 hover:to-emerald-300 transition-all duration-200"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Category;
