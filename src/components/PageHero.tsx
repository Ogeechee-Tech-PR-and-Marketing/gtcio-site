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
          One rectangle behind the eyebrow/title/description as a group —
          per-line "highlighter chip" backgrounds were rejected by the site
          owner as segmented-looking; don't reintroduce them.

          The fade is a BLURRED rectangle, not a radial gradient. A radial
          gradient's opacity falls off from the card's CENTER, but the text
          stacks vertically, so the eyebrow (top) and description (bottom)
          land in the faded outer region — measured 1.96:1 / 1.14:1 on the
          Facility hero, far below usable. A blurred rectangle stays flat
          and uniform across its interior (blur only softens the boundary),
          so every line gets the same protection.

          ⚠️ Opacity is .65 at the site owner's explicit request, a known,
          deliberate acceptance of measured contrast risk — NOT an
          oversight. At .65 the brand-gold eyebrow fails in real spots
          (4.5:1 zero-margin on an About video frame; 4.37:1 on mobile
          Facility). The owner saw the numbers and chose .65 anyway; .70 is
          the last value that measured clean everywhere tested. If contrast
          complaints come back on the eyebrow, this is why.

          `cta` and `extra` render INSIDE this card so the halo (sized off
          this wrapper via `inset-1`) covers them automatically — the
          Training page's stat row passes in as `extra`. Buttons carry
          their own opaque red background, so nesting them is cosmetically
          neutral.

          ⚠️ `extra` is not fully safe at this opacity: Training's
          brand-silver stat captions measured as low as 2.99:1 over a
          bright patch of that page's photo. The owner was shown this and
          kept brand-silver deliberately — don't recolor without asking.

          This card is a <HeroCard>, not a plain `inline-block` div — a
          shrink-to-fit box's auto width resolves to the full *available*
          width the moment its content wraps to a second line (same with
          `display:table`; it's how CSS auto-width works). Interior titles
          are usually short enough to hide it, but the shared Home hero
          exposes it on wrapped headlines. HeroCard measures the rendered
          text and sets an explicit width.
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
