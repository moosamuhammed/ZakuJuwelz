import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard() {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/product/getproduct');
      setProducts(response.data.product || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    }
  };

  // Add product to cart
  const addtocart = async (productId) => {
    try {
      const token = localStorage.getItem('token'); // get latest token

      if (!token) {
        setError('You must be logged in to add to cart');
        // optionally:
        // navigate('/login');
        return false;
      }

      console.log('Calling /cart/addtocart for', productId);

      const response = await axios.post(
        'http://localhost:4000/cart/addtocart',
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Product added to cart:', response.data);
      // If axios didn't throw, it was a 2xx response → treat as success
      return true;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setError(
        error?.response?.data?.message ||
          'Failed to add to cart. Check console/network tab.'
      );
      return false;
    }
  };

  // Button handler
  const handleAddToCart = async (productId) => {
    console.log('Add to Cart clicked for', productId);
    setError('');
    setLoadingId(productId);

    const success = await addtocart(productId);

    setLoadingId(null);

    if (success) {
      navigate('/addtocart');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex justify-center rounded-2xl">
      <div className="w-full max-w-7xl px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          Featured Products
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                console.log('Card clicked', item._id);
                navigate(`/product/${item._id}`);
              }}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.45)] hover:shadow-[0_0_55px_rgba(129,140,248,0.65)] transition-all duration-300 ease-out cursor-pointer"
            >
              <div className="relative h-full w-full rounded-[1.35rem] bg-slate-900/90 backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col">

                {/* Image Section */}
                <div className="relative mt-3 mx-3 rounded-2xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-52 object-cover transform group-hover:scale-105 transition-transform duration-300 ease-out"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col px-4 pt-3 pb-4">
                  <h1 className="text-sm md:text-base font-semibold text-slate-50 line-clamp-1">
                    {item.name}
                  </h1>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-emerald-300">
                        ${item.price}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent opening detail page
                        handleAddToCart(item._id);
                      }}
                      disabled={loadingId === item._id}
                      className="relative inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/40 hover:shadow-indigo-500/60 hover:translate-y-[1px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/80 animate-ping" />
                      <span>
                        {loadingId === item._id ? 'Adding...' : 'Add to Cart'}
                      </span>
                    </button>

                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
