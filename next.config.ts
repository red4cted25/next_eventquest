import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 's1.ticketm.net',
          port: '',
          search: ''
        },
        {
            protocol: 'https',
            hostname: 'images.universe.com',
            port: '',
            search: ''
        }
      ],
    }
};

export default nextConfig;
