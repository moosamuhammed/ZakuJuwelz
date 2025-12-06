// src/pages/admin/EditCategory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://13.62.225.195/api/product";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load category details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/getcategory`);
        const list = res.data.category || [];
        const category = list.find((c) => c._id === id);

        if (!category) {
          setError("Category not found");
          setLoading(false);
          return;
        }

        setName(category.name || "");
        setCurrentImage(category.image || "");
        setPreviewImage(category.image || "");
      } catch (err) {
        console.error("Error loading category:", err);
        setError(err.response?.data?.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Handle new image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      const res = await axios.put(
        `${API_BASE}/editcategory/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message || "Category updated successfully");
      navigate("/admin/categories"); // back to categories list
    } catch (err) {
      console.error("Error updating category:", err);
      alert(err.response?.data?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Edit Category
          </h1>
          <Link
            to="/admin/categories"
            className="text-xs sm:text-sm text-blue-600 hover:underline"
          >
            ← Back to Categories
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600 text-sm">Loading category...</p>
        ) : error ? (
          <div className="rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>

            {/* Image upload + preview */}
            <div className="grid gap-4 sm:grid-cols-[1.5fr,auto] items-start">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to keep the current image.
                </p>
              </div>

              {previewImage && (
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">Preview</span>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditCategory;
