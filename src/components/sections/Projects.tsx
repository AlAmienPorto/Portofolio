"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { ArrowUpRight, ArrowLeft, ArrowRight, X, ExternalLink, Play, Images } from "lucide-react";
import { parseVideo, PLATFORM_LABEL, type MediaItem } from "@/lib/media";
import MediaCarousel from "@/components/MediaCarousel";
import VideoPreview, { useInViewport } from "@/components/VideoPreview";
import type { VideoInfo } from "@/lib/media";
import { usePortfolioData, type Project, type CreativeWork } from "@/lib/portfolio-context";
import SectionHeader from "@/components/SectionHeader";

/* ─────────────────────────────────────────────────────────────
   Normalised work item — products and creative works share one
   case-study viewer, so both are mapped into this shape.
   ───────────────────────────────────────────────────────────── */
type WorkKind = "product" | "creative" | "video";

interface WorkItem {
  key: string;
  kind: WorkKind;
  title: string;
  category: string;
  year: string;
  image: string;
  tags: string[];
  link: string | null;
  description: string;
  media: MediaItem[];
  /** cover used on cards (image, or video thumbnail) */
  cover: string;
}

function normaliseLink(link?: string): string | null {
  const l = (link || "").trim();
  if (!l || l === "#") return null;
  if (l.startsWith("http") || l.startsWith("/")) return l;
  return `https://${l}`;
}

function fromProject(p: Project): WorkItem {
  return {
    key: `p-${p.id}`,
    kind: "product",
    title: p.title,
    category: (p.category || "").trim(),
    year: p.year,
    image: p.image,
    tags: p.tags || [],
    link: normaliseLink(p.link),
    description: p.description || "",
    media: p.image ? [{ type: "image", src: p.image }] : [],
    cover: p.image,
  };
}

function fromCreative(w: CreativeWork): WorkItem {
  const images = [w.image, ...(w.gallery || [])].filter(Boolean);
  const videos = (w.videos || []).map(parseVideo).filter((v): v is NonNullable<typeof v> => !!v);
  const media: MediaItem[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...videos.map((info) => ({ type: "video" as const, info })),
  ];
  return {
    key: `c-${w.id}`,
    kind: "creative",
    title: w.client,
    category: (w.role || "").trim(),
    year: w.year || "",
    image: w.image,
    tags: w.program ? [w.program] : [],
    link: null,
    description: w.description || "",
    media,
    cover: w.image || images[0] || videos.find((v) => v.thumb)?.thumb || "",
  };
}

/** One card per video link, so the Videos tab can show them as reels. */
function videosFromCreative(w: CreativeWork): WorkItem[] {
  return (w.videos || [])
    .map(parseVideo)
    .filter((v): v is VideoInfo => !!v && (!!v.embed || v.platform === "file"))
    .map((info, i) => ({
      key: `v-${w.id}-${i}`,
      kind: "video" as const,
      title: w.client,
      category: (w.role || "").trim(),
      year: w.year || "",
      image: w.image,
      tags: w.program ? [w.program] : [],
      link: null,
      description: w.description || "",
      media: [{ type: "video" as const, info }],
      cover: info.thumb || w.image || "",
    }));
}

/** Split a free-text description into an intro, sub-headings and bullet points. */
type Block = { type: "p"; text: string } | { type: "h"; text: string } | { type: "li"; lead?: string; text: string };

function parseDescription(raw: string): { intro: string; blocks: Block[] } {
  const lines = raw
    .split("\n")
    .map((l) => l.trim().replace(/^[*•\-–]\s+/, ""))
    .filter(Boolean);
  if (lines.length === 0) return { intro: "", blocks: [] };

  const [first, ...rest] = lines;
  const blocks: Block[] = rest.map((line) => {
    if (line.endsWith(":") && line.length < 60) return { type: "h", text: line.slice(0, -1) };
    const m = line.match(/^([^:]{2,40}):\s+(.+)$/);
    if (m) return { type: "li", lead: m[1], text: m[2] };
    return { type: "li", text: line };
  });

  // Short descriptions read better as plain paragraphs.
  if (blocks.length === 1 && blocks[0].type === "li" && !blocks[0].lead) {
    return { intro: first, blocks: [{ type: "p", text: blocks[0].text }] };
  }
  return { intro: first, blocks };
}

