import React, { useEffect, useState } from "react";

export default function SlideAlert({ message, type = "success", duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const colors = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    warning: "bg-amber-500",
    info: "bg-blue-600",
  };

  if (!visible) return null;

  return (
    <div
      className={`${colors[type]} fixed top-4 right-4 px-5 py-3 rounded-lg text-white text-sm shadow-xl animate-slideDown`}
    >
      {message}
    </div>
  );
}
