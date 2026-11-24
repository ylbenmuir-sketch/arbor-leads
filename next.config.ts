import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], qualities: [55, 75] },
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
