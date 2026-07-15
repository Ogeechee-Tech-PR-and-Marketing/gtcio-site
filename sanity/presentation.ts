import type { PresentationPluginOptions } from "sanity/presentation";

const PAGE_PATHS: Record<string, string> = {
  homePage: "/",
  aboutPage: "/about",
  facilityPage: "/facility",
  trainingPage: "/training",
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
