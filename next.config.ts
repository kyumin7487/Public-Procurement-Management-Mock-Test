import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: true,

    basePath: "/Public-Procurement-Management-Mock-Test",

    images: {
        unoptimized: true,
    },
};

export default nextConfig;