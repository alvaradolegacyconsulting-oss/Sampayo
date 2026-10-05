import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Two root layouts (app/(default), app/(alternate)/[alt]) mean no shared layout for a 404; see app/global-not-found.tsx.
    globalNotFound: true,
  },
};

export default nextConfig;
