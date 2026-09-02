/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // 30-second client router cache for dynamic routes to enable instant back-navigation without skeletons
    },
  },
};

export default nextConfig;
