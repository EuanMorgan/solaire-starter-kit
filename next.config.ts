import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  typedRoutes: true,
};

export default nextConfig;
