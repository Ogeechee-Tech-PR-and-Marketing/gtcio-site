"use client";

import { useRef } from "react";

type TimelineEvent = {
  _key?: string;
  date: string;
  title: string;
  detail?: string;
  highlight?: boolean;
};

// "July 2022" -> { year: "2022", rest: "July" }. "October 15, 2026" -> { year: "2026", rest: "October 15" }.
// `date` can be missing mid-edit: required-validation only blocks Publish, and
// the Studio's draft preview renders a freshly-added milestone immediately.
function splitDate(date: string | undefined) {
  const parts = (date ?? "").trim().split(" ");
  const year = parts[parts.length - 1]?.replace(",", "") ?? date;
  const rest = parts.slice(0, -1).join(" ");
  return { year, rest: rest || year };
}

export default function AboutTimeline({ items }: { items: TimelineEvent[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    // 320 ≈ one card + gap at the widest card size, so each arrow click
    // advances roughly one milestone.
    trackRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <div className="@container mt-12">
      <div className="mb-1 hidden items-center gap-6 @min-[560px]:flex">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="font-ui border-b-2 border-brand-black pb-1 text-sm text-brand-black transition-colors hover:border-brand-red hover:text-brand-red"
        >
          &larr; Earlier
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="font-ui border-b-2 border-brand-black pb-1 text-sm text-brand-black transition-colors hover:border-brand-red hover:text-brand-red"
        >
          Later &rarr;
        </button>
      </div>

      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-[87px] h-px bg-brand-black" />
        <div
          ref={trackRef}
          role="list"
          aria-label="GTCIO project timeline"
          className="flex snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth pb-2"
        >
          {items.map((item, i) => {
            const { year, rest } = splitDate(item.date);
            return (
              <div
                key={item._key ?? `${item.date}-${i}`}
                role="listitem"
                className="w-[82%] shrink-0 snap-start pr-8 last:pr-0 @min-[560px]:w-[300px]"
              >
                <p className="font-display text-[46px] leading-[0.9] text-brand-black">{year}</p>
                <p className="font-ui mt-0.5 mb-5 text-xs text-brand-red">{rest}</p>
                <span className="relative top-1.5 mb-5 block h-2.5 w-2.5 rounded-full bg-brand-black" />
                <h3 className="font-heading mb-2 text-base text-brand-black">
                  <span className={item.highlight ? "shadow-[inset_0_-6px_0_rgba(245,189,22,0.55)]" : ""}>
                    {item.title}
                  </span>
                </h3>
                {item.detail && <p className="max-w-[30ch] text-sm text-brand-silver">{item.detail}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
