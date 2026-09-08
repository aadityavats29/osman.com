import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" packages a self-contained server for the Docker image.
  // Vercel does its own output tracing and breaks if standalone is forced
  // (ENOENT .next/next-server.js.nft.json), so skip it there.
  output: process.env.VERCEL ? undefined : "standalone",
  poweredByHeader: false,
  async redirects() {
    // Keynote 02-09 services rename: coaching → piano for events,
    // workshops → music production. Old URLs stay alive for SEO/links.
    return [
      {
        source: "/services/coaching",
        destination: "/services/piano-for-events",
        permanent: true,
      },
      {
        source: "/services/workshops",
        destination: "/services/music-production",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
