import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
