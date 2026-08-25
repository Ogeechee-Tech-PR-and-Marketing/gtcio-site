"use client";

import { useEffect } from "react";

/**
 * Self-heals a well-known Next.js App Router gap: <Link> navigations that
 * land on a URL with a #hash don't reliably scroll to the target element —
 * the scroll attempt can race the client-side render and silently no-op.
 * A hard page load always works (the browser's native hash-scroll runs after
 * the whole document is painted), so this just re-does that on mount, once
 * the route has actually committed. Renders nothing.
 */
export default function ScrollToHash() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    };
    const raf = requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}
