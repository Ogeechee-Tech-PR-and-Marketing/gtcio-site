import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image) {
  return imageBuilder.image(source);
}

export type SanityImage = Image & {
  _key?: string;
  hotspot?: { x: number; y: number };
};

type HeroImageInput = {
  image?: SanityImage | null;
  alt?: string | null;
  fallbackSrc: string;
  fallbackAlt: string;
  fallbackPosition: string;
};

/**
 * Resolves a page hero's photo. When an editor has uploaded one in Sanity we use
 * it, deriving object-position from the hotspot they dragged (image-relative
 * percentages, so the focal point survives every viewport crop). Otherwise we
 * fall back to the photo and hand-tuned focal point committed in the repo.
 */
export function resolveHeroImage({
  image,
  alt,
  fallbackSrc,
  fallbackAlt,
  fallbackPosition,
}: HeroImageInput) {
  if (!image?.asset) {
    return { src: fallbackSrc, alt: fallbackAlt, position: fallbackPosition };
  }

  const { hotspot } = image;
  return {
    // auto("format") lets Sanity's CDN serve WebP/AVIF to browsers that accept
    // it — next/image re-encodes anyway, but its source fetch gets smaller too.
    src: urlForImage(image).width(1920).quality(80).auto("format").url(),
    alt: alt || fallbackAlt,
    position: hotspot
      ? `${(hotspot.x * 100).toFixed(1)}% ${(hotspot.y * 100).toFixed(1)}%`
      : "50% 50%",
  };
}

type HeroVideoInput = {
  video?: { asset?: { url?: string } | null } | null;
  poster?: SanityImage | null;
  fallbackSrc: string;
  fallbackPoster: string;
};

/**
 * Resolves a page hero's background video. The video field's asset must be
 * dereferenced in the GROQ query (`heroVideo{..., asset->}`) — unlike images,
 * a file asset reference has no self-contained URL to build from. Falls back
 * to the video committed in the repo when no CMS video is uploaded.
 */
export function resolveHeroVideo({ video, poster, fallbackSrc, fallbackPoster }: HeroVideoInput) {
  return {
    src: video?.asset?.url || fallbackSrc,
    poster: poster?.asset ? urlForImage(poster).width(1600).quality(70).url() : fallbackPoster,
  };
}
