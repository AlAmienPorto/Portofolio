"use client";

import { motion } from "framer-motion";
import { Code2, PenTool, Layout, MonitorSmartphone, Layers, Zap, Globe, Palette } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

// Map icon name string -> lucide component
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Code2, PenTool, Layout, MonitorSmartphone, Layers, Zap, Globe, Palette,
};

// Visual config per card slot
const SLOT_CONFIG = [
  { gradient: "from-[#7c6fff]/20 to-[#7c6fff]/5", iconColor: "#7c6fff", tag: "Dev" },
  { gradient: "from-[#ff6fbb]/20 to-[#ff6fbb]/5", iconColor: "#ff6fbb", tag: "Engineering" },
  { gradient: "from-[#6ff0ff]/20 to-[#6ff0ff]/5", iconColor: "#6ff0ff", tag: "Motion" },
  { gradient: "from-[#ffb86f]/20 to-[#ffb86f]/5", iconColor: "#ffb86f", tag: "Design" },
  { gradient: "from-[#7c6fff]/20 to-[#ff6fbb]/5", iconColor: "#c084fc", tag: "Other" },
  { gradient: "from-[#6ff0ff]/20 to-[#7c6fff]/5", iconColor: "#38bdf8", tag: "Other" },
];

import ShineLabel from "@/components/ShineLabel";

export default function Services() {
  const { services } = usePortfolioData();
  return (
    <section
      id="services"
      className="relative w-full py-24 md:py-40 px-6 md:px-24"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-4"
            >
              <ShineLabel text="Expertise" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
              style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
            >
              Services
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg max-w-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Delivering high-performance digital solutions tailored to elevate your brand.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => {
            const slot = SLOT_CONFIG[index % SLOT_CONFIG.length];
            const IconComp = ICON_MAP[service.icon] || Code2;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-8 md:p-10 rounded-2xl group relative overflow-hidden hover-target"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slot.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                />

                <div className="relative z-10">
                  {/* Tag + Icon row */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${slot.iconColor}20`,
                        color: slot.iconColor,
                        border: `1px solid ${slot.iconColor}40`,
                      }}
                    >
                      {slot.tag}
                    </span>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${slot.iconColor}15` }}
                    >
                      <IconComp
                        size={22}
                        color={slot.iconColor}
                      />
                    </div>
                  </div>

                  <h3
                    className="text-2xl md:text-3xl font-black uppercase mb-4 tracking-tight"
                    style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
