"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const heroImageCount = 240;
    let loadedCount = 0;
    
    // Simulate loading if images cache too fast
    const interval = setInterval(() => {
      loadedCount += 5;
      const calcProgress = Math.min((loadedCount / heroImageCount) * 100, 100);
      setProgress(calcProgress);
      
      if (calcProgress === 100) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 1000); // 1s wait after reaching 100%
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      animate={{
        clipPath: loading
          ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
          : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      }}
      transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white px-8 py-12 pointer-events-none"
    >
      <div className="w-full flex justify-between uppercase text-xs tracking-widest text-zinc-500">
        <span>IfalEX</span>
        <span>Portfolio 2026</span>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4 text-center">
          Web Developer
        </h1>
        <div className="w-64 h-[2px] bg-zinc-800 rounded-full overflow-hidden mt-8">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
      </div>

      <div className="w-full flex justify-between items-end">
        <span className="uppercase text-xs tracking-widest text-zinc-500">
          Loading Experience
        </span>
        <span className="text-5xl md:text-8xl font-bold tabular-nums">
          {Math.round(progress)}
        </span>
      </div>
    </motion.div>
  );
}
