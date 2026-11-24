"use client";

import type { IconType } from "react-icons";
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript, SiFramer, SiGreensock, SiThreedotjs, SiWebgl,
  SiTailwindcss, SiNodedotjs, SiFigma, SiBlender, SiFlutter, SiDart, SiLaravel, SiHtml5, SiCss,
  SiGithub, SiGit, SiVercel, SiCanva, SiDavinciresolve,
} from "react-icons/si";
import {
  TbBrandAdobePhotoshop, TbBrandAdobeIllustrator, TbBrandAdobeAfterEffect, TbBrandAdobePremier,
  TbBrandAdobeXd, TbBrandAdobeIndesign, TbBrandAdobe,
} from "react-icons/tb";
import { Wrench } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

type Group = "Development" | "Motion & 3D" | "Design" | "Tools";

const ICONS: Record<string, { icon: IconType; group: Group }> = {
  nextdotjs: { icon: SiNextdotjs, group: "Development" },
  react: { icon: SiReact, group: "Development" },
  typescript: { icon: SiTypescript, group: "Development" },
  javascript: { icon: SiJavascript, group: "Development" },
  tailwindcss: { icon: SiTailwindcss, group: "Development" },
  nodedotjs: { icon: SiNodedotjs, group: "Development" },
  flutter: { icon: SiFlutter, group: "Development" },
  dart: { icon: SiDart, group: "Development" },
  laravel: { icon: SiLaravel, group: "Development" },
  html5: { icon: SiHtml5, group: "Development" },
  css: { icon: SiCss, group: "Development" },
  framer: { icon: SiFramer, group: "Motion & 3D" },
  greensock: { icon: SiGreensock, group: "Motion & 3D" },
  threedotjs: { icon: SiThreedotjs, group: "Motion & 3D" },
  webgl: { icon: SiWebgl, group: "Motion & 3D" },
  blender: { icon: SiBlender, group: "Motion & 3D" },
  adobeaftereffects: { icon: TbBrandAdobeAfterEffect, group: "Motion & 3D" },
  aftereffects: { icon: TbBrandAdobeAfterEffect, group: "Motion & 3D" },
  adobepremierepro: { icon: TbBrandAdobePremier, group: "Motion & 3D" },
  premiere: { icon: TbBrandAdobePremier, group: "Motion & 3D" },
  davinciresolve: { icon: SiDavinciresolve, group: "Motion & 3D" },
  figma: { icon: SiFigma, group: "Design" },
  photoshop: { icon: TbBrandAdobePhotoshop, group: "Design" },
  adobephotoshop: { icon: TbBrandAdobePhotoshop, group: "Design" },
  illustrator: { icon: TbBrandAdobeIllustrator, group: "Design" },
  adobeillustrator: { icon: TbBrandAdobeIllustrator, group: "Design" },
  adobexd: { icon: TbBrandAdobeXd, group: "Design" },
  indesign: { icon: TbBrandAdobeIndesign, group: "Design" },
  canva: { icon: SiCanva, group: "Design" },
  adobe: { icon: TbBrandAdobe, group: "Design" },
  github: { icon: SiGithub, group: "Tools" },
  git: { icon: SiGit, group: "Tools" },
  vercel: { icon: SiVercel, group: "Tools" },
};

const GROUP_ORDER: Group[] = ["Development", "Motion & 3D", "Design", "Tools"];

function resolve(icon: string, name: string) {
  const key = (icon || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const byName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ICONS[key] || ICONS[byName];
}

type Resolved = { name: string; icon: string; Icon?: IconType; group: Group };

function SkillItem({ s }: { s: Resolved }) {
  const isUrl = s.icon?.startsWith("http") || s.icon?.startsWith("/");
  return (
    <li className="group flex items-center gap-4 shrink-0 px-6 md:px-10">
      <span
        className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 shrink-0 transition-colors duration-200 text-[var(--fg)] group-hover:text-[var(--accent)]"
      >
        {isUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.icon} alt="" className="w-full h-full object-contain" />
        ) : s.Icon ? (
          <s.Icon className="w-full h-full" aria-hidden />
        ) : (
          <Wrench className="w-full h-full" aria-hidden />
        )}
      </span>
      <span
        className="font-display uppercase whitespace-nowrap transition-colors duration-200 text-[var(--fg)] group-hover:text-[var(--accent)]"
        style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
      >
        {s.name}
      </span>
      <span aria-hidden className="ml-6 md:ml-10 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
    </li>
  );
}

function MarqueeRow({ items, reverse, duration }: { items: Resolved[]; reverse?: boolean; duration: number }) {
  // Two identical halves → translate -50% loops seamlessly.
  const loop = items.length < 6 ? [...items, ...items] : items;
  return (
    <div className="marquee-row overflow-hidden py-3">
      <ul
        className={`marquee-track flex w-max ${reverse ? "marquee-reverse" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((s, i) => <SkillItem key={`a${i}`} s={s} />)}
        {loop.map((s, i) => <SkillItem key={`b${i}`} s={s} />)}
      </ul>
    </div>
  );
}

export default function SkillMarquee() {
  const { skills } = usePortfolioData();
  if (!skills || skills.length === 0) return null;

  const resolved: Resolved[] = skills.map((s) => {
    const r = resolve(s.icon, s.name);
    return { ...s, Icon: r?.icon, group: r?.group ?? "Tools" };
  });
  // Row 1: development; row 2: motion, design & tools
  const dev = resolved.filter((s) => s.group === "Development");
  const rest = resolved.filter((s) => s.group !== "Development");
  const row1 = dev.length && rest.length ? dev : resolved.slice(0, Math.ceil(resolved.length / 2));
  const row2 = dev.length && rest.length ? rest : resolved.slice(Math.ceil(resolved.length / 2));

  return (
    <section id="stack" className="relative w-full py-24 md:py-32 border-t hairline overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center gap-4 pb-4 mb-10 md:mb-14 border-b hairline">
          <span className="meta-label" style={{ color: "var(--accent)" }}>(05)</span>
          <span className="meta-label">Tech stack</span>
          <span className="flex-1" />
          <span className="meta-label hidden sm:inline">{String(skills.length).padStart(2, "0")} tools · {GROUP_ORDER.filter((g) => resolved.some((s) => s.group === g)).join(" / ")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-12 md:mb-16">
          <h2 className="lg:col-span-8 font-display uppercase" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", color: "var(--fg)" }}>
            Tools of the <span style={{ color: "var(--accent)" }}>trade</span>
          </h2>
          <p className="lg:col-span-4 text-base md:text-lg leading-relaxed max-w-md" style={{ color: "var(--muted)" }}>
            The stack I reach for daily — chosen for speed, polish and long-term maintainability.
          </p>
        </div>
      </div>

      <div className="marquee-mask flex flex-col gap-2 md:gap-4" aria-label="Tech stack">
        <MarqueeRow items={row1} duration={Math.max(28, row1.length * 6)} />
        <MarqueeRow items={row2} duration={Math.max(32, row2.length * 6)} reverse />
      </div>
    </section>
  );
}
