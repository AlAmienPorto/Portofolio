"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoInfo } from "@/lib/media";

/**
 * Muted, looping, chrome-less video preview that fills its (relatively
 * positioned) parent like `object-fit: cover`.
 *
 * Performance: the player is only mounted while `active` is true (in view /
 * hovered) and never under prefers-reduced-motion — otherwise only the poster
 * image is rendered.
 */
export default function VideoPreview({
  info,
  poster,
  active,
  frame = "portrait",
}: {
  info: VideoInfo;
  poster?: string;
  active: boolean;
  /** shape of the box we're filling — used to crop embeds correctly */
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

  // Native files: keep the element mounted (it doubles as the poster) and just play/pause.
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

  // Embeds: size the iframe so its video covers the box (crop the overflow).
  const sourceIsPortrait = info.vertical;
  let iframeStyle: React.CSSProperties;
  if (frame === "portrait" && !sourceIsPortrait) {
    // 16:9 video in a 9:16 box → full height, wider than the box
    iframeStyle = { height: "100%", width: "316%", left: "50%", top: 0, transform: "translateX(-50%)" };
  } else if (frame === "landscape" && sourceIsPortrait) {
    // 9:16 video in a 4:3-ish box → full width, taller than the box
    iframeStyle = { width: "100%", height: "240%", top: "50%", left: 0, transform: "translateY(-50%)" };
  } else {
    iframeStyle = { inset: 0, width: "100%", height: "100%" };
  }

  return (
    <>
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      )}
      {play && info.preview && <EmbedPreview src={info.preview} style={iframeStyle} />}
    </>
  );
}

/** Mounted fresh each time playback starts, so it always fades in from the poster. */
function EmbedPreview({ src, style }: { src: string; style: React.CSSProperties }) {
  const [ready, setReady] = useState(false);
  return (
    <iframe
      src={src}
      title=""
      aria-hidden
      tabIndex={-1}
      allow="autoplay; encrypted-media"
      onLoad={() => setTimeout(() => setReady(true), 500)}
      className="absolute border-0 pointer-events-none transition-opacity duration-500"
      style={{ ...style, opacity: ready ? 1 : 0, backgroundColor: "#000" }}
    />
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
