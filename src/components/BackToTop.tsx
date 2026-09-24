"use client";

import { useEffect, useState } from "react";

/**
 * Floating "back to top" button, phones only (hidden from md up). Appears
 * once the visitor has scrolled about a screen's height.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // The button hides itself at the top, so hand focus to <main> rather than
    // dropping keyboard/screen-reader users back at the start of the document.
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      // `invisible` takes it out of the tab order while hidden; visibility is
      // in the transition list so it flips after the fade-out, not before.
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-brand-white shadow-lg transition-[opacity,translate,visibility] duration-200 hover:bg-brand-black md:hidden ${
        visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"
      }`}
    >
      <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" />
      </svg>
    </button>
  );
}
