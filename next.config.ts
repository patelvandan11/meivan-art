import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/plants",
        destination: "/shop?category=botanical-art",
        permanent: false,
      },
      {
        source: "/planters",
        destination: "/shop",
        permanent: false,
      },
      {
        source: "/bundles",
        destination: "/shop",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
