import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Photos and illustrations are pre-compressed WebP (≤ ~90 KB); serving them directly from the CDN
    // avoids the on-demand resize on first view and lets the loader warm the exact files the page uses.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    // Menu images uploaded from the admin panel live in Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
