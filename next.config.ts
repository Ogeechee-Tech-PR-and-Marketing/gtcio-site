import type { NextConfig } from "next";

// Content-Security-Policy. The site renders no user-authored HTML and loads
// exactly one third party — Adobe Fonts (use.typekit.net for the CSS + font
// files, p.typekit.net for its usage beacon). Everything else is same-origin.
//
// 'unsafe-inline' is unavoidable for both scripts and styles without moving
// to per-request nonces, which would force every page to render dynamically
// (Next's hydration payload is an inline script; React inline `style={}`
// attributes are inline styles). The policy still blocks foreign script
// hosts, framing, plugins, form exfiltration and any connection or image
// from an unlisted origin.
//
// Dev needs 'unsafe-eval' (Turbopack source maps); preview deployments need
// vercel.live for the Vercel toolbar. Both are added only in that
// environment so production stays strict.
const isDev = process.env.NODE_ENV === "development";
const isPreview = process.env.VERCEL_ENV === "preview";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${isPreview ? " https://vercel.live" : ""}`,
  "style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net",
  "font-src 'self' data: https://use.typekit.net",
  "img-src 'self' data: blob: https://p.typekit.net",
  "media-src 'self'",
  `connect-src 'self' https://use.typekit.net https://p.typekit.net${isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src ${isPreview ? "https://vercel.live" : "'none'"}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
      {
        // Short vanity URL for print/QR (gtcio.org/diploma). The canonical-
        // host proxy (src/proxy.ts) moves gtcio.org to SITE_URL keeping the
        // path, so a relative destination covers every host. Temporary so it
        // can be repointed without browsers having cached the old target.
        source: "/diploma",
        destination: "/iot-diploma-program",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Vercel's edge previously added this automatically on *.vercel.app;
          // the app sets it directly too, which is harmless duplication.
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
