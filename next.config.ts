import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Cho phép load ảnh local trong thư mục /public
    localPatterns: [
      {
        pathname: '/**',
      },
    ],

    // Nếu bạn có dùng ảnh từ domain ngoài, ví dụ CDN
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "cdn.medicalink.com",
    //   },
    // ],
  },
};

export default nextConfig;
