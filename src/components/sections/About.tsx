"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { usePortfolioData } from "@/lib/portfolio-context";
import { Download, MapPin, ArrowUpRight } from "lucide-react";
import type { Experience } from "@/lib/portfolio-context";

import HolographicCard from "@/components/HolographicCard";


export default function About() {
  const { profile, experience } = usePortfolioData();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full py-24 md:py-36 px-6 md:px-12 overflow-hidden"
    >
      {/* Dynamic Background elements */}
      <div
        className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, var(--accent-lime) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Grid — syfrsam Style with Holographic Card */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-24 items-center mb-24 md:mb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HolographicCard
              src={profile.photo || "/uploads/profile.png"}
              alt={profile.name || "Profile"}
            />
          </motion.div>

          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-2"
            >
              <div className="flex items-center gap-4 pb-4 border-b hairline">
                <span className="meta-label" style={{ color: "var(--accent)" }}>(01)</span>
                <span className="meta-label">About me</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display uppercase"
              style={{ fontSize: "clamp(3.25rem, 7vw, 6.5rem)", color: "var(--fg)" }}
            >
              A Creative <br />
              <span style={{ color: "var(--accent-lime)" }}>Developer</span> <br />
              & Designer
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: "var(--muted)", fontFamily: "var(--font-manrope)" }}
            >
              {profile.bio || "Creative developer building immersive digital experiences."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a href="/uploads/File/RESUME_JAWAD.pdf" download="RESUME_JAWAD.pdf" className="btn-primary">
                <Download size={16} />
                Download Resume
              </a>
              <span className="btn-outline pointer-events-none">
                <MapPin size={14} style={{ color: "var(--accent)" }} />
                {profile.location || "Indonesia"}
              </span>
            </motion.div>
          </div>
        </div>


        {/* ── Professional Experience ── */}
        <ExperienceList experience={experience || []} />
      </div>
    </section>
  );
}


function isCurrent(duration: string) {
  return /present|now|sekarang/i.test(duration || "");
}

function splitDuration(duration: string) {
  const [from, to] = (duration || "").split(/\s*[-–—]\s*/);
  return { from: from || duration, to: to ? (isCurrent(to) ? "Now" : to) : "" };
}

function ExperienceList({ experience }: { experience: Experience[] }) {
  if (!experience.length) return null;

  // Current roles first, then by start year (newest first)
  const sorted = [...experience].sort((a, b) => {
    const c = Number(isCurrent(b.duration)) - Number(isCurrent(a.duration));
    if (c) return c;
    return (parseInt(splitDuration(b.duration).from) || 0) - (parseInt(splitDuration(a.duration).from) || 0);
  });
  const years = experience.map((e) => parseInt(splitDuration(e.duration).from)).filter((n) => !Number.isNaN(n));
  const since = years.length ? Math.min(...years) : null;

  return (
    <div>
      <div className="flex items-center gap-4 pb-4 mb-10 md:mb-14 border-b hairline">
        <span className="meta-label" style={{ color: "var(--accent)" }}>(01.1)</span>
        <span className="meta-label">Professional experience</span>
        <span className="flex-1" />
        <span className="meta-label hidden sm:inline">
          {String(experience.length).padStart(2, "0")} roles{since ? ` · since ${since}` : ""}
        </span>
      </div>

      <h3 className="font-display uppercase mb-12 md:mb-16" style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: "var(--fg)" }}>
        Where I&apos;ve <span style={{ color: "var(--accent)" }}>worked</span>
      </h3>

      <ol className="border-t hairline">
        {sorted.map((exp, idx) => {
          const { from, to } = splitDuration(exp.duration);
          const current = isCurrent(exp.duration);
          return (
            <motion.li
              key={exp.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: Math.min(idx, 3) * 0.06 }}
              className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 border-b hairline"
            >
              {/* hover rail */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
                style={{ backgroundColor: "var(--accent)" }}
              />

              {/* Period */}
              <div className="md:col-span-3 md:pl-6 flex md:flex-col items-baseline md:items-start gap-3 md:gap-2">
                <span className="font-display tabular-nums" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)", color: "var(--fg)" }}>
                  {from}
                  {to && <span style={{ color: "var(--muted)" }}> — {to}</span>}
                </span>
                {current && (
                  <span
                    className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full font-grotesk text-[11px] font-medium"
                    style={{ backgroundColor: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--line-strong)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                    Current
                  </span>
                )}
              </div>

              {/* Company + role */}
              <div className="md:col-span-4">
                <h4 className="font-display uppercase mb-2" style={{ fontSize: "clamp(2rem, 3.4vw, 3rem)", color: "var(--fg)" }}>
                  {exp.company}
                </h4>
                <p className="meta-label" style={{ color: "var(--accent)" }}>
                  {exp.role}
                </p>
              </div>

              {/* Highlights */}
              <ul className="md:col-span-5 flex flex-col gap-2.5">
                {exp.description.filter((d) => d.trim()).map((bullet, i) => (
                  <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-2 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
                    <ArrowUpRight size={14} className="mt-1 rotate-45" style={{ color: "var(--accent)" }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
