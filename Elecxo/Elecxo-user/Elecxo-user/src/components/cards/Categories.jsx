import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Categories() {
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://13.62.225.195/api/product/getcategory"
      );
      setCategory(response.data.category || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleCategoryClick = (item) => {
    // Option 1: use id
    navigate(`/category/${item._id}`);

    // Option 2 (if you have slug in API):
    // navigate(`/category/${item.slug}`);
  };

  return (
    <div className="w-full p-4 sm:p-5 md:p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl shadow-xl border border-white/10">
      <h1 className="font-semibold text-lg sm:text-xl md:text-2xl tracking-wide uppercase text-center mb-4 sm:mb-6 text-slate-100">
        Categories
      </h1>

      <div
        className="
          flex flex-nowrap
          gap-4 sm:gap-5
          overflow-x-auto
          hide-scrollbar
          scroll-smooth
          py-2 sm:py-3 px-1
        "
      >
        {category.map((item, index) => (
          <motion.div
            key={item._id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCategoryClick(item)}
            className="
              min-w-[150px] sm:min-w-[170px] md:min-w-[160px]
              rounded-2xl p-[1px]
              bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500
              shadow-[0_0_25px_rgba(79,70,229,0.55)]
              hover:shadow-[0_0_40px_rgba(56,189,248,0.7)]
              transition-all duration-300
              cursor-pointer
            "
            role="button"
          >
            <div
              className="
                relative h-full w-full rounded-[1.05rem]
                bg-slate-900/95 backdrop-blur-xl
                border border-white/10
                flex flex-col items-center justify-between
                px-3 sm:px-4 pt-4 pb-3
              "
            >
              <div className="relative mb-3">
                <div
                  className="
                    absolute inset-0 blur-xl
                    bg-gradient-to-tr from-indigo-500/60 via-cyan-400/50 to-fuchsia-400/40
                    opacity-60
                  "
                />
                <div
                  className="
                    relative w-20 h-20 sm:w-20 sm:h-20 rounded-full
                    bg-slate-900/90 border border-white/15
                    flex items-center justify-center overflow-hidden
                  "
                >
                  <img
                    className="w-13 h-13 sm:w-12 sm:h-12 object-contain"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
              </div>

              <div className="text-xs sm:text-sm md:text-base font-medium text-slate-50 text-center">
                {item.name}
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-2.5 sm:px-3 py-1 border border-slate-600/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wide text-slate-300">
                  Explore {item.name}
                </span>
              </div>

              <div
                className="
                  pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2
                  w-16 sm:w-20 h-1 rounded-full
                  bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent
                  opacity-70
                "
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
