"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function HolographicCard({ src, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smoothness
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  // Shine position transformation
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-sm aspect-[3/4] mx-auto perspective-1000 group cursor-none"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_20px_50px_rgba(190,242,100,0.2)]"
      >
        {/* Profile Image */}
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Base Image Overlay (Darken a bit on hover for pop) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[5]" />

        {/* Holographic Color Shift (Base Rainbow) */}
        <motion.div
          style={{
            background: `linear-gradient(135deg, 
              rgba(0, 120, 255, 0.2) 0%, 
              rgba(0, 255, 255, 0.2) 25%, 
              rgba(120, 0, 255, 0.2) 50%, 
              rgba(0, 255, 255, 0.2) 75%, 
              rgba(0, 120, 255, 0.2) 100%
            )`,
            backgroundSize: "400% 400%",
            backgroundPosition: useTransform(mouseX, [-0.5, 0.5], ["0% 0%", "100% 100%"]),
            mixBlendMode: "overlay",
          }}
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Holofoil Rare: Vertical Beam Effect */}
        <motion.div
          style={{
            background: `repeating-linear-gradient(
              90deg, 
              transparent 0%, 
              rgba(255, 255, 255, 0) 5%, 
              rgba(0, 180, 255, 0.15) 10%, 
              rgba(150, 50, 255, 0.2) 15%, 
              rgba(0, 255, 255, 0.15) 20%, 
              transparent 25%
            )`,
            backgroundSize: "200% 100%",
            backgroundPosition: useTransform(mouseX, [-0.5, 0.5], ["100% 0%", "-100% 0%"]),
            mixBlendMode: "color-dodge",
            filter: "brightness(1.4) contrast(1.2) saturate(1.5)",
          }}
          className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Holofoil Sparkle / Grain */}
        <div 
          className="absolute inset-0 z-20 opacity-[0.03] mix-blend-overlay pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Dynamic Shining Glare */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.7) 0%, transparent 45%)`,
            mixBlendMode: "soft-light",
          }}
          className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Diagonal Shining Sweep */}
        <motion.div
          style={{
            background: "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.3) 48%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 52%, transparent 60%)",
            backgroundSize: "200% 200%",
            backgroundPosition: useTransform(mouseX, [-0.5, 0.5], ["200% 0%", "0% 0%"]),
            mixBlendMode: "overlay",
          }}
          className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />


        {/* Status Pill Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <div className="glass-card flex items-center justify-between p-3 rounded-xl backdrop-blur-xl border-white/10">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <Image src={src} alt="avatar" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 leading-none mb-1">@j.alamien</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  <p className="text-xs font-bold text-white uppercase">Online</p>
                </div>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-lime-400 text-black text-[10px] font-black uppercase tracking-tighter hover:scale-105 transition-transform">
              Contact Me
            </button>
          </div>
        </div>

        {/* Top Tag Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <span className="px-3 py-1 rounded-full glass-card text-[10px] font-black uppercase tracking-widest text-white/80 border-white/10 backdrop-blur-md">
            Jawad Al Amien
          </span>
        </div>

        {/* Card Border Inner Glow */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none z-40" />
      </motion.div>

      {/* Background Glow */}
      <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
    </div>
  );
}
