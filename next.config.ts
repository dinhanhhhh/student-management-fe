// next.config.ts
import type { NextConfig } from "next";

/**
 * Đọc biến môi trường ngay lúc build.
 * Nếu bạn đổi NEXT_PUBLIC_API_URL, nhớ restart dev server.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig = {
  reactStrictMode: true,

  /**
   * Rewrites: FE gọi /be/* (cùng origin) → Next đẩy sang BE để tránh CORS
   * - /be/:path*  →  {API_URL}/api/:path*
   * - /be-auth/:path* → {API_URL}/:path*  (để login/logout ở root BE)
   */
  async rewrites() {
    return [
      // FE /be/:path* → BE /api/:path*
      { source: "/be/:path*", destination: `${API_URL}/api/:path*` },
    ];
  },
} satisfies NextConfig;

export default nextConfig;
