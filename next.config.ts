import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Locally there's a stray package-lock.json higher up the folder tree that makes
  // Turbopack pick the wrong workspace root. Pin it for local builds only —
  // on Vercel the project is checked out on its own, so leave the default.
  ...(process.env.VERCEL ? {} : { turbopack: { root: path.resolve(__dirname) } }),
  images: {
    // Allow all sources including local /uploads/
    remotePatterns: [],
    unoptimized: true,
  },
};

export default nextConfig;
