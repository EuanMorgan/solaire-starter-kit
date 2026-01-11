import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,

  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  typedRoutes: true,

  // PostHog reverse proxy to avoid ad blockers (disabled in CI)
  async rewrites() {
    if (process.env.CI) {
      return [];
    }
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
