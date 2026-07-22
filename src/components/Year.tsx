"use client";

/**
 * Current year for the footer copyright. Must be a client component: pages are
 * statically prerendered and only rebuild on publish/deploy, so a server-side
 * `new Date().getFullYear()` freezes at build time and shows last year's date
 * every January until something happens to trigger a rebuild.
 * suppressHydrationWarning covers the once-a-year window where the prerendered
 * year and the visitor's clock disagree.
 */
export default function Year() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
