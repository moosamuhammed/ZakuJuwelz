import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

function Dashbord() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://13.62.225.195/api/product/getproduct');
      setProducts(response.data?.product || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product function
  const deleteProduct = async (id) => {
    console.log('Deleting product with id:', id);

    try {
      await axios.delete(`http://13.62.225.195/api/product/deleteproduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Glow background decor */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">
              Admin · Collection
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-amber-50">
              Jewellery Collection
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Curate your pieces of elegance — manage products, categories, and stock.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/admin/addproducts">
              <button className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-sm font-medium text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:from-amber-400 hover:to-amber-300 transition-all duration-200">
                <PlusCircle size={18} />
                Add Product
              </button>
            </Link>
            <Link to="/admin/addcategory">
              <button className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-slate-900/70 px-4 py-2 text-sm font-medium text-emerald-200 shadow-md shadow-emerald-500/20 hover:bg-slate-800/80 hover:text-emerald-100 transition-all duration-200">
                <PlusCircle size={18} />
                Add Category
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const rawStock = product.stock ?? 0;
              const stockValue = Number(rawStock);
              const safeStock = Number.isNaN(stockValue) ? 0 : stockValue;

              return (
                <div
                  key={product._id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 shadow-[0_18px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(0,0,0,0.85)]"
                >
                  {/* Top shimmer bar */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-300/80 to-transparent opacity-80" />

                  {/* Image wrapper with subtle gradient border */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-fuchsia-300/10 opacity-60" />
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-52 w-full object-cover"
                    />
                    {/* Badge */}
                    <div className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-amber-100 backdrop-blur-md border border-amber-200/40">
                      {safeStock > 0 ? 'Available' : 'Out of Stock'}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    {/* Name & price */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-semibold text-amber-50 line-clamp-1">
                          {product.name}
                        </h2>
                        <p className="mt-1 text-xs text-slate-300 line-clamp-2">
                          {product.details}
                        </p>
                      </div>
                      <p className="text-right text-sm font-semibold text-amber-300">
                        ₹{product.price}
                      </p>
                    </div>

                    {/* Stock status */}
                    <p
                      className={`mt-1 text-xs font-semibold ${
                        safeStock > 0 ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      {safeStock > 0
                        ? `In Stock · ${safeStock} piece${safeStock > 1 ? 's' : ''}`
                        : 'Currently Sold Out'}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-700/70 pt-3">
                      <Link to={`/admin/editproduct/${product._id}`}>
                        <button className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-400 hover:text-slate-950 hover:shadow-[0_0_18px_rgba(251,191,36,0.7)] transition-all duration-200">
                          <Pencil size={14} />
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-500/50 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-500 hover:text-slate-950 hover:shadow-[0_0_18px_rgba(239,68,68,0.7)] transition-all duration-200"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="mb-4 h-16 w-16 rounded-full border border-dashed border-amber-300/60 flex items-center justify-center">
              <PlusCircle className="opacity-70" />
            </div>
            <p className="text-sm font-medium text-amber-100">
              No jewellery pieces in your collection yet.
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Start by adding a new product or category to showcase your designs.
            </p>
            <Link to="/admin/addproducts">
              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md hover:bg-amber-300 transition-all duration-200">
                <PlusCircle size={16} />
                Add first product
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashbord;
