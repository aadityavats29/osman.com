import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" packages a self-contained server for the Docker image.
  // Vercel does its own output tracing and breaks if standalone is forced
  // (ENOENT .next/next-server.js.nft.json), so skip it there.
  output: process.env.VERCEL ? undefined : "standalone",
  poweredByHeader: false,
};

export default nextConfig;
