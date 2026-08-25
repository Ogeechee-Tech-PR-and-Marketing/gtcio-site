/**
 * Maps a page's `destination` key to a real href.
 *
 * Originally driven by an editor's dropdown choice in the Sanity Studio
 * (removed 2026-08-11); now every CtaButton in the DEFAULTS objects picks one
 * of these keys directly. If a route ever moves, change it HERE and every
 * button across the site follows.
 */
export const DESTINATIONS = {
  home: "/",
  about: "/about",
  training: "/training",
  iot: "/iot-diploma-program",
  curriculum: "/iot-diploma-program/curriculum",
  // Key kept as `certifications` on purpose. The page moved to a top-level
  // /credentials route on 2026-07-20, and this is exactly what DESTINATIONS is
  // for — the URL changed here and every button followed, with no dataset
  // patch. Renaming the key would have orphaned the already-seeded
  // `certificationsButton` on the IOT page.
  certifications: "/credentials",
  facility: "/facility",
  // "tour" removed 2026-07-20 — tour booking is off the site until
  // 2026-10-26. Restore as `tour: "/facility#book-a-tour"` once the Book a
  // Tour section is back in facility/page.tsx.
  partners: "/partners",
  becomePartner: "/partners#become-a-partner",
  news: "/news",
  contact: "/contact",
  apply: "https://www.ogeecheetech.edu/admissions/next-steps",
  // The "Industrial Operations Program" brochure, in the two forms the site
  // offers it — the same pairing the Training page uses for the employer
  // catalog. The flipbook lives in the same fliphtml5 account (`exygb`).
  iotProgramFlipbook: "https://online.fliphtml5.com/exygb/xhzf/#p=1",
  iotProgramPdf: "/documents/industrial-operations-program-3.pdf",
} as const;

/**
 * Destinations that are a file rather than a page. `CtaButton` adds a
 * `download` attribute for these so the browser saves the PDF instead of
 * navigating away from the site.
 */
export const DOWNLOAD_DESTINATIONS = new Set<string>(["iotProgramPdf"]);

export type Destination = keyof typeof DESTINATIONS | "external";

export type CtaButton = {
  _key?: string;
  label?: string;
  destination?: Destination;
  externalUrl?: string;
};

/**
 * Accepts only site-relative or http(s) URLs; anything else (javascript:,
 * data:, vbscript:…) comes back null and simply doesn't render.
 */
export function safeHref(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  return null;
}

/** Resolves a button to an href, or null if it isn't usable. */
export function resolveHref(button?: CtaButton | null): string | null {
  if (!button?.destination) return null;
  if (button.destination === "external") return safeHref(button.externalUrl);
  return DESTINATIONS[button.destination] ?? null;
}

/** True when the link leaves this site, so it should open in a new tab. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
