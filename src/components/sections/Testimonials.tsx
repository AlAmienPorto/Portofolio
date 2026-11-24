"use client";

import { motion } from "framer-motion";
import { usePortfolioData } from "@/lib/portfolio-context";

const TESTIMONIAL_COLORS = ["var(--accent)"];

import SectionHeader from "@/components/SectionHeader";

export default function Testimonials() {
  const { testimonials } = usePortfolioData();
  return (
    <section
      id="testimonials"
      className="relative w-full py-24 md:py-36 px-6 md:px-12 border-t hairline"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          index="04"
          label="Testimonials"
          title={<>Kind <span style={{ color: "var(--accent)" }}>Words</span></>}
          intro="What collaborators say about working together."
        />

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => {
            const color = TESTIMONIAL_COLORS[index % TESTIMONIAL_COLORS.length];
            return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="p-8 md:p-10 rounded-xl relative flex flex-col border hairline"
              style={{ backgroundColor: "var(--surface)" }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-8 right-8 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                  opacity: 0.5,
                }}
              />

              <div className="flex justify-between items-start mb-8">
                <span className="font-display" style={{ fontSize: "4rem", lineHeight: 0.6, color }}>&ldquo;</span>
                <span className="meta-label tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              </div>
              
              <p
                className="text-base md:text-lg leading-relaxed mb-8 flex-1"
                style={{ color: "var(--fg)", fontFamily: "var(--font-manrope)" }}
              >
                {t.quote}
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    backgroundColor: "var(--accent-glow)",
                    color: color,
                    border: "1px solid var(--line-strong)",
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--fg)" }}>
                    {t.author}
                  </h4>
                  <p className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
