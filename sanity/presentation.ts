import type { PresentationPluginOptions } from "sanity/presentation";

/**
 * Document ↔ URL mapping for the Studio's "Edit on page" (Presentation) tool:
 * `mainDocuments` tells it which document to open when an editor lands on a
 * URL, and `locations` labels where a document appears on the site. Every new
 * page singleton must be added to PAGE_PATHS — this is the third leg of the
 * three-file registration alongside singletonTypes (schemaTypes/index.ts) and
 * structure.ts; missing it means "Edit on page" can't map that page.
 */
const PAGE_PATHS: Record<string, string> = {
  homePage: "/",
  aboutPage: "/about",
  facilityPage: "/facility",
  trainingPage: "/training",
  credentialsPage: "/credentials",
  iotDiplomaProgramPage: "/iot-diploma-program",
  partnersPage: "/partners",
  newsPage: "/news",
  contactPage: "/contact",
};

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    partner: { locations: [{ title: "Partners page", href: "/partners" }] },
    newsItem: { locations: [{ title: "News page", href: "/news" }] },
    ...Object.fromEntries(
      Object.entries(PAGE_PATHS).map(([type, href]) => [
        type,
        { locations: [{ title: type, href }] },
      ])
    ),
  },
  mainDocuments: Object.entries(PAGE_PATHS).map(([type, route]) => ({
    route,
    type,
  })),
};
