"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Drifting grid background with a cursor spotlight.
 * Performance: the drift is a pure CSS transform animation (compositor only),
 * the spotlight is driven by CSS variables (no React re-renders), and the
 * animation pauses while the hero is off-screen.
 */
export const InfiniteGrid = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.paused = entry.isIntersecting ? "false" : "true";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={cn("infinite-grid relative w-full h-screen overflow-hidden", className)}>
      <div className="infinite-grid__layer infinite-grid__base" aria-hidden />
      <div className="infinite-grid__layer infinite-grid__spot" aria-hidden />

      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div
          className="absolute right-[-10%] top-[-20%] w-[45%] h-[50%] rounded-full"
          style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-center">{children}</div>
    </div>
  );
};
