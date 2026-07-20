import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Every public route in the (site) group. Keep in step with the nav
// (Header.tsx) and with sanity/lib/links.ts when routes are added or moved.
const ROUTES = [
  "/",
  "/about",
  "/training",
  "/iot-diploma-program",
  // Detail pages under the diploma program. Deliberately not in the nav
  // (PROJECT.md §10), but they are public and should be indexed.
  "/iot-diploma-program/curriculum",
  "/iot-diploma-program/certifications",
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
