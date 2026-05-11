"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePortfolioData } from "@/lib/portfolio-context";
import { 
  SiNextdotjs, 
  SiReact, 
  SiTypescript, 
  SiFramer, 
  SiGreensock, 
  SiThreedotjs, 
  SiWebgl, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiFigma, 
  SiBlender 
} from "react-icons/si";

const IconMap: Record<string, any> = {
  nextdotjs: SiNextdotjs,
  react: SiReact,
  typescript: SiTypescript,
  framer: SiFramer,
  greensock: SiGreensock,
  threedotjs: SiThreedotjs,
  webgl: SiWebgl,
  tailwindcss: SiTailwindcss,
  nodedotjs: SiNodedotjs,
  figma: SiFigma,
  blender: SiBlender,
};

function SkillBadge({ name, icon }: { name: string; icon: string }) {
  const IconComponent = IconMap[icon];
  const isUrl = icon.startsWith("http") || icon.startsWith("/");

  return (
    <div
      className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-xl mx-2"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--fg)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      {isUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt={name} className="w-4 h-4 object-contain" />
      ) : IconComponent ? (
        <IconComponent size={18} className="flex-shrink-0" />
      ) : (
        <span className="text-sm">{icon}</span>
      )}

      <span
        className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        {name}
      </span>
    </div>
  );
}

function MarqueeRow({
  skills,
  direction = "ltr",
  speed = 30,
}: {
  skills: { name: string; icon: string }[];
  direction?: "ltr" | "rtl";
  speed?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const repeated = [...skills, ...skills, ...skills, ...skills];
  const animX = direction === "ltr" ? ["0%", "-50%"] : ["-50%", "0%"];
  
  // Slow down factor when hovered
  const duration = isHovered ? speed * 4 : speed;

  return (
    <div 
      className="flex overflow-hidden w-full py-1.5 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex"
        animate={{ x: animX }}
        transition={{ 
          duration: duration, 
          repeat: Infinity, 
          ease: "linear",
        }}
        style={{ width: "max-content" }}
      >
        {repeated.map((skill, i) => (
          <SkillBadge key={i} name={skill.name} icon={skill.icon} />
        ))}
      </motion.div>
    </div>
  );
}


export default function SkillMarquee() {
  const { skills } = usePortfolioData();
  
  if (!skills || skills.length === 0) return null;

  const half = Math.ceil(skills.length / 2);
  const skillsRow1 = skills.slice(0, half);
  const skillsRow2 = skills.slice(half);

  return (
    <section
      className="relative w-full py-12 md:py-16 overflow-hidden"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-24 mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: "var(--accent-lime)" }} />
          <h3 
            className="text-lg md:text-xl font-black uppercase tracking-tight" 
            style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
          >
            Tech <span style={{ color: "var(--accent-lime)" }}>Stack</span>
          </h3>
        </motion.div>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <MarqueeRow skills={skillsRow1} direction="ltr" speed={40} />
        <MarqueeRow skills={skillsRow2} direction="rtl" speed={45} />
      </div>

      {/* Decorative text — smaller for compact feel */}
      <div 
        className="absolute bottom-[-10px] right-6 text-[10vw] font-black uppercase leading-none opacity-[0.015] pointer-events-none select-none"
        style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
      >
        Tools
      </div>
    </section>
  );
}



