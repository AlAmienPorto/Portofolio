"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioData } from "@/lib/portfolio-context";

export default function Preloader() {
  const { profile } = usePortfolioData();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 4 + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 800);
      }
      setProgress(Math.min(current, 100));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 48;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between px-8 py-12 pointer-events-none"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {/* Top Bar */}
          <div className="w-full flex justify-between items-center" style={{ color: "var(--muted)" }}>
            <span className="font-bold text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-syne)" }}>
              {profile.name || "Jawad Al Amien"}
            </span>
            <span className="font-bold text-xs uppercase tracking-widest">
              Portfolio 2026
            </span>
          </div>

          {/* Center — Circular Progress */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-32 h-32">
              {/* Background ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 110 110">
                <circle
                  cx="55" cy="55" r="48"
                  fill="none"
                  stroke="var(--accent-lime-glow)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="55" cy="55" r="48"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--accent-lime)" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Counter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-3xl font-black tabular-nums"
                  style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
                >
                  {Math.round(progress)}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <h1
                className="text-3xl md:text-5xl font-black uppercase tracking-tighter"
                style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
              >
                Creative
              </h1>
              <h1
                className="text-3xl md:text-5xl font-black uppercase tracking-tighter"
                style={{
                  fontFamily: "var(--font-syne)",
                  background: "linear-gradient(135deg, var(--accent), var(--accent-lime))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Developer
              </h1>
            </div>
          </div>

          {/* Bottom */}
          <div className="w-full flex justify-between items-end">
            <span
              className="text-xs uppercase tracking-widest font-bold"
              style={{ color: "var(--muted)" }}
            >
              Loading Experience
            </span>
            <span
              className="text-xs uppercase tracking-widest font-bold"
              style={{ color: "var(--muted)" }}
            >
              Indonesia
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
