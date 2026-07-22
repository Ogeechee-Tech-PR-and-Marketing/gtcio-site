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
          // Baseline CSP (added 2026-07-21). Deliberately NOT a full
          // default-src policy: the embedded Studio, Adobe Fonts, and Sanity's
          // live/preview APIs make a strict script/connect policy fragile, and
          // the site renders no user-authored HTML. frame-ancestors 'self'
          // mirrors X-Frame-Options above (same Studio iframe carve-out);
          // object-src and base-uri close off legacy injection vectors.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Vercel's edge previously added this automatically on *.vercel.app.
          // Self-hosting has no equivalent edge layer, so the app sets it
          // directly — see the self-hosting runbook (deploy/) for the nginx
          // side of the TLS termination this assumes.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
      // Hand-managed media in public/ is served with no cache lifetime by
      // default (max-age=0), so repeat visitors revalidate multi-MB videos.
      // These caches are LONG: changing one of these files in place means a
      // year of stale views for prior visitors — RENAME the file instead
      // (hero-construction-2.mp4, …) and update its references.
      ...["/videos/:path*", "/images/:path*", "/documents/:path*"].map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      })),
    ];
  },
};

export default nextConfig;
