"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Play } from "lucide-react";
import { PLATFORM_LABEL, type MediaItem, type VideoInfo } from "@/lib/media";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Carousel for a work's images and videos. Only the active slide is mounted,
 * so embeds stop playing (and stop costing CPU) when you move away.
 */
export default function MediaCarousel({ media, title }: { media: MediaItem[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  if (media.length === 0) return null;
  const current = media[Math.min(index, media.length - 1)];
  const many = media.length > 1;

  const go = (d: 1 | -1) => {
    setDir(d);
    setIndex((i) => (i + d + media.length) % media.length);
  };

  return (
    <div>
      <div
        className="relative w-full rounded-xl overflow-hidden flex items-center justify-center min-h-[55vh] md:min-h-[72vh]"
        style={{ backgroundColor: "var(--surface)" }}
        aria-roledescription="carousel"
        aria-label={`${title} media`}
      >
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={many && current.type === "image" ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="w-full flex items-center justify-center p-3 md:p-6"
            aria-label={`Slide ${index + 1} of ${media.length}`}
          >
            {current.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.src}
                alt={`${title} — image ${index + 1}`}
                draggable={false}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-md select-none"
              />
            ) : (
              <VideoSlide info={current.info} title={title} />
            )}
          </motion.div>
        </AnimatePresence>

        {many && (
          <>
            <NavButton side="left" label="Previous media" onClick={() => go(-1)}>
              <ArrowLeft size={18} />
            </NavButton>
            <NavButton side="right" label="Next media" onClick={() => go(1)}>
              <ArrowRight size={18} />
            </NavButton>
            <span
              className="absolute top-4 left-4 font-grotesk text-xs tabular-nums px-3 h-8 flex items-center rounded-full"
              style={{ backgroundColor: "rgba(10,10,11,0.7)", color: "#f3f3ef" }}
            >
              {pad(index + 1)} / {pad(media.length)}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {many && (
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="Choose media">
          {media.map((m, i) => {
            const active = i === index;
            const thumb = m.type === "image" ? m.src : m.info.thumb;
            return (
              <button
                key={i}
                role="tab"
                aria-selected={active}
                aria-label={m.type === "image" ? `Image ${i + 1}` : `${PLATFORM_LABEL[m.info.platform]} video`}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className="relative shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-md overflow-hidden transition-opacity duration-200"
                style={{
                  backgroundColor: "var(--surface-2)",
                  outline: active ? "2px solid var(--accent)" : "1px solid var(--line)",
                  outlineOffset: active ? "2px" : "0",
                  opacity: active ? 1 : 0.6,
                }}
              >
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" loading="lazy" className="w-full h-full object-cover" />
                )}
                {m.type === "video" && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5" style={{ backgroundColor: thumb ? "rgba(0,0,0,0.4)" : "transparent", color: thumb ? "#fff" : "var(--fg)" }}>
                    <Play size={14} fill="currentColor" />
                    <span className="font-grotesk text-[10px]">{PLATFORM_LABEL[m.info.platform]}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const PORTRAIT_BOX = "relative h-[min(70vh,760px)] max-h-full aspect-[9/16] max-w-full";
const LANDSCAPE_BOX = "relative w-full max-w-5xl aspect-video";

function VideoSlide({ info, title }: { info: VideoInfo; title: string }) {
  const [playing, setPlaying] = useState(false);
  // Native files: learn the real orientation once metadata is in.
  const [fileVertical, setFileVertical] = useState<boolean | null>(null);
  const vertical = info.platform === "file" ? fileVertical ?? false : info.vertical;

  // Ask the background-music player to step aside while an embed is live.
  const embedLive = !!info.embed && info.platform !== "file" && (info.platform !== "youtube" || playing);
  useEffect(() => {
    if (!embedLive) return;
    window.dispatchEvent(new Event("bgm:duck"));
    return () => {
      window.dispatchEvent(new Event("bgm:unduck"));
    };
  }, [embedLive]);
  useEffect(() => () => {
    window.dispatchEvent(new Event("bgm:unduck"));
  }, []);
  const box = `${vertical ? PORTRAIT_BOX : LANDSCAPE_BOX} rounded-xl overflow-hidden`;
  const frameStyle: React.CSSProperties = {
    backgroundColor: "#000",
    boxShadow: "0 0 0 1px var(--line-strong), 0 30px 60px -30px rgba(0,0,0,0.6)",
  };

  const openLink =
    info.platform !== "file" ? (
      <a href={info.url} target="_blank" rel="noreferrer" className="meta-label flex items-center gap-1.5 hover:!text-[var(--accent)]">
        Open on {PLATFORM_LABEL[info.platform]} <ExternalLink size={12} />
      </a>
    ) : null;

  if (info.platform === "file") {
    return (
      <div className={box} style={frameStyle}>
        <video
          src={info.url}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => setFileVertical(e.currentTarget.videoHeight > e.currentTarget.videoWidth)}
          onPlay={() => window.dispatchEvent(new Event("bgm:duck"))}
          onPause={() => window.dispatchEvent(new Event("bgm:unduck"))}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
    );
  }

  if (!info.embed) {
    return (
      <a href={info.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 text-center px-6 py-16">
        <span className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent)", color: "var(--on-accent)" }}>
          <Play size={24} fill="currentColor" />
        </span>
        <span className="font-display uppercase text-3xl" style={{ color: "var(--fg)" }}>
          Watch on {PLATFORM_LABEL[info.platform]}
        </span>
        <span className="meta-label flex items-center gap-1.5">
          Opens in a new tab <ExternalLink size={12} />
        </span>
      </a>
    );
  }

  // Instagram's embed is a whole post card; crop it down to just the video.
  if (info.platform === "instagram") {
    return (
      <div className="w-full flex flex-col items-center gap-3">
        <InstagramFrame src={info.embed} title={title} className={`${PORTRAIT_BOX} rounded-xl overflow-hidden`} style={frameStyle} />
        {openLink}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className={box} style={frameStyle}>
        {info.platform === "youtube" && !playing ? (
          // Lightweight poster first; the real player loads on click.
          <button onClick={() => setPlaying(true)} className="absolute inset-0 group" aria-label={`Play ${title} video`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={info.thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: "#bef264", color: "#0a0a0b" }}>
                <Play size={28} fill="currentColor" />
              </span>
            </span>
          </button>
        ) : (
          <iframe
            src={info.platform === "youtube" ? `${info.embed}&autoplay=1` : info.embed}
            title={`${title} — ${PLATFORM_LABEL[info.platform]}`}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
      </div>
      {openLink}
    </div>
  );
}

/**
 * Instagram's /embed/ page renders: a ~54px profile header, then the media in
 * a 4:5 box (a 9:16 reel is pillar-boxed inside it), then likes / comments.
 * We render it at its native 420px width, scale it so the reel itself fills
 * our 9:16 frame, and offset it so header, bars and footer fall outside.
 * The "Open on Instagram" link below stays as the fallback.
 */
const IG = { width: 420, height: 760, header: 54 };
const IG_MEDIA_H = IG.width * 1.25;
const IG_VIDEO_W = (IG_MEDIA_H * 9) / 16;
const IG_OFFSET_X = (IG.width - IG_VIDEO_W) / 2;

function InstagramFrame({
  src,
  title,
  className,
  style,
}: {
  src: string;
  title: string;
  className: string;
  style: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = width / IG_VIDEO_W;

  return (
    <div ref={ref} className={className} style={style}>
      {width > 0 && (
        <iframe
          src={src}
          title={`${title} — Instagram`}
          scrolling="no"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute border-0"
          style={{
            width: IG.width,
            height: IG.height,
            left: -IG_OFFSET_X * scale,
            top: -IG.header * scale,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            backgroundColor: "#000",
          }}
        />
      )}
    </div>
  );
}

function NavButton({
  side,
  label,
  onClick,
  children,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-3 md:left-4" : "right-3 md:right-4"} w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105`}
      style={{ backgroundColor: "rgba(10,10,11,0.7)", color: "#f3f3ef", border: "1px solid rgba(243,243,239,0.2)" }}
    >
      {children}
    </button>
  );
}
