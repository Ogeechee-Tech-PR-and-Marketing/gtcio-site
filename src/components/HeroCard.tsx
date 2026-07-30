"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * The blurred rounded scrim card behind hero copy (Home + every PageHero).
 * Sizes itself to the width of the actual widest RENDERED line, measured
 * in the DOM, instead of trusting CSS shrink-to-fit.
 *
 * Why: `inline-block`'s auto width resolves to the full *available* width
 * the moment its content wraps to more than one line — not to the
 * (usually narrower) width the wrapped lines actually render at. Verified
 * with a plain isolated test page: a `table`-display box does the exact
 * same thing, so this isn't an inline-block quirk, it's how CSS auto-width
 * shrink-to-fit works for any wrapped content. The effect is invisible when
 * a headline stays on one line, which is why this went unnoticed until a
 * headline wrapped on a viewport wide enough that the gap was large — the
 * card visibly extended past the text, worst when a short final line
 * follows a long one (e.g. the Home hero's "...industry" / "transformation.").
 *
 * `width` state doubles as the "measure me" trigger: `undefined` means
 * "render at natural (shrink-to-fit) width," and the layout effect below
 * measures whenever it sees that natural state and replaces it with an
 * explicit pixel value. Resize/font-load handlers reset to `undefined`
 * through `setWidth`, not by mutating `card.style.width` directly — an
 * earlier version did that, and it could strand the DOM with the width
 * cleared and nothing to restore it: if the remeasured value happened to
 * equal the already-committed state (the common case — e.g. the fonts.ready
 * remeasure firing moments after mount, same viewport, same result), React
 * bails out of re-rendering for an unchanged value, so the direct DOM
 * mutation used to force a fresh measurement was never overwritten by the
 * real style. Going through state for the reset keeps the DOM and React in
 * sync no matter what the remeasured value turns out to be.
 */
export default function HeroCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    if (width !== undefined) return;
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card || !content) return;

    const cardLeft = card.getBoundingClientRect().left;
    const paddingRight = parseFloat(getComputedStyle(content).paddingRight) || 0;

    let maxRight = 0;
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (!node.textContent?.trim()) continue;
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        maxRight = Math.max(maxRight, rect.right);
      }
    }
    if (maxRight > 0) {
      // +1px guards against sub-pixel rounding pushing the last word
      // back onto a new line once the explicit width is applied.
      setWidth(Math.ceil(maxRight - cardLeft + paddingRight) + 1);
    }
  }, [width]);

  useLayoutEffect(() => {
    const reset = () => setWidth(undefined);
    window.addEventListener("resize", reset);
    // Adobe Fonts can swap the fallback font for Trade Gothic after first
    // paint with different metrics (see PROJECT.md §7) — remeasure once
    // the real font is active so the card doesn't stay sized for the
    // fallback's wrap points.
    document.fonts?.ready.then(reset).catch(() => {});
    return () => window.removeEventListener("resize", reset);
  }, []);

  return (
    <div ref={cardRef} className={`relative isolate inline-block ${className}`} style={width ? { width } : undefined}>
      <div aria-hidden className="pointer-events-none absolute inset-1 -z-10 rounded-3xl bg-black/65 blur-xl" />
      <div ref={contentRef} className="px-8 py-6 sm:px-10 sm:py-8">
        {children}
      </div>
    </div>
  );
}
