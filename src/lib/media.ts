/**
 * Media helpers for creative works: turn a pasted link (YouTube, TikTok,
 * Instagram, or a direct video file) into something we can embed.
 */

export type Platform = "youtube" | "tiktok" | "instagram" | "file" | "link";

export interface VideoInfo {
  platform: Platform;
  url: string;
  /** iframe src for the full player (youtube / tiktok / instagram) */
  embed?: string;
  /** thumbnail we can show without loading the embed */
  thumb?: string;
  /** true for vertical formats (shorts, reels, tiktok) */
  vertical: boolean;
}

export type MediaItem = { type: "image"; src: string } | { type: "video"; info: VideoInfo };

const FILE_RE = /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i;

export function parseVideo(raw: string): VideoInfo | null {
  const url = (raw || "").trim();
  if (!url) return null;

  let u: URL;
  try {
    u = new URL(url.startsWith("http") || url.startsWith("/") ? url : `https://${url}`, "https://x.local");
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  const parts = u.pathname.split("/").filter(Boolean);

  // YouTube
  if (host === "youtu.be" || host.endsWith("youtube.com")) {
    let id = "";
    let vertical = false;
    if (host === "youtu.be") id = parts[0];
    else if (parts[0] === "shorts") { id = parts[1]; vertical = true; }
    else if (parts[0] === "embed" || parts[0] === "live") id = parts[1];
    else id = u.searchParams.get("v") || "";
    if (id) {
      return {
        platform: "youtube",
        url: u.href,
        embed: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`,
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        vertical,
      };
    }
  }

  // TikTok — needs the full link with /video/<id>
  if (host.endsWith("tiktok.com")) {
    const i = parts.indexOf("video");
    const id = i >= 0 ? parts[i + 1] : "";
    return {
      platform: "tiktok",
      url: u.href,
      // player/v1 is a clean 9:16 video player (no profile card around it)
      embed: id ? `https://www.tiktok.com/player/v1/${id}?autoplay=1&loop=1&rel=0&music_info=1&description=0` : undefined,
      vertical: true,
    };
  }

  // Instagram post / reel
  if (host.endsWith("instagram.com")) {
    const i = parts.findIndex((p) => ["p", "reel", "reels", "tv"].includes(p));
    const code = i >= 0 ? parts[i + 1] : "";
    return {
      platform: "instagram",
      url: u.href,
      embed: code ? `https://www.instagram.com/${parts[i] === "reels" ? "reel" : parts[i]}/${code}/embed/` : undefined,
      vertical: true,
    };
  }

  if (FILE_RE.test(u.pathname)) {
    return { platform: "file", url: url, vertical: false };
  }

  return { platform: "link", url: u.href, vertical: false };
}

export const PLATFORM_LABEL: Record<Platform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  file: "Video",
  link: "Link",
};
