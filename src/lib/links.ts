/**
 * Maps a page's `destination` key to a real href. Every CtaButton in the
 * DEFAULTS objects picks one of these keys. If a route ever moves, change it
 * HERE and every button across the site follows.
 */
export const DESTINATIONS = {
  home: "/",
  about: "/about",
  training: "/training",
  iot: "/iot-diploma-program",
  curriculum: "/iot-diploma-program/curriculum",
  // Key deliberately still `certifications` — it predates the page's move to
  // /credentials, and renaming it would orphan every button that references
  // it. The whole point of this indirection is that only the href changes.
  certifications: "/credentials",
  facility: "/facility",
  // No `tour` key while Book a Tour is off the site (returns 2026-10-26).
  // Restore as `tour: "/facility#book-a-tour"` alongside the section in
  // facility/page.tsx — see PROJECT.md §10.
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
