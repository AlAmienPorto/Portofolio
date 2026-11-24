"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from "framer-motion";
import { usePortfolioData } from "@/lib/portfolio-context";

const EASE = [0.76, 0, 0.24, 1] as const;
const ROLES = ["Creative Developer", "UI/UX Designer", "Motion Designer"];
const DURATION = 1.9; // seconds for 0 → 100

export default function Preloader() {
  const { profile } = usePortfolioData();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(0);

  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(progress, (v) => v / 100);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(progress, 100, {
      duration: reduced ? 0.3 : DURATION,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setTimeout(() => setLoading(false), reduced ? 0 : 350),
    });
    const id = setInterval(() => setRole((r) => (r + 1) % ROLES.length), (DURATION * 1000) / ROLES.length);
    document.documentElement.style.overflow = "hidden";
    return () => {
      controls.stop();
      clearInterval(id);
      document.documentElement.style.overflow = "";
    };
  }, [progress]);

  useEffect(() => {
    if (!loading) document.documentElement.style.overflow = "";
  }, [loading]);

  const name = (profile.name || "Jawad Al Amien").toUpperCase();
  const [first, ...rest] = name.split(" ");

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-[120] flex flex-col justify-between px-6 md:px-12 py-6 md:py-8 overflow-hidden"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {/* Top rail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-y-2 pb-4 border-b hairline"
          >
            <span className="meta-label">
              <span style={{ color: "var(--accent)" }}>(00)</span> Portfolio ©{new Date().getFullYear()}
            </span>
            <span className="meta-label text-right md:text-left hidden md:block">{profile.location || "Indonesia"}</span>
            <span className="meta-label hidden md:block">Design · Code · Motion</span>
            <span className="meta-label text-right">Loading</span>
          </motion.div>

          {/* Name + rotating role */}
          <div className="flex flex-col">
            {[first, rest.join(" ")].filter(Boolean).map((line, i) => (
              <div key={line} className="overflow-hidden">
                <motion.h1
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: EASE }}
                  className="font-display uppercase"
                  style={{
                    fontSize: "clamp(4rem, 15vw, 13rem)",
                    lineHeight: 0.84,
                    color: i === 1 ? "var(--accent)" : "var(--fg)",
                  }}
                >
                  {line}
                </motion.h1>
              </div>
            ))}

            <div className="flex items-center gap-3 mt-6 md:mt-8 h-7 overflow-hidden">
              <span className="w-8 h-px" style={{ backgroundColor: "var(--line-strong)" }} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={role}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="font-grotesk text-base md:text-lg"
                  style={{ color: "var(--muted)" }}
                >
                  {ROLES[role]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom: progress */}
          <div>
            <div className="flex items-end justify-between gap-6 mb-4">
              <span className="meta-label pb-2">Crafting the experience</span>
              <span
                className="font-display tabular-nums leading-none"
                style={{ fontSize: "clamp(4rem, 12vw, 10rem)", color: "var(--fg)" }}
              >
                <motion.span>{counter}</motion.span>
                <span style={{ color: "var(--accent)" }}>%</span>
              </span>
            </div>
            <div className="relative h-px w-full" style={{ backgroundColor: "var(--line)" }}>
              <motion.div
                className="absolute inset-y-0 left-0 w-full origin-left"
                style={{ scaleX: bar, backgroundColor: "var(--accent)", height: 2, top: -0.5 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
