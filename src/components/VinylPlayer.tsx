"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SkipForward, Volume2, VolumeX, Play } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

const PREF_KEY = "bgm-pref"; // "on" | "off"
const VOLUME = 0.35;
const FADE_MS = 600;

function readPref(): string | null {
  try {
    return localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
}
function writePref(v: "on" | "off") {
  try {
    localStorage.setItem(PREF_KEY, v);
  } catch {
    /* private mode etc. */
  }
}

/**
 * Small floating vinyl player for background music.
 * - Tries to autoplay; if the browser blocks sound, starts on the visitor's
 *   first click / tap / key press. Pausing it is remembered ("off").
 * - Plays the playlist in order and moves to the next track when one ends.
 * - Fades in/out, and pauses itself while a video is playing (bgm:duck events).
 */
export default function VinylPlayer() {
  const { music } = usePortfolioData();
  const tracks = (music || []).filter((t) => t.src);

  const audioRef = useRef<HTMLAudioElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<number>(0);
  const duckedRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const closeTimer = useRef<number>(0);
  const longPress = useRef<number>(0);
  const wantPlayRef = useRef(false);

  const openList = () => {
    window.clearTimeout(closeTimer.current);
    setListOpen(true);
  };
  const closeListSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setListOpen(false), 220);
  };

  const track = tracks[index % Math.max(tracks.length, 1)];

  const fadeTo = useCallback((target: number, done?: () => void) => {
    const a = audioRef.current;
    if (!a) return;
    cancelAnimationFrame(fadeRef.current);
    const from = a.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      a.volume = from + (target - from) * t;
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    try {
      await a.play();
      setPlaying(true);
      fadeTo(VOLUME);
    } catch {
      setPlaying(false);
    }
  }, [fadeTo]);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    setPlaying(false);
    fadeTo(0, () => a.pause());
  }, [fadeTo]);

  const toggle = () => {
    if (playing) {
      pause();
      writePref("off");
    } else {
      play();
      writePref("on");
    }
  };

  const next = () => {
    setIndex((i) => (i + 1) % tracks.length);
  };

  const selectTrack = (i: number) => {
    if (i === index) {
      if (!playing) {
        play();
        writePref("on");
      }
      return;
    }
    wantPlayRef.current = true;
    writePref("on");
    setIndex(i);
  };

  // When the track changes while playing (or from the list), start the new one.
  useEffect(() => {
    if (playing || wantPlayRef.current) {
      wantPlayRef.current = false;
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Autoplay: try right away; browsers usually block sound until the visitor
  // interacts, so if that fails start on their first click / tap / key press.
  // A visitor who paused the music before ("off") is left alone.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!tracks.length || autoStarted.current || readPref() === "off") return;
    autoStarted.current = true;
    let cancelled = false;
    const events = ["pointerdown", "keydown", "touchstart"] as const;

    const onFirst = (e: Event) => {
      events.forEach((ev) => window.removeEventListener(ev, onFirst, true));
      if (cancelled || !audioRef.current?.paused) return;
      if (rootRef.current?.contains(e.target as Node)) return; // the player handles its own clicks
      play();
    };

    play().then(() => {
      if (cancelled || !audioRef.current?.paused) return; // autoplay worked
      events.forEach((ev) => window.addEventListener(ev, onFirst, { capture: true, passive: true }));
    });

    return () => {
      cancelled = true;
      events.forEach((ev) => window.removeEventListener(ev, onFirst, true));
    };
  }, [tracks.length, play]);

  // Step aside while a video plays.
  useEffect(() => {
    const duck = () => {
      if (!audioRef.current?.paused) {
        duckedRef.current = true;
        pause();
      }
    };
    const unduck = () => {
      if (duckedRef.current) {
        duckedRef.current = false;
        play();
      }
    };
    window.addEventListener("bgm:duck", duck);
    window.addEventListener("bgm:unduck", unduck);
    return () => {
      window.removeEventListener("bgm:duck", duck);
      window.removeEventListener("bgm:unduck", unduck);
    };
  }, [pause, play]);

  useEffect(
    () => () => {
      cancelAnimationFrame(fadeRef.current);
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(longPress.current);
    },
    []
  );

  // Close the list on Escape / outside tap (touch devices).
  useEffect(() => {
    if (!listOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setListOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setListOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [listOpen]);

  if (!track) return null;

  const label = `${track.title}${track.artist ? ` — ${track.artist}` : ""}`;

  return (
    <div
      ref={rootRef}
      className="fixed z-[95] left-4 bottom-[104px] md:left-8 md:bottom-8"
      data-playing={playing}
      onMouseEnter={openList}
      onMouseLeave={closeListSoon}
      onFocus={(e) => {
        // keyboard focus only — a tap/click shouldn't pop the list open
        if ((e.target as HTMLElement).matches(":focus-visible")) openList();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeListSoon();
      }}
    >
      {/* ── Song list (hover / focus / long-press) ── */}
      <AnimatePresence>
        {listOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full left-0 pb-2.5 origin-bottom-left"
          >
            <div
              className="w-[264px] rounded-2xl border hairline p-2"
              style={{
                backgroundColor: "color-mix(in srgb, var(--surface) 92%, transparent)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 18px 40px -16px var(--shadow)",
              }}
            >
              <div className="flex items-center justify-between px-2 pt-1 pb-2">
                <span className="meta-label !text-[10px]" style={{ color: "var(--accent)" }}>
                  ♫ Fav playlist
                </span>
                <span className="meta-label !text-[10px] tabular-nums">
                  {String(tracks.length).padStart(2, "0")} {tracks.length === 1 ? "track" : "tracks"}
                </span>
              </div>
              <ul className="max-h-[232px] overflow-y-auto no-scrollbar" data-lenis-prevent>
                {tracks.map((t, i) => {
                  const current = i === index % tracks.length;
                  return (
                    <li key={t.id ?? i}>
                      <button
                        onClick={() => selectTrack(i)}
                        aria-current={current ? "true" : undefined}
                        aria-label={`Play ${t.title}${t.artist ? ` by ${t.artist}` : ""}`}
                        className={`group/row w-full flex items-center gap-3 px-2 py-1.5 rounded-xl text-left transition-colors duration-150 ${
                          current ? "bg-[var(--accent-glow)]" : "hover:bg-[var(--accent-lime-glow)]"
                        }`}
                      >
                        {/* mini vinyl / cover */}
                        <span
                          className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden flex items-center justify-center"
                          style={{ background: "repeating-radial-gradient(circle, #0d0d0e 0 1.5px, #1d1d20 1.5px 2.5px)" }}
                        >
                          <span className="absolute inset-[30%] rounded-full overflow-hidden" style={{ backgroundColor: "#bef264" }}>
                            {t.cover && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={t.cover} alt="" className="w-full h-full object-cover" />
                            )}
                          </span>
                          <span
                            className={`absolute inset-0 flex items-center justify-center bg-black/55 transition-opacity duration-150 ${
                              current && playing ? "opacity-0" : "opacity-0 group-hover/row:opacity-100"
                            }`}
                            style={{ color: "#f3f3ef" }}
                          >
                            <Play size={12} fill="currentColor" />
                          </span>
                        </span>

                        <span className="flex-1 min-w-0">
                          <span
                            className={`block truncate font-grotesk text-[13px] font-medium ${current ? "text-[var(--accent)]" : "text-[var(--fg)]"}`}
                          >
                            {t.title || "Untitled"}
                          </span>
                          {t.artist && (
                            <span className="block truncate font-grotesk text-[11px]" style={{ color: "var(--muted)" }}>
                              {t.artist}
                            </span>
                          )}
                        </span>

                        {current && playing ? (
                          <span className="vinyl-eq flex items-end gap-[2px] h-3 shrink-0 pr-1" aria-hidden>
                            <i /><i /><i />
                          </span>
                        ) : (
                          <span className="meta-label !text-[10px] tabular-nums shrink-0 pr-1">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        muted={muted}
        loop={tracks.length === 1}
        // Keep the UI honest if something else pauses/plays it (media keys, OS, etc.)
        onPlay={() => setPlaying(true)}
        onPause={(e) => {
          const el = e.currentTarget;
          // our own fade-out already set playing=false; a finished track is handled by onEnded
          if (!el.ended && !duckedRef.current) setPlaying(false);
        }}
        onEnded={() => {
          if (tracks.length > 1) {
            wantPlayRef.current = true; // keep going even if state lagged
            next();
          }
        }}
        onError={() => {
          setPlaying(false);
          if (tracks.length > 1) next();
        }}
      />

      <div
        className="flex items-center gap-2 md:gap-3 h-14 md:h-[60px] p-1.5 md:pr-3 rounded-full border hairline"
        style={{
          backgroundColor: "color-mix(in srgb, var(--surface) 86%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 12px 30px -12px var(--shadow)",
        }}
      >
        {/* Vinyl = play / pause */}
        <button
          onClick={() => {
            if (longPress.current === -1) {
              longPress.current = 0;
              return; // long-press already opened the list
            }
            toggle();
          }}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse") return;
            window.clearTimeout(longPress.current);
            longPress.current = window.setTimeout(() => {
              longPress.current = -1;
              setListOpen(true);
            }, 450);
          }}
          onPointerUp={() => {
            if (longPress.current > 0) window.clearTimeout(longPress.current);
          }}
          onContextMenu={(e) => e.preventDefault()}
          aria-haspopup="true"
          aria-expanded={listOpen}
          aria-label={playing ? `Pause music: ${label}` : `Play background music: ${label}`}
          aria-pressed={playing}
          className="vinyl-btn group relative w-11 h-11 md:w-12 md:h-12 shrink-0 rounded-full"
        >
          <span className="vinyl-disc absolute inset-0 rounded-full">
            <span
              className="vinyl-label absolute rounded-full overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: "#bef264" }}
            >
              {track.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={track.cover} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-[9px] leading-none" style={{ color: "#0a0a0b" }}>JA</span>
              )}
              <span className="absolute w-1 h-1 rounded-full" style={{ backgroundColor: "#0a0a0b" }} />
            </span>
          </span>
          {/* static sheen so the spin reads as motion */}
          <span className="vinyl-sheen absolute inset-0 rounded-full pointer-events-none" />
          {/* tonearm */}
          <span className="vinyl-arm absolute pointer-events-none" aria-hidden />
          {!playing && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: "var(--accent)", borderColor: "var(--surface)" }} />
          )}
        </button>

        {/* Track info (desktop) */}
        <div className="hidden md:flex flex-col justify-center w-[150px] overflow-hidden">
          <span className="flex items-center gap-2">
            <span className="vinyl-eq flex items-end gap-[2px] h-2.5" aria-hidden>
              <i /><i /><i />
            </span>
            <span className="meta-label !text-[10px]">{playing ? "Now playing" : "Paused"}</span>
          </span>
          <span className="relative overflow-hidden whitespace-nowrap font-grotesk text-[13px] font-medium mt-0.5 [mask-image:linear-gradient(to_right,#000_80%,transparent)]" style={{ color: "var(--fg)" }}>
            <span className={`inline-flex ${playing && label.length > 20 ? "vinyl-ticker" : ""}`}>
              <span className="pr-8">{label}</span>
              {playing && label.length > 20 && <span className="pr-8" aria-hidden>{label}</span>}
            </span>
          </span>
        </div>

        {/* Controls (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {tracks.length > 1 && (
            <button
              onClick={next}
              aria-label="Next track"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--accent-glow)]"
            >
              <SkipForward size={15} />
            </button>
          )}
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute music" : "Mute music"}
            aria-pressed={muted}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--accent-glow)]"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
