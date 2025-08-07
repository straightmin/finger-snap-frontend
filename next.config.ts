import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3001",
            },
            {
                protocol: "https",
                hostname: "*.s3.amazonaws.com",
            },
        ],
    },
    experimental: {
        turbo: {
            // Turbopack 설정
        },
    },
};

export default nextConfig;
