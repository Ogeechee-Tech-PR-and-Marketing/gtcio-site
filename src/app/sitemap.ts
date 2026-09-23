import type { MetadataRoute } from "next";
import { DESTINATIONS } from "@/lib/links";
import { NAV_ITEMS } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

// Every public route: the nav's pages plus the course detail page, which is
// deliberately not in the nav (PROJECT.md §10) but public and indexable.
const ROUTES = [...NAV_ITEMS.map((item) => item.href), DESTINATIONS.curriculum];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
