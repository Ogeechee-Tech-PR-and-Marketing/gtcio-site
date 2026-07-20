import Image from "next/image";

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
        <>
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
          {/*
            Flat 70% black, not the photo gradient below. The gradient is only 40%
            black at the top, which is where the headline sits — fine over the
            dim stock photos, unreadable over bright footage (the ITB robot clip
            is a light beige wall). This matches the home page's video overlay.
          */}
          <div className="absolute inset-0 bg-brand-black/70" />
        </>
      ) : (
        image && (
          <>
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              priority
              className="object-cover"
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/70 to-brand-black/40" />
          </>
        )
      )}
      <div className="relative mx-auto max-w-5xl">
        {eyebrow && (
          <p className="font-display mb-3 text-sm text-brand-gold">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg text-brand-silver">{description}</p>
        )}
        {cta && <div className="mt-8">{cta}</div>}
        {extra && <div className="mt-10">{extra}</div>}
      </div>
    </section>
  );
}
