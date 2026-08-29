import type { NextConfig } from "next";

const scriptPolicy = process.env.NODE_ENV === "development"
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com"
  : "script-src 'self' 'unsafe-inline' https://app.sandbox.midtrans.com https://app.midtrans.com";
const connectPolicy = process.env.NODE_ENV === "development"
  ? "connect-src 'self' http://127.0.0.1:8080 http://127.0.0.1:9099 ws://127.0.0.1:9150 https://api.cloudinary.com https://api.sandbox.midtrans.com https://api.midtrans.com https://*.googleapis.com https://*.firebaseio.com"
  : "connect-src 'self' https://api.cloudinary.com https://api.sandbox.midtrans.com https://api.midtrans.com https://*.googleapis.com https://*.firebaseio.com";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }, { protocol: "https", hostname: "images.unsplash.com" }],
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "Content-Security-Policy", value: `default-src 'self'; ${scriptPolicy}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com; ${connectPolicy}; frame-src https://app.sandbox.midtrans.com https://app.midtrans.com; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ] }];
  },
  experimental: { optimizePackageImports: ["lucide-react", "recharts"] },
};

export default nextConfig;
