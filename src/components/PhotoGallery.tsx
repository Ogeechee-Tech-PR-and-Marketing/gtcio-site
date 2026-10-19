"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type GalleryPhoto = {
  src: string;
  alt: string;
  /** Shown under the photo in the lightbox; the alt text stays descriptive. */
  caption?: string;
  /** CSS object-position for the cropped 3:2 thumbnail — the subject's true focal point. */
  position?: string;
};

/**
 * A lead photo across the full width, a 3:2 thumbnail grid under it, and a
 * native <dialog> lightbox showing the full, uncropped photo. <dialog> gives
 * Esc-to-close, focus trapping and focus return for free; arrows add
 * prev/next.
 */
export default function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [lead, ...rest] = photos;

  function open(i: number) {
    setIndex(i);
    dialogRef.current?.showModal();
  }

  function step(delta: number) {
    setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("close", onClose);
    };
    // step only reads state through its updater, so it never goes stale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = index === null ? null : photos[index];

  return (
    <>
      <button
        type="button"
        onClick={() => open(0)}
        className="group relative block aspect-[3/2] w-full overflow-hidden bg-brand-black"
      >
        <Image
          src={lead.src}
          alt={lead.alt}
          fill
          sizes="(min-width: 960px) 896px, 100vw"
          style={{ objectPosition: lead.position ?? "50% 50%" }}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </button>

      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {rest.map((photo, i) => (
          <li
            key={photo.src}
            // An odd count leaves one orphan in the 2-up mobile grid; let it span.
            className={rest.length % 2 && i === rest.length - 1 ? "col-span-2 sm:col-span-1" : undefined}
          >
            <button
              type="button"
              onClick={() => open(i + 1)}
              className="group relative block aspect-[3/2] w-full overflow-hidden bg-brand-black"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 960px) 296px, (min-width: 640px) 33vw, 50vw"
                style={{ objectPosition: photo.position ?? "50% 50%" }}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClick={(e) => {
          // A click on the backdrop (the dialog element itself) closes it.
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/90"
      >
        {current && (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 py-14 sm:px-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) dialogRef.current?.close();
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <p className="font-ui text-center text-sm text-brand-white">
              {current.caption && <span>{current.caption} · </span>}
              <span className="text-brand-silver">
                {index! + 1} of {photos.length}
              </span>
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close photo viewer"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-brand-white transition-colors hover:bg-brand-red"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-brand-white transition-colors hover:bg-brand-red"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12.5 4l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-brand-white transition-colors hover:bg-brand-red"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7.5 4l6 6-6 6" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
