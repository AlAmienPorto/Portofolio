"use client";

import { motion } from "framer-motion";
import { Code2, PenTool, Layout, MonitorSmartphone, Layers, Zap, Globe, Palette, ArrowUpRight } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";
import SectionHeader from "@/components/SectionHeader";

// Map icon name string -> lucide component
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Code2, PenTool, Layout, MonitorSmartphone, Layers, Zap, Globe, Palette,
};

export default function Services() {
  const { services } = usePortfolioData();
  return (
    <section id="services" className="relative w-full py-24 md:py-36 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader
          index="02"
          label="Expertise"
          aside={`${String(services.length).padStart(2, "0")} disciplines`}
          title={
            <>
              What I <span className="text-outline" style={{ WebkitTextStroke: "1.5px var(--fg)" }}>Do</span>
            </>
          }
          intro="Design and engineering under one roof — so the idea, the interface and the motion ship exactly as intended."
        />

        <ul className="border-t hairline">
          {services.map((service, index) => {
            const IconComp = ICON_MAP[service.icon] || Code2;
            return (
              <motion.li
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                className="group relative border-b hairline overflow-hidden"
              >
                {/* Hover sweep */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                <div className="relative grid grid-cols-[3rem_1fr_auto] md:grid-cols-[6rem_1.1fr_1fr_auto] items-center gap-4 md:gap-8 py-7 md:py-9 px-1 md:px-4 transition-colors duration-300 group-hover:text-[var(--on-accent)]">
                  <span className="meta-label tabular-nums transition-colors duration-300 group-hover:!text-[var(--on-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-display uppercase"
                    style={{ fontSize: "clamp(2rem, 4.2vw, 3.75rem)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="hidden md:block text-base leading-relaxed opacity-75 max-w-md">
                    {service.description}
                  </p>
                  <span className="w-12 h-12 rounded-full flex items-center justify-center border border-current opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-45">
                    <IconComp size={20} strokeWidth={1.75} />
                  </span>
                  <p className="md:hidden col-span-3 text-sm leading-relaxed opacity-75 -mt-2">
                    {service.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="flex justify-end mt-10">
          <a href="#contact" className="btn-outline">
            Start a project <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
