import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
