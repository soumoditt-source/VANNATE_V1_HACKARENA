import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next-live",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
