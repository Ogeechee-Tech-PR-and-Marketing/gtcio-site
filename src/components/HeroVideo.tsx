"use client";

import { useEffect, useRef, useState } from "react";
import { preload as preloadResource } from "react-dom";

/**
 * The muted, looping background video behind a hero, plus the one control
 * WCAG 2.2.2 requires for auto-playing motion longer than five seconds: a
 * way to pause it. Also honours `prefers-reduced-motion` — for those users
 * the video is paused on load and the poster shows instead.
 *
 * The <video> is aria-hidden (purely decorative; the hero copy carries the
 * meaning); the button is the only thing assistive tech sees.
 */
type HeroVideoProps = {
  src: string;
  /** A frame FROM the video, so the swap from poster to first frame doesn't jump. */
  poster?: string;
  preload?: "auto" | "metadata" | "none";
  className?: string;
  style?: React.CSSProperties;
};

export default function HeroVideo({
  src,
  poster,
  preload = "metadata",
  className = "absolute inset-0 h-full w-full object-cover",
  style,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  // The poster is the hero's largest paint. A `poster` attribute is only
  // discovered when the <video> parses, so hint it from the document head.
  if (poster) preloadResource(poster, { as: "image", fetchPriority: "high" });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (query.matches) videoRef.current?.pause();
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload={preload}
        aria-hidden
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={className}
        style={style}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
        aria-pressed={!playing}
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-brand-white transition-colors hover:bg-brand-red"
      >
        {playing ? (
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <rect x="4" y="3" width="4" height="14" />
            <rect x="12" y="3" width="4" height="14" />
          </svg>
        ) : (
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M6 3.5v13l10-6.5z" />
          </svg>
        )}
      </button>
    </>
  );
}
