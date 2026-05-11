import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all sources including local /uploads/
    remotePatterns: [],
    unoptimized: true,
  },
};

export default nextConfig;
