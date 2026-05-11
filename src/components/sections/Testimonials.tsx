"use client";

import { motion } from "framer-motion";
import { usePortfolioData } from "@/lib/portfolio-context";

const TESTIMONIAL_COLORS = ["#7c6fff", "#ff6fbb", "#6ff0ff", "#ffb86f"];

import ShineLabel from "@/components/ShineLabel";

export default function Testimonials() {
  const { testimonials } = usePortfolioData();
  return (
    <section
      id="testimonials"
      className="relative w-full py-24 md:py-40 px-6 md:px-24"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-4"
          >
            <ShineLabel text="Testimonials" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
            style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
          >
            What They Say
          </motion.h2>
        </div>

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
              className="glass-card p-8 md:p-10 rounded-2xl relative flex flex-col"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-8 right-8 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                  opacity: 0.5,
                }}
              />

              <div className="text-4xl md:text-5xl font-black mb-6" style={{ color: color }}>
                "
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
                    backgroundColor: `${color}15`,
                    color: color,
                    border: `1px solid ${color}40`,
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
