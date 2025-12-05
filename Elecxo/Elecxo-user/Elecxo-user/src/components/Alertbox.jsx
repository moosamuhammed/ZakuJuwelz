import React, { useEffect, useState } from "react";

export default function NeonAlert({
  type = "info",          // "success" | "error" | "warning" | "info"
  title,
  message,
  duration = 4000,        // ms
  onClose,
  position = "top-right", // "top-right" | "top-center" | "bottom-right"
}) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!duration) return;

    const start = Date.now();
    const total = duration;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / total) * 100);
      setProgress(pct);
      if (pct <= 0) {
        handleClose();
      }
    }, 30);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const config = {
    success: {
      label: "Success",
      icon: "✔",
      ring: "ring-emerald-400/40",
      border: "border-emerald-400/60",
      glow: "shadow-[0_0_30px_rgba(16,185,129,0.6)]",
      gradient: "from-emerald-500/30 via-slate-900/90 to-slate-950",
      bar: "bg-emerald-400",
    },
    error: {
      label: "Error",
      icon: "✖",
      ring: "ring-red-400/40",
      border: "border-red-400/60",
      glow: "shadow-[0_0_30px_rgba(248,113,113,0.7)]",
      gradient: "from-red-500/30 via-slate-900/90 to-slate-950",
      bar: "bg-red-400",
    },
    warning: {
      label: "Warning",
      icon: "⚠",
      ring: "ring-amber-400/40",
      border: "border-amber-400/60",
      glow: "shadow-[0_0_30px_rgba(251,191,36,0.7)]",
      gradient: "from-amber-400/30 via-slate-900/90 to-slate-950",
      bar: "bg-amber-300",
    },
    info: {
      label: "Info",
      icon: "ℹ",
      ring: "ring-sky-400/40",
      border: "border-sky-400/60",
      glow: "shadow-[0_0_30px_rgba(56,189,248,0.7)]",
      gradient: "from-sky-500/30 via-slate-900/90 to-slate-950",
      bar: "bg-sky-400",
    },
  };

  const { label, icon, ring, border, glow, gradient, bar } =
    config[type] || config.info;

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]} animate-toastSlideIn`}
    >
      <div
        className={`relative w-[320px] max-w-sm rounded-2xl border ${border} ${glow}
        bg-gradient-to-br ${gradient} backdrop-blur-xl px-4 py-3.5
        ring-1 ${ring} overflow-hidden`}
      >
        {/* Glow line at top */}
        <div className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />

        <div className="flex items-start gap-3">
          {/* Icon bubble */}
          <div
            className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full 
                       bg-slate-950/70 border border-white/10 text-base"
          >
            <span>{icon}</span>
          </div>

          {/* Text content */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                {title || label}
              </p>
              <span className="h-1 w-1 rounded-full bg-slate-300/70" />
              <span className="text-[10px] text-slate-400">
                just now
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-100 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="ml-1 mt-0.5 text-slate-400 hover:text-slate-100 text-xs px-1"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 w-full rounded-full bg-slate-800/80 overflow-hidden">
          <div
            className={`h-full ${bar} transition-[width] duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
