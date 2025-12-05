import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stock, setStock] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !name || !details || !price || !selectedCategory || stock === "") {
      alert("All fields are required, including stock!");
      return;
    }

    const stockNumber = Number(stock);
    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      alert("Stock must be a non-negative number");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("details", details);
    formData.append("category", selectedCategory);
    formData.append("stock", stockNumber);

    try {
      const response = await axios.post(
        "http://localhost:4000/product/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Server Response:", response.data);
      alert(response.data.message);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response ? error.response.data : error.message
      );
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/product/getcategory"
      );
      console.log("Fetched Categories:", response.data);
      setCategoryList(response.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 text-slate-50">
      {/* Glow accents */}
      <div className="pointer-events-none fixed inset-0 opacity-40 -z-10">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-[-4rem] right-[-3rem] h-40 w-40 rounded-full bg-amber-400/25 blur-3xl" />
      </div>

      <div className="w-full max-w-3xl">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_55px_rgba(0,0,0,0.9)] px-6 py-8">
          {/* Header */}
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-200/80">
              Products · Create
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-amber-50 tracking-tight">
              Add a New Product
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Upload a jewellery piece with its details, category and stock level.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Image upload */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-amber-200 mb-1.5">
                Product Image
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
                Recommended: clear, high-quality image of the jewellery item.
              </p>
            </div>

            {/* Grid for main fields on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium uppercase tracking-wide text-amber-200">
                  Product Name
                </label>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                  <input
                    type="text"
                    name="Product Name"
                    className="w-full bg-transparent outline-none text-slate-100 text-sm placeholder-slate-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Emerald Necklace"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-xs font-medium uppercase tracking-wide text-amber-200">
                  Category
                </label>
                <select
                  className="w-full mt-0.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/70 text-sm text-slate-100 uppercase outline-none focus:ring-1 focus:ring-amber-300/80"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option disabled value="">
                    Select Category
                  </option>
                  {categoryList.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1">
                <label className="block text-xs font-medium uppercase tracking-wide text-amber-200">
                  Price (₹)
                </label>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-transparent outline-none text-slate-100 text-sm placeholder-slate-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2999"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <label className="block text-xs font-medium uppercase tracking-wide text-amber-200">
                  Stock
                </label>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-transparent outline-none text-slate-100 text-sm placeholder-slate-500"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Available pieces"
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase tracking-wide text-amber-200">
                Product Details
              </label>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                <textarea
                  rows={4}
                  className="w-full bg-transparent outline-none text-slate-100 text-sm placeholder-slate-500 resize-none"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe materials, style, stone type, size, occasion, etc."
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-semibold text-sm px-6 py-2.5 shadow-[0_0_18px_rgba(250,204,21,0.7)] hover:from-amber-300 hover:to-emerald-300 transition-all duration-200"
              >
                Submit Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
