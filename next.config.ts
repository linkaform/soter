import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f001.backblazeb2.com", // Backblaze B2
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // Wikipedia (para la imagen "Image Not Found")
      },
    ],
  },
};

export default nextConfig;