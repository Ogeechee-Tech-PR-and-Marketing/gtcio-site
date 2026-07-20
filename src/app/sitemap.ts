import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Every public route in the (site) group. Keep in step with the nav
// (Header.tsx) and with sanity/lib/links.ts when routes are added or moved.
const ROUTES = [
  "/",
  "/about",
  "/training",
  "/iot-diploma-program",
  // Course detail page. Deliberately not in the nav (PROJECT.md §10), but it is
  // public and should be indexed. Its sibling certifications page became the
  // top-level /credentials route below and 308-redirects there.
  "/iot-diploma-program/curriculum",
  "/credentials",
  "/facility",
  "/partners",
  "/news",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