const pad = (n: number) => String(n).padStart(2, "0");

/* ═════════════════════════════════════════════════════════════ */

export default function Projects() {
  const { projects, creativeWorks } = usePortfolioData();

  const products = useMemo(() => (projects || []).map(fromProject), [projects]);
  const creatives = useMemo(() => (creativeWorks || []).map(fromCreative), [creativeWorks]);
  const videos = useMemo(() => (creativeWorks || []).flatMap(videosFromCreative), [creativeWorks]);

  const tabs = [
    { id: "product" as const, label: "Digital Products", items: products },
    { id: "creative" as const, label: "Creative Works", items: creatives },
    { id: "video" as const, label: "Videos", items: videos },
  ].filter((t) => t.items.length > 0);

  const [activeTab, setActiveTab] = useState<WorkKind>("product");
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const list = current?.items ?? [];

  const years = [...products, ...creatives].map((w) => parseInt(w.year)).filter((n) => !Number.isNaN(n));
  const range = years.length ? `${Math.min(...years)} — ${Math.max(...years)}` : undefined;

  if (!current) return null;

  return (
    <section id="works" className="relative w-full py-24 md:py-36 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader
          index="03"
          label="Selected Works"
          aside={range}
          title={
            <>
              Selected <span style={{ color: "var(--accent)" }}>Works</span>
            </>
          }
          intro="A focused set of shipped products and visual work — from mobile banking to design systems and brand content."
        />

        {/* Tabs */}
        <div role="tablist" aria-label="Work categories" className="flex flex-wrap gap-2 mb-14 md:mb-20">
          {tabs.map((t) => {
            const active = t.id === current.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                aria-controls={`works-panel-${t.id}`}
                onClick={() => setActiveTab(t.id)}
                className="relative h-11 px-4 md:px-5 rounded-full font-grotesk text-[13px] md:text-sm font-medium flex items-center gap-2 transition-colors duration-200"
                style={{
                  color: active ? "var(--on-accent)" : "var(--fg)",
                  border: `1px solid ${active ? "transparent" : "var(--line-strong)"}`,
                }}
              >
                {active && (
                  <motion.span
                    layoutId="works-tab-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{t.label}</span>
                <span className="relative tabular-nums text-xs opacity-70">{pad(t.items.length)}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            id={`works-panel-${current.id}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {current.id === "product" ? (
              <div className="flex flex-col">
                {current.items.map((item, i) => (
                  <CaseStudyRow
                    key={item.key}
                    item={item}
                    index={i}
                    total={current.items.length}
                    onOpen={() => setOpenIndex(i)}
                  />
                ))}
              </div>
            ) : (
              current.id === "video" ? (
                <VideoGrid items={current.items} onOpen={setOpenIndex} paused={openIndex !== null} />
              ) : (
                <CreativeGrid items={current.items} onOpen={setOpenIndex} paused={openIndex !== null} />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <CaseStudyViewer
        items={list}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Product case-study row (alternating media / info)
   ───────────────────────────────────────────────────────────── */
function CaseStudyRow({
  item,
  index,
  total,
  onOpen,
}: {
  item: WorkItem;
  index: number;
  total: number;
  onOpen: () => void;
}) {
  const { intro } = parseDescription(item.description);
  const flipped = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 py-12 md:py-16 border-t hairline first:border-t-0 first:pt-0"
    >
      <div className={`lg:col-span-7 ${flipped ? "lg:order-2" : ""}`}>
        <CursorMedia item={item} onOpen={onOpen} />
      </div>

      <div className={`lg:col-span-5 flex flex-col ${flipped ? "lg:order-1" : ""}`}>
        <div className="flex items-baseline justify-between mb-6">
          <span className="font-display text-outline" style={{ fontSize: "clamp(4rem, 8vw, 6.5rem)" }}>
            {pad(index + 1)}
          </span>
          <span className="meta-label tabular-nums">
            {pad(index + 1)} / {pad(total)}
          </span>
        </div>

        <p className="meta-label mb-3" style={{ color: "var(--accent)" }}>
          {item.category}
        </p>
        <h3 className="font-display uppercase mb-5" style={{ fontSize: "clamp(2.75rem, 5vw, 4.25rem)", color: "var(--fg)" }}>
          {item.title}
        </h3>
        {intro && (
          <p className="text-base leading-relaxed mb-8 line-clamp-3 max-w-prose" style={{ color: "var(--muted)" }}>
            {intro}
          </p>
        )}

        <dl className="grid grid-cols-3 border-y hairline mb-8">
          <MetaCell term="Year" value={item.year || "—"} />
          <MetaCell term="Type" value={item.category.split(" ").slice(-1)[0] || "—"} />
          <MetaCell term="Stack" value={item.tags[0] || "—"} last />
        </dl>

        {item.tags.length > 1 && (
          <ul className="flex flex-wrap gap-2 mb-8" aria-label="Technologies">
            {item.tags.map((t) => (
              <li
                key={t}
                className="font-grotesk text-xs px-3 py-1.5 rounded-full"
                style={{ border: "1px solid var(--line-strong)", color: "var(--fg)" }}
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <button onClick={onOpen} className="btn-primary">
            View case study
            <ArrowUpRight size={16} />
          </button>
          {item.link && (
            <a href={item.link} target="_blank" rel="noreferrer" className="btn-outline">
              Live site
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function MetaCell({ term, value, last }: { term: string; value: string; last?: boolean }) {
  return (
    <div className={`py-4 pr-3 ${last ? "" : "border-r hairline"} ${term !== "Year" ? "pl-4" : ""}`}>
      <dt className="meta-label mb-1">{term}</dt>
      <dd className="font-grotesk text-sm font-medium truncate" style={{ color: "var(--fg)" }}>
        {value}
      </dd>
    </div>
  );
}

/** Media frame with a cursor-following "View" badge on pointer devices. */
function CursorMedia({ item, onOpen }: { item: WorkItem; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div className="group frame-corners">
      <button
        ref={ref}
        onClick={onOpen}
        onPointerMove={onMove}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
        aria-label={`Open case study: ${item.title}`}
        className="relative block w-full overflow-hidden rounded-xl aspect-[4/3]"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent 40%)" }}
        />
        <span className="absolute left-4 bottom-4 meta-label px-3 py-1.5 rounded-full backdrop-blur-md"
          style={{ backgroundColor: "rgba(10,10,11,0.55)", color: "#f3f3ef" }}>
          {item.year}
        </span>

        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 w-24 h-24 -ml-12 -mt-12 rounded-full flex items-center justify-center font-grotesk text-xs font-semibold uppercase tracking-wider"
          style={{ x: sx, y: sy, backgroundColor: "#bef264", color: "#0a0a0b" }}
          initial={false}
          animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          View
        </motion.span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Creative works — asymmetric editorial grid
   ───────────────────────────────────────────────────────────── */
const SPANS = [
  "md:col-span-7 md:h-[480px]",
  "md:col-span-5 md:h-[480px]",
  "md:col-span-4 md:h-[380px]",
  "md:col-span-4 md:h-[380px]",
  "md:col-span-4 md:h-[380px]",
];

function CreativeGrid({ items, onOpen, paused }: { items: WorkItem[]; onOpen: (i: number) => void; paused: boolean }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
      {items.map((item, i) => (
        <motion.li
          key={item.key}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
          className={`${SPANS[i % SPANS.length]} aspect-[4/3] md:aspect-auto`}
        >
          <CreativeCard item={item} index={i} onOpen={() => onOpen(i)} paused={paused} />
        </motion.li>
      ))}
    </ul>
  );
}

function firstVideo(media: MediaItem[]): VideoInfo | undefined {
  const v = media.find((m) => m.type === "video");
  return v && v.type === "video" ? v.info : undefined;
}

function CreativeCard({ item, index, onOpen, paused }: { item: WorkItem; index: number; onOpen: () => void; paused: boolean }) {
  const video = firstVideo(item.media);
  const [hover, setHover] = useState(false);
  // Works that are video-only preview automatically; image-led ones play on hover.
  const [ref, inView] = useInViewport<HTMLButtonElement>(0.6);
  const videoOnly = !!video && !item.media.some((m) => m.type === "image");
  const active = !paused && (videoOnly ? inView : hover);

  return (
    <button
      ref={ref}
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      aria-label={`Open ${item.title}`}
      className="group relative w-full h-full overflow-hidden rounded-xl text-left block"
      style={{ backgroundColor: "var(--surface)" }}
    >
      {item.cover && (
        <Image
          src={item.cover}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
      {video && (active || video.platform === "file") && (
        <span className={`absolute inset-0 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
          <VideoPreview info={video} poster={item.cover} active={active} frame="landscape" />
        </span>
      )}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(6,6,7,0.94) 0%, rgba(6,6,7,0.55) 35%, rgba(6,6,7,0.05) 70%, transparent 100%)" }}
      />
      <div className="absolute inset-x-0 top-0 p-5 flex justify-between items-start">
        <span className="flex items-center gap-2">
          <span className="meta-label tabular-nums" style={{ color: "rgba(243,243,239,0.85)" }}>
            {pad(index + 1)}
          </span>
          <MediaBadges media={item.media} />
        </span>
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:rotate-45"
          style={{ backgroundColor: "#bef264", color: "#0a0a0b" }}
        >
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="meta-label mb-2" style={{ color: "#bef264" }}>
          {item.category}
          {item.tags[0] ? ` · ${item.tags[0]}` : ""}
        </p>
        <div className="flex items-end justify-between gap-4">
          <h3 className="font-display uppercase" style={{ fontSize: "clamp(2rem, 3.2vw, 2.75rem)", color: "#f3f3ef" }}>
            {item.title}
          </h3>
          {item.year && (
            <span className="meta-label tabular-nums shrink-0" style={{ color: "rgba(243,243,239,0.75)" }}>
              {item.year}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Videos — portrait reel cards that preview live while in view
   ───────────────────────────────────────────────────────────── */
function VideoGrid({ items, onOpen, paused }: { items: WorkItem[]; onOpen: (i: number) => void; paused: boolean }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {items.map((item, i) => (
        <motion.li
          key={item.key}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}
        >
          <VideoCard item={item} index={i} onOpen={() => onOpen(i)} paused={paused} />
        </motion.li>
      ))}
    </ul>
  );
}

function VideoCard({ item, index, onOpen, paused }: { item: WorkItem; index: number; onOpen: () => void; paused: boolean }) {
  const video = firstVideo(item.media)!;
  const [ref, inView] = useInViewport<HTMLButtonElement>(0.6);

  return (
    <button
      ref={ref}
      onClick={onOpen}
      aria-label={`Play ${item.title} video`}
      className="group relative block w-full aspect-[9/16] overflow-hidden rounded-xl text-left"
      style={{ backgroundColor: "#0a0a0b" }}
    >
      <VideoPreview info={video} poster={item.cover} active={inView && !paused} frame="portrait" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(6,6,7,0.9) 0%, rgba(6,6,7,0.2) 38%, transparent 60%, rgba(6,6,7,0.45) 100%)" }}
      />

      <div className="absolute inset-x-0 top-0 p-3 md:p-4 flex items-center justify-between">
        <span
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-full font-grotesk text-[11px] font-medium backdrop-blur-md"
          style={{ backgroundColor: "rgba(10,10,11,0.6)", color: "#f3f3ef" }}
        >
          <Play size={10} fill="currentColor" /> {PLATFORM_LABEL[video.platform]}
        </span>
        <span className="meta-label tabular-nums" style={{ color: "rgba(243,243,239,0.85)" }}>
          {pad(index + 1)}
        </span>
      </div>

      {/* Center play affordance */}
      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="w-14 h-14 rounded-full flex items-center justify-center scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 transition-all duration-300"
          style={{ backgroundColor: "#bef264", color: "#0a0a0b" }}
        >
          <Play size={20} fill="currentColor" />
        </span>
      </span>

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <p className="meta-label mb-1 truncate" style={{ color: "#bef264" }}>
          {item.category}
        </p>
        <h3 className="font-display uppercase leading-none truncate" style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)", color: "#f3f3ef" }}>
          {item.title}
        </h3>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Full-screen case-study viewer
   ───────────────────────────────────────────────────────────── */
function CaseStudyViewer({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: WorkItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const open = index !== null && !!items[index];
  const item = open ? items[index!] : null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null || items.length < 2) return;
      onNavigate((index + dir + items.length) % items.length);
    },
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      lenis?.start();
    };
  }, [open, lenis, onClose, go]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const parsed = item ? parseDescription(item.description) : null;

  return (
    <AnimatePresence>
      {item && parsed && (
        <motion.div
          key="viewer"
          className="fixed inset-0 z-[90]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0"
            onClick={onClose}
            style={{ backgroundColor: "var(--overlay-bg)", backdropFilter: "blur(10px)" }}
          />

          <motion.div
            initial={{ y: "6%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "4%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 top-0 md:top-6 md:inset-x-6 md:rounded-t-2xl overflow-hidden flex flex-col"
            style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--line)" }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-3 px-5 md:px-8 h-16 border-b hairline shrink-0">
              <span className="meta-label tabular-nums" style={{ color: "var(--accent)" }}>
                {pad(index! + 1)} / {pad(items.length)}
              </span>
              <span className="meta-label truncate hidden sm:inline">{item.title}</span>
              <span className="flex-1" />
              {items.length > 1 && (
                <>
                  <IconButton label="Previous project" onClick={() => go(-1)}>
                    <ArrowLeft size={18} />
                  </IconButton>
                  <IconButton label="Next project" onClick={() => go(1)}>
                    <ArrowRight size={18} />
                  </IconButton>
                </>
              )}
              <IconButton label="Close" onClick={onClose} ref={closeRef}>
                <X size={18} />
              </IconButton>
            </div>

            <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-16"
                >
                  {/* Title block */}
                  <p className="meta-label mb-4" style={{ color: "var(--accent)" }}>
                    {item.kind === "product" ? "Case Study" : item.kind === "video" ? "Video" : "Creative Work"} — {item.category}
                  </p>
                  <h2
                    id="case-title"
                    className="font-display uppercase mb-10"
                    style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", color: "var(--fg)" }}
                  >
                    {item.title}
                  </h2>

                  {/* Meta grid */}
                  <dl className="grid grid-cols-2 md:grid-cols-4 border-t hairline mb-10 md:mb-14">
                    {[
                      { t: item.kind === "product" ? "Project" : "Client", v: item.title },
                      { t: "Year", v: item.year || "—" },
                      { t: item.kind === "product" ? "Category" : "Role", v: item.category || "—" },
                      { t: item.kind === "product" ? "Stack" : "Tools", v: item.tags.join(", ") || "—" },
                    ].map((m) => (
                      <div key={m.t} className="py-5 pr-4 border-b hairline">
                        <dt className="meta-label mb-1.5">{m.t}</dt>
                        <dd className="font-grotesk text-sm md:text-base font-medium" style={{ color: "var(--fg)" }}>
                          {m.v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {/* Media */}
                  <div className="mb-12 md:mb-20">
                    <MediaCarousel key={item.key} media={item.media} title={item.title} />
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    <div className="md:col-span-4">
                      <p className="meta-label md:sticky md:top-6">Overview</p>
                    </div>
                    <div className="md:col-span-8">
                      {parsed.intro && (
                        <p className="text-xl md:text-2xl leading-snug mb-10" style={{ color: "var(--fg)" }}>
                          {parsed.intro}
                        </p>
                      )}
                      <DescriptionBlocks blocks={parsed.blocks} />

                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" className="btn-primary mt-12">
                          Visit live site
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Next up */}
                  {items.length > 1 && (
                    <button
                      onClick={() => go(1)}
                      className="group mt-20 md:mt-28 w-full text-left border-t hairline pt-8 flex items-end justify-between gap-6"
                    >
                      <span>
                        <span className="meta-label block mb-3">Next</span>
                        <span
                          className="font-display uppercase block transition-colors duration-300 text-[var(--fg)] group-hover:text-[var(--accent)]"
                          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
                        >
                          {items[(index! + 1) % items.length].title}
                        </span>
                      </span>
                      <ArrowRight
                        className="shrink-0 mb-3 transition-transform duration-300 group-hover:translate-x-2"
                        size={40}
                        style={{ color: "var(--accent)" }}
                      />
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DescriptionBlocks({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) return null;
  const out: React.ReactNode[] = [];
  let bullets: Block[] = [];

  const flush = (k: string) => {
    if (!bullets.length) return;
    out.push(
      <ul key={k} className="border-t hairline mb-10">
        {bullets.map((b, i) =>
          b.type === "li" ? (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 py-4 border-b hairline">
              <span className="meta-label tabular-nums pt-0.5" style={{ color: "var(--accent)" }}>
                {pad(i + 1)}
              </span>
              <span className="leading-relaxed" style={{ color: "var(--muted)" }}>
                {b.lead && (
                  <strong className="font-semibold" style={{ color: "var(--fg)" }}>
                    {b.lead}.{" "}
                  </strong>
                )}
                {b.text}
              </span>
            </li>
          ) : null
        )}
      </ul>
    );
    bullets = [];
  };

  blocks.forEach((b, i) => {
    if (b.type === "li") {
      bullets.push(b);
      return;
    }
    flush(`ul-${i}`);
    if (b.type === "h") {
      out.push(
        <h3 key={i} className="meta-label mb-4" style={{ color: "var(--fg)" }}>
          {b.text}
        </h3>
      );
    } else {
      out.push(
        <p key={i} className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
          {b.text}
        </p>
      );
    }
  });
  flush("ul-end");
  return <>{out}</>;
}

const IconButton = ({
  label,
  onClick,
  children,
  ref,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}) => (
  <button
    ref={ref}
    aria-label={label}
    onClick={onClick}
    className="w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200 text-[var(--fg)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
    style={{ border: "1px solid var(--line-strong)" }}
  >
    {children}
  </button>
);

function MediaBadges({ media }: { media: MediaItem[] }) {
  const videos = media.filter((m) => m.type === "video");
  const images = media.length - videos.length;
  const chip = "flex items-center gap-1.5 h-7 px-2.5 rounded-full font-grotesk text-[11px] font-medium backdrop-blur-md";
  const style = { backgroundColor: "rgba(10,10,11,0.6)", color: "#f3f3ef" };
  return (
    <>
      {images > 1 && (
        <span className={chip} style={style}>
          <Images size={12} /> {images}
        </span>
      )}
      {videos.length > 0 && (
        <span className={chip} style={style}>
          <Play size={11} fill="currentColor" />
          {videos.length > 1 ? `${videos.length} videos` : PLATFORM_LABEL[(videos[0] as Extract<MediaItem, { type: "video" }>).info.platform]}
        </span>
      )}
    </>
  );
}
