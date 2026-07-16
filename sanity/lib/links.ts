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
  tour: "/facility#book-a-tour",
  partners: "/partners",
  becomePartner: "/partners#become-a-partner",
  news: "/news",
  contact: "/contact",
  apply: "https://www.ogeecheetech.edu/IOT",
} as const;

export type Destination = keyof typeof DESTINATIONS | "external";

export type CtaButton = {
  _key?: string;
  label?: string;
  destination?: Destination;
  externalUrl?: string;
};

/** Resolves a CMS button to an href, or null if it isn't usable yet. */
export function resolveHref(button?: CtaButton | null): string | null {
  if (!button?.destination) return null;
  if (button.destination === "external") return button.externalUrl || null;
  return DESTINATIONS[button.destination] ?? null;
}

/** True when the link leaves this site, so it should open in a new tab. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
