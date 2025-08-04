import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Option A: simple domain list
    domains: ['sgzmxsaygcsvktsaknhe.supabase.co'],

    // —OR—

    // Option B: more flexible remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sgzmxsaygcsvktsaknhe.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/documents/**',
      },
    ],
  },
};

export default nextConfig;
