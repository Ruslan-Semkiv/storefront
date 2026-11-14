import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Same-origin proxy to the Spring Boot Shop API: the browser calls /shop-api/v1/..., so the
  // HttpOnly cart_id cookie the API sets is first-party and no CORS setup is needed.
  async rewrites() {
    return [{ source: '/shop-api/:path*', destination: `${process.env.SHOP_BACKEND_URL ?? 'http://localhost:8080'}/:path*` }];
  },
  partialPrefetching: true,
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
