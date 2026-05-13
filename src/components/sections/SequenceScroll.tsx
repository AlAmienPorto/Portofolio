"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolioData } from "@/lib/portfolio-context";
import { useTheme } from "@/lib/theme";
import ScrambleText from "@/components/ScrambleText";

export default function Hero() {
  const { profile } = usePortfolioData();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);
  const y       = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: "80px" }} // offset fixed navbar
    >
      {/* Mesh blobs */}
      <div
        className="absolute top-[-200px] left-[-200px] w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,111,255,0.14) 0%, transparent 70%)", animation: "meshFloat1 12s ease-in-out infinite alternate" }}
      />
      <div
        className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,111,187,0.09) 0%, transparent 70%)", animation: "meshFloat2 15s ease-in-out infinite alternate" }}
      />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-16 flex flex-col"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="section-label mb-6"
        >
          Hello, World ✦ Based in Indonesia
        </motion.div>

        {/* HERO TITLE — Bebas Neue */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 110, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-bebas, var(--font-syne))",
              fontSize: "clamp(3.2rem, 15vw, 13rem)",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              color: "var(--fg)",
            }}
          >
            <ScrambleText text="JAWAD" delay={600} speed={50} />
          </motion.h1>
        </div>

        <div className="overflow-hidden flex items-end gap-4 flex-wrap">
          <motion.h1
            initial={{ y: 110, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.68, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-bebas, var(--font-syne))",
              fontSize: "clamp(3.2rem, 15vw, 13rem)",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
            }}
          >
            <ScrambleText
              text="AL AMIEN"
              delay={900}
              speed={50}
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            />
          </motion.h1>

          {/* Availability pill — floats next to title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="glass-card flex items-center gap-2 px-4 py-2 rounded-full mb-4 flex-shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-green-400">
              Available
            </span>
          </motion.div>
        </div>

        {/* Tagline row */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="text-lg md:text-xl leading-relaxed max-w-md"
            style={{ color: "var(--muted)", fontFamily: "var(--font-manrope)" }}
          >
            Creative Developer & UI/UX Designer — crafting immersive digital experiences that push the boundaries of the modern web.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="flex flex-wrap gap-3 sm:mt-1"
          >
            <a 
              href="#works" 
              className="btn-primary hover-target py-3 px-6 md:py-4 md:px-8 text-sm md:text-base"
              style={{ color: theme === "dark" ? "#000" : "#fff" }}
            >
              View Work
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#contact" className="btn-outline hover-target">
              Let's Connect
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-12 right-8 md:right-16 hidden md:flex flex-col items-center gap-3"
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--muted)", writingMode: "vertical-rl" }}
          >
            Scroll Down
          </span>
          <div
            className="w-px h-16"
            style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }}
          />
        </motion.div>
      </motion.div>

      {/* Stats bar — bottom */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.7 }}
        className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-16 py-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-wrap gap-8 md:gap-16">
          {[
            { num: "5+", label: "Years Experience" },
            { num: "40+", label: "Projects Done" },
            { num: "20+", label: "Happy Clients" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span
                style={{
                  fontFamily: "var(--font-bebas, var(--font-syne))",
                  fontSize: "2.4rem",
                  lineHeight: 1,
                  background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.num}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
