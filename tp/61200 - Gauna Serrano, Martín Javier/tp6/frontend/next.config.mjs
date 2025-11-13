import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true } as any,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/imagenes/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/imagenes/**",
      },
    ],
    minimumCacheTTL: 60,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  },
  typescript: {
    // cambiar a true solo si necesitas compilar con errores de TS
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
