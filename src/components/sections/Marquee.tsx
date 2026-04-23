"use client";

import { motion } from "framer-motion";

const text = "Creative Engineer • Motion Designer • Editor • UI/UX Architect • ";

export default function Marquee() {
  return (
    <section className="w-full py-20 bg-black text-white overflow-hidden relative border-y border-zinc-900 z-10">
      <div className="flex whitespace-nowrap">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <div className="text-6xl md:text-9xl font-black uppercase tracking-tighter shrink-0 text-transparent mr-4" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
            {text}
          </div>
          <div className="text-6xl md:text-9xl font-black uppercase tracking-tighter shrink-0 text-transparent mr-4" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
            {text}
          </div>
          <div className="text-6xl md:text-9xl font-black uppercase tracking-tighter shrink-0 text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
            {text}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
