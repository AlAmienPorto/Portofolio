"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoInfo } from "@/lib/media";

/**
 * Video preview for cards. Fills its (relatively positioned) parent like
 * `object-fit: cover`.
 *
 * - Direct video files play muted & looping while `active` (in view / hovered).
 * - YouTube / TikTok / Instagram show a clean poster with a slow zoom. Their
 *   embeds bring titles, spinners and like buttons that clutter a card, so the
 *   real player only appears in the viewer.
 * - Nothing animates under prefers-reduced-motion.
 */
export default function VideoPreview({
  info,
  poster,
  active,
}: {
  info: VideoInfo;
  poster?: string;
  active: boolean;
  /** accepted for compatibility; previews always cover their box */
  frame?: "portrait" | "landscape";
}) {
  const [reduced, setReduced] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const play = active && !reduced;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play]);

  const cover = poster || info.thumb;

  if (info.platform === "file") {
    return (
      <video
        ref={videoRef}
        src={`${info.url}#t=0.1`}
        poster={cover}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  return cover ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cover}
      alt=""
      aria-hidden
      loading="lazy"
      className={`absolute inset-0 w-full h-full object-cover ${play ? "poster-drift" : ""}`}
    />
  ) : (
    <span aria-hidden className="absolute inset-0" style={{ backgroundColor: "#111" }} />
  );
}

/** true while the element is at least `threshold` visible. */
export function useInViewport<T extends Element>(threshold = 0.5) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}
