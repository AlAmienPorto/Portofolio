"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";
import ScrambleText from "@/components/ScrambleText";
import { InfiniteGrid } from "@/components/ui/the-infinite-grid";

const EASE = [0.22, 1, 0.36, 1] as const;

function useJakartaTime() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Hero() {
  const { profile, projects, creativeWorks } = usePortfolioData();
  const containerRef = useRef<HTMLDivElement>(null);
  const time = useJakartaTime();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -80]);

  const workCount = (projects?.length || 0) + (creativeWorks?.length || 0);

  const stats = [
    { num: profile.experience?.replace(/\s*years?/i, "") || "5+", label: "Years of practice" },
    { num: workCount ? String(workCount).padStart(2, "0") : "40+", label: "Selected works" },
    { num: "20+", label: "Happy clients" },
  ];

  return (
    <section ref={containerRef} id="home" className="relative w-full min-h-[100svh] overflow-hidden">
      <InfiniteGrid className="w-full min-h-[100svh] h-auto">
        <motion.div
          style={{ opacity, y }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-10 min-h-[100svh] flex flex-col"
        >
          {/* Meta rail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-y-3 pb-4 border-b hairline"
          >
            <span className="meta-label">
              <span style={{ color: "var(--accent)" }}>(00)</span> Portfolio ©{new Date().getFullYear()}
            </span>
            <span className="meta-label text-right md:text-left">{profile.location || "Indonesia"}</span>
            <span className="meta-label tabular-nums" suppressHydrationWarning>
              Local time {time || "--:--"} WIB
            </span>
            <span className="meta-label flex items-center gap-2 justify-end">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500" />
              </span>
              {profile.availability || "Available"}
            </span>
          </motion.div>

          {/* Name */}
          <div className="flex-1 flex flex-col justify-center py-10 md:py-6">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
                className="font-display uppercase"
                style={{ fontSize: "clamp(4.5rem, 23vw, 17rem)", lineHeight: 0.82, color: "var(--fg)" }}
              >
                <ScrambleText text="JAWAD" delay={600} speed={50} />
              </motion.h1>
            </div>
            <div className="overflow-hidden flex items-end justify-between gap-6">
              <motion.h1
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.62, duration: 1.1, ease: EASE }}
                className="font-display uppercase md:pl-[12vw]"
                style={{ fontSize: "clamp(4.5rem, 23vw, 17rem)", lineHeight: 0.82, color: "var(--accent)" }}
              >
                <ScrambleText text="AL AMIEN" delay={900} speed={50} />
              </motion.h1>
              <motion.a
                href="#works"
                initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
                aria-label="Scroll to selected works"
                className="hidden md:flex shrink-0 mb-[2vw] w-[8.5rem] h-[8.5rem] rounded-full items-center justify-center group"
                style={{ border: "1px solid var(--line-strong)" }}
              >
                <ArrowDownRight
                  size={44}
                  strokeWidth={1.25}
                  className="transition-transform duration-500 group-hover:rotate-[-45deg]"
                  style={{ color: "var(--fg)" }}
                />
              </motion.a>
            </div>
          </div>

          {/* Bottom info grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t hairline"
          >
            <div className="md:col-span-5 flex flex-col gap-6">
              <p className="text-lg md:text-xl leading-relaxed max-w-md" style={{ color: "var(--fg)" }}>
                {profile.tagline?.replace(/Designers\b/, "Designer") || "Creative Developer & UI/UX Designer"}
                <span style={{ color: "var(--muted)" }}>
                  {" "}— crafting interfaces, motion and visuals that make products feel considered.
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#works" className="btn-primary">
                  View work <ArrowUpRight size={16} />
                </a>
                <a href="#contact" className="btn-outline">
                  Let&apos;s connect
                </a>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-3 md:border-l hairline">
              {stats.map((s, i) => (
                <div key={s.label} className={`md:pl-8 ${i > 0 ? "border-l hairline pl-4" : ""}`}>
                  <p className="font-display" style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)", color: "var(--fg)" }}>
                    {s.num}
                  </p>
                  <p className="meta-label mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </InfiniteGrid>
    </section>
  );
}
