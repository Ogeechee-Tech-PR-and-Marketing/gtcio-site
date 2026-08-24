import Image from "next/image";
import HeroCard from "@/components/HeroCard";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  /** Background video (muted, looping). Takes the place of `image` when set. */
  video?: string;
  /** Still shown while the video loads. Use a frame FROM the video so it doesn't jump. */
  videoPoster?: string;
  /** Optional CTA (e.g. a Button) rendered under the description. */
  cta?: React.ReactNode;
  /** Optional content (e.g. a stat row) rendered under the description/cta. */
  extra?: React.ReactNode;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imagePosition,
  video,
  videoPoster,
  cta,
  extra,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-black px-6 py-16 text-brand-white sm:px-10 sm:py-24">
      {video ? (
        <video
          src={video}
          poster={videoPoster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
      ) : (
        image && (
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            priority
            className="object-cover"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
        )
      )}
      <div className="relative mx-auto max-w-5xl">
        {/*
          One rectangle behind the eyebrow/title/description as a group
          (Jake: per-line chips read as "gross"/segmented), fitted to just
          the text via `inline-block` (a plain block div fills this column's
          full width regardless of text length, which over-sized every
          earlier single-rectangle attempt), with soft, faded edges instead
          of a hard boundary.

          The fade is a BLURRED rectangle behind the text, not a radial
          gradient — tried the gradient first and it measurably failed even
          worse than expected: a radial gradient's opacity falls off from
          the CARD'S CENTER, but eyebrow/title/description stack vertically,
          so only the middle line sits anywhere near that center — the
          eyebrow (top) and description (bottom) landed in the faded outer
          region and measured 1.96:1 / 1.14:1 against the Facility hero, far
          below even the already-known-risky flat .55 (2.46:1). A blurred
          rectangle doesn't have that problem: its opacity stays FLAT and
          uniform across its whole interior (blur only softens the boundary,
          it doesn't gradient the center), so every line gets the same
          protection regardless of where it sits in the stack, and the
          visible "fade" is confined to the blurred edge band.

          Opacity is .65 at Jake's explicit request, overriding the .70
          floor measured earlier (git history on this file has the full
          bisection). At .65 the brand-gold eyebrow measurably fails in
          real spots: exactly 4.5:1 (zero margin) on one frame of the About
          video, and 4.37:1 (outright fail) on mobile Facility. Jake saw
          those numbers and asked for .65 anyway to evaluate visually — this
          is a known, deliberate acceptance of that risk, not an oversight.
          If contrast complaints come back on the eyebrow specifically,
          this paragraph is why, and .70 is the last value that measured
          clean everywhere tested.

          `cta` and `extra` now render INSIDE this card (moved 2026-07-21),
          not after it — Jake wanted the scrim under the Training page's
          stat row (~460,000 hrs / 92+ years / 52 years), which is passed
          as `extra`. Since this card is `inline-block` and the halo below
          sizes off THIS wrapper via `inset-1`, nesting cta/extra here makes
          the halo grow to cover them automatically — no separate sizing
          logic needed. Order (description, then cta, then extra) matches
          the prop docs above ("rendered under the description/cta").
          `cta` buttons (Button/CtaButton) already carry an opaque red
          background regardless of what's behind them, so moving them here
          is cosmetically neutral.

          ⚠️ `extra` is NOT fully safe at this opacity: Training's stat
          captions still render in brand-silver (the same weak-contrast
          color the description used to fight with before it moved to
          white). Measured at .70: two of three captions passed (4.9–5.6:1)
          but "Hours of instruction GTCIO can deliver each year" failed
          outright (2.99:1 desktop, 3.91:1 mobile) — it sits over a
          brighter patch of the Training photo. Jake was shown this and
          said the captions are fine as brand-silver — a deliberate call,
          not an oversight, so don't "fix" this by recoloring them without
          asking again. At .65 (current) that caption fails by more, not
          less.

          This card is a <HeroCard>, not a plain `inline-block` div — a
          shrink-to-fit box's auto width resolves to the full *available*
          width the moment its content wraps to more than one line, not to
          the (narrower) width the wrapped lines actually render at (same
          with `display:table` — not an inline-block quirk, just how CSS
          auto-width works). Usually invisible here since interior titles
          are short, but the same card shape is shared with the Home hero,
          where a wrapped headline exposed it clearly (2026-07-30).
          HeroCard measures the actual rendered text and sets an explicit
          width instead of trusting shrink-to-fit.
        */}
        <HeroCard>
          {eyebrow && (
            <p className="font-display mb-3 text-sm text-brand-gold">{eyebrow}</p>
          )}
          <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-lg text-brand-white">{description}</p>
          )}
          {cta && <div className="mt-8">{cta}</div>}
          {extra && <div className="mt-10">{extra}</div>}
        </HeroCard>
      </div>
    </section>
  );
}
