// Shared between proxy.ts (checks the cookie), api/site-pin/route.ts (sets
// it) and site-pin/page.tsx — see PROJECT.md §6.
export const SITE_PIN_COOKIE = "gtcio_pin";

/**
 * The post-PIN return path, restricted to a same-origin absolute path.
 * Rejects protocol-relative forms — "//evil.com" AND "/\evil.com", which
 * WHATWG URL parsing (browsers and Node alike) also resolves to a foreign
 * host — so the gate can never be turned into an open redirect.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (typeof next === "string" && /^\/(?![/\\])/.test(next) && !/[\\\r\n]/.test(next)) {
    return next;
  }
  return "/";
}
