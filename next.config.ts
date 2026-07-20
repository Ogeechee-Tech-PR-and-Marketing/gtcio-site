import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        // The SACA glossary lived here for a few hours on 2026-07-20 before
        // Credentials became a top-level page and absorbed it. Permanent so
        // search engines transfer rather than index both; the old URL is in
        // the deployed sitemap.xml, so it will be re-crawled.
        source: "/iot-diploma-program/certifications",
        destination: "/credentials",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // SAMEORIGIN (not DENY): the Studio's "Edit on page" tool iframes the
          // site from /studio on the same origin, and that must keep working.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
