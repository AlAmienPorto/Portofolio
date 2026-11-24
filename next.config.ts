import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder (a stray lockfile higher up confuses Turbopack)
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Allow all sources including local /uploads/
    remotePatterns: [],
    unoptimized: true,
  },
};

export default nextConfig;
