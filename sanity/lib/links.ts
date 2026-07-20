/**
 * Turns the `destination` picked in the Studio into a real href.
 *
 * Editors choose a page from a dropdown instead of typing a URL, so links can't
 * rot from a typo. If a route ever moves, change it HERE and every CMS-managed
 * button across the site follows — no editor has to touch anything.
 *
 * Keep the keys in sync with the options list in
 * sanity/schemaTypes/objects/ctaButton.ts.
 */
export const DESTINATIONS = {
  home: "/",
  about: "/about",
  training: "/training",
  iot: "/iot-diploma-program",
  facility: "/facility",
  // "tour" removed 2026-07-20 — tour booking is off the site until
  // 2026-10-26. Restore as `tour: "/facility#book-a-tour"` once the Book a
  // Tour section is back in facility/page.tsx, along with its ctaButton.ts option.
  partners: "/partners",
  becomePartner: "/partners#become-a-partner",
  news: "/news",
  contact: "/contact",
  apply: "https://www.ogeecheetech.edu/admissions/next-steps",
} as const;

export type Destination = keyof typeof DESTINATIONS | "external";

export type CtaButton = {
  _key?: string;
  label?: string;
  destination?: Destination;
  externalUrl?: string;
};

/**
 * Accepts only site-relative or http(s) URLs; anything else (javascript:,
 * data:, vbscript:…) comes back null and simply doesn't render. The Studio
 * already validates schemes at authoring time — this is the render-time
 * backstop for values that reached the dataset some other way.
 */
export function safeHref(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  return null;
}

/** Resolves a CMS button to an href, or null if it isn't usable yet. */
export function resolveHref(button?: CtaButton | null): string | null {
  if (!button?.destination) return null;
  if (button.destination === "external") return safeHref(button.externalUrl);
  return DESTINATIONS[button.destination] ?? null;
}

/** True when the link leaves this site, so it should open in a new tab. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
