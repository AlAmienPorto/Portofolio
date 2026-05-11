"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePortfolioData } from "@/lib/portfolio-context";
import { Download, ExternalLink, Calendar, Briefcase, MapPin, CheckCircle2 } from "lucide-react";

import HolographicCard from "@/components/HolographicCard";

import ShineLabel from "@/components/ShineLabel";

export default function About() {
  const { profile, experience } = usePortfolioData();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full py-24 md:py-40 px-6 md:px-24 overflow-hidden"
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
              <ShineLabel text="✦ About Me" fontSize="text-2xl" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9]"
              style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
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
              className="text-lg md:text-2xl leading-relaxed"
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
              <a
                href="/uploads/File/RESUME_JAWAD.pdf"
                download="RESUME_JAWAD.pdf"
                className="hover-target flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                style={{
                  backgroundColor: "var(--accent-lime)",
                  color: "#081c01ff",
                  boxShadow: "0 10px 30px var(--shadow-lime)"
                }}
              >
                <Download size={16} strokeWidth={3} />
                Download Resume
              </a>
              <div
                className="flex items-center gap-2 px-6 py-4 rounded-2xl glass-card text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--fg)" }}
              >
                <MapPin size={14} style={{ color: "var(--accent-lime)" }} />
                {profile.location || "Indonesia"}
              </div>
            </motion.div>
          </div>
        </div>


        {/* Experience Section — syfrsam Deep Dive Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2fr] gap-12 lg:gap-24">
          <div className="lg:sticky lg:top-40 h-fit">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl font-black uppercase tracking-tight mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
            >
              Professional <br /> Experience
            </motion.h3>
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "var(--accent-lime)" }} />
          </div>

          <div className="flex flex-col gap-4 relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-lime-400/50 via-white/10 to-transparent hidden md:block" />

            {experience && experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="relative md:pl-16 py-10 group/exp transition-all duration-500 border-b border-white/5 last:border-0"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-[-4px] top-[46px] w-2 h-2 rounded-full hidden md:block z-20 bg-white/20 group-hover/exp:bg-lime-400 group-hover/exp:scale-125 transition-all duration-500"
                  style={{ boxShadow: "0 0 0 4px rgba(0,0,0,1)" }}
                />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter" style={{ color: "var(--fg)" }}>
                      {exp.company}
                    </h4>
                    <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--accent-lime)" }}>
                      {exp.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 group-hover/exp:opacity-100 transition-opacity">
                    <Calendar size={14} />
                    {exp.duration}
                  </div>
                </div>

                <ul className="flex flex-col gap-3 mt-4">
                  {exp.description.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-base" style={{ color: "var(--muted)" }}>
                      <CheckCircle2 size={16} className="mt-1 flex-shrink-0" style={{ color: "var(--accent-lime)" }} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

