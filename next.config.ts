import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignore ESLint errors during builds (can still run separately)
    ignoreDuringBuilds: true,
  },
  images: {
    // Cho phép load ảnh local trong thư mục /public
    localPatterns: [
      {
        pathname: '/**',
      },
    ],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
};

export default nextConfig;
