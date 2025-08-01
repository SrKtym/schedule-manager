import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: 'incremental',
    webpackMemoryOptimizations: true,
    optimizePackageImports: ['@heroui/react', '@iconify/react']
  },
  reactStrictMode: false,
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

export default bundleAnalyzer(nextConfig);
