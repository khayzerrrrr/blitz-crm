import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
