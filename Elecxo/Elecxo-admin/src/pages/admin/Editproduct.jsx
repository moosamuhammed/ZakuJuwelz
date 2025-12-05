import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Editproduct() {
  const { id } = useParams();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !details || !price || !selectedCategory || stock === "") {
      alert("All fields are required, including stock!");
      return;
    }

    const stockNumber = Number(stock);
    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      alert("Stock must be a non-negative number");
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);

    formData.append("name", name);
    formData.append("price", price);
    formData.append("details", details);
    formData.append("category", selectedCategory);
    formData.append("stock", stockNumber);

    try {
      const response = await axios.put(
        `http://localhost:4000/product/editproduct/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/product/getcategory");
      setCategoryList(response.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/product/getproduct/${id}`);
      const p = res.data.product;

      setName(p.name || "");
      setPrice(p.price || "");
      setDetails(p.details || "");
      setSelectedCategory(p.category?._id || p.category || "");
      setStock(p.stock ?? "");
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-950/90 border border-zinc-800/70 rounded-3xl shadow-2xl shadow-amber-900/20 backdrop-blur-xl overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-zinc-800/70 px-6 sm:px-10 py-6">
          <h2 className="text-3xl font-semibold text-amber-50">
            Edit Jewellery Piece
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
              <p className="text-xs text-zinc-400 mb-2 uppercase">Product Image</p>

              <input
                type="file"
                className="w-full bg-zinc-800 border border-zinc-700 text-amber-50 rounded-lg p-2"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
              <p className="text-xs text-zinc-400 uppercase mb-2">Inventory Snapshot</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-zinc-700 p-3 rounded-lg">
                  <p className="text-zinc-400 text-xs">Stock</p>
                  <p className="text-amber-200 text-lg">{stock || "—"}</p>
                </div>

                <div className="border border-zinc-700 p-3 rounded-lg">
                  <p className="text-zinc-400 text-xs">Price</p>
                  <p className="text-amber-200 text-lg">{price || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-xs text-zinc-300">Jewellery Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-zinc-950/70 border border-zinc-800 text-amber-50 rounded-lg p-2 text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-zinc-300">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full mt-1 bg-zinc-950/70 border border-zinc-800 text-amber-50 rounded-lg p-2 text-sm"
              >
                <option value="">Select category</option>
                {categoryList.map((item) => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-300">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full mt-1 bg-zinc-950/70 border border-zinc-800 text-amber-50 rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full mt-1 bg-zinc-950/70 border border-zinc-800 text-amber-50 rounded-lg p-2 text-sm"
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="text-xs text-zinc-300">Design Details</label>
              <textarea
                rows="3"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full mt-1 bg-zinc-950/70 border border-zinc-800 text-amber-50 rounded-lg p-2 text-sm"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-300 text-slate-900 font-semibold rounded-full py-2.5 shadow-md hover:brightness-110"
            >
              💎 Update Jewellery
            </button>
          </form>

        </div>

        <div className="h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-sky-400" />
      </div>
    </div>
  );
}

export default Editproduct;
