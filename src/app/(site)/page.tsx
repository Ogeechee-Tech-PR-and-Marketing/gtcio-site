import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, resolveHeroVideo, type SanityImage } from "@/sanity/lib/image";
import type { CtaButton as CtaButtonData } from "@/sanity/lib/links";

// ⚠️ CMS values override these defaults once a field is set on the Sanity doc —
// editing this object alone does NOT change the live site. Patch the published
// doc (and any draft of it) too. PROJECT.md §4, trap 6 has the how.
const DEFAULTS = {
  heroEyebrow: "",
  heroTitle: "Building a workforce ready for industry transformation.",
  heroDescription:
    "GTCIO trains Georgia's workforce for careers in Industrial Operations Technology. These are the people who keep factories, utilities, and logistics centers running when something breaks or a line goes down. The diploma program opens for enrollment now, ahead of its August 2026 launch.",
  sectionTitle: "Training the next generation",
  sectionBody:
    "These skills carry well past the factory floor, into facilities management, utilities, and logistics, anywhere equipment has to keep running. Students start with the fundamentals: mechanical, electrical, hydraulic, and pneumatic systems. From there it's robotics, PLCs, and smart automation. Every student who earns the diploma is credentialed through the Smart Automation Certification Alliance (SACA), an industry-recognized credential.",
  studentsCard: {
    title: "Students",
    description: "Earn a diploma built around hands-on work with real industrial equipment, not just theory.",
  },
  employersCard: {
    title: "Employers",
    description: "Need to hire skilled graduates or upskill the crew you've already got? GTCIO can help with both.",
  },
  partnersCard: {
    title: "Partners",
    description: "Equipment sponsorships, facility tours, a seat on the advisory board: there's more than one way in.",
  },
  heroButtons: [
    { label: "IOT TRAINING PROGRAMS", destination: "training" },
    { label: "IOT DIPLOMA PROGRAM", destination: "iot" },
    { label: "BECOME A PARTNER", destination: "becomePartner" },
  ] as CtaButtonData[],
  partnerBandTitle: "Become a GTCIO Partner",
  partnerBandBody:
    "GTCIO is built alongside the employers who hire our graduates. Sponsor equipment, host a tour, hire our technicians, or take a seat on the advisory board. There's more than one way to get involved, and we're actively growing our partner network.",
  partnerBandButton: { label: "BECOME A PARTNER", destination: "becomePartner" } as CtaButtonData,
};

export default async function Home() {
  const { data } = await sanityFetch({ query: HOME_PAGE_QUERY });
  const typed = data as
    | (Partial<typeof DEFAULTS> & {
        heroImage?: SanityImage;
        heroImageAlt?: string;
        heroVideo?: { asset?: { url?: string } | null };
        heroVideoPoster?: SanityImage;
      })
    | null;
  const page = { ...DEFAULTS, ...typed };
  const heroButtons = page.heroButtons?.length ? page.heroButtons : DEFAULTS.heroButtons;
  // An unfinished draft can carry heroTitle: null, which would override the
  // spread default and crash the .split() below — fall back explicitly.
  const heroTitle = page.heroTitle || DEFAULTS.heroTitle;

  const pathways = [
    { ...DEFAULTS.studentsCard, ...page.studentsCard, href: "/iot-diploma-program", cta: "Explore the IOT Diploma Program" },
    { ...DEFAULTS.employersCard, ...page.employersCard, href: "/training", cta: "See Training for Employers" },
    { ...DEFAULTS.partnersCard, ...page.partnersCard, href: "/partners", cta: "Become a Partner" },
  ];

  // The banner plays a looping construction video by default. An editor can
  // override it by uploading a Background photo in the Studio, which always
  // takes priority — otherwise the field would silently do nothing. Absent a
  // photo, an uploaded Background video replaces the default footage.
  const useVideo = !typed?.heroImage;
  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-construction-poster-2.jpg",
    fallbackAlt: "Construction of the GTCIO facility",
    fallbackPosition: "50% 50%",
  });
  const heroVideo = resolveHeroVideo({
    video: typed?.heroVideo,
    poster: typed?.heroVideoPoster,
    fallbackSrc: "/videos/hero-construction-3.mp4",
    fallbackPoster: "/images/hero-construction-poster-2.jpg",
  });

  return (
    <>
      <section className="relative overflow-hidden bg-brand-black px-6 py-24 text-brand-white sm:px-10 sm:py-32">
        {useVideo ? (
          <video
            src={heroVideo.src}
            poster={heroVideo.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            className="object-cover"
            style={{ objectPosition: hero.position }}
          />
        )}
        <div className="relative mx-auto max-w-7xl">
          {/*
            Matches PageHero.tsx's hero scrim (kept in sync 2026-07-21 — this
            page predates PageHero and had its own flat bg-brand-black/70
            overlay, which is why it was still dark after every other hero was
            lightened): a blurred rectangle behind the text, opacity .65,
            isolate + -z-10 so it sandwiches between the video/photo and the
            text without a stacking bug (see PageHero.tsx's comment for why
            `isolate` is load-bearing), blur-xl for a soft edge. Description is
            brand-white, not brand-silver, for the same contrast-headroom
            reason documented in PageHero.tsx.

            TWO separate cards here, not one — this page's headline is a
            special case PageHero's interior titles aren't: it's deliberately
            sized to almost fill the full container on one line (see the
            measured-font-size comment below), which made it far wider than
            the description (max-w-2xl) and the button row. `inline-block`
            shrink-wraps to the WIDEST child, so one shared card sized itself
            to the headline and left a large, empty dark gap to the right of
            the shorter description/buttons — reported 2026-07-21 as "the
            scrim goes way past the end of the text." Splitting into
            eyebrow+title / description+buttons lets each card fit its own
            content instead of inheriting the headline's unusual width.
          */}
          <div className="relative isolate inline-block">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-1 -z-10 rounded-3xl bg-black/65 blur-xl"
            />
            <div className="px-8 py-6 sm:px-10 sm:py-8">
              {page.heroEyebrow && <p className="font-display mb-4 text-sm text-brand-gold">{page.heroEyebrow}</p>}
              {/* Jan wants the headline on one line on desktop; it may wrap on small
                  screens. The sizes below are measured, not guessed: this headline
                  renders ~21.7px wide per 1px of font-size in Trade Gothic Next Heavy
                  Compressed, so 52px needs ~1128px and 56px needs ~1215px, inside a
                  1200–1280px container from xl up. Deliberately NOT whitespace-nowrap
                  — this section is overflow-hidden, so a longer headline (or the wider
                  Arial Narrow fallback if Adobe Fonts fails) would be clipped rather
                  than wrapped. Keep the headline short and it stays on one line. */}
              <h1 className="font-display text-4xl leading-tight sm:text-5xl xl:text-[3.25rem] 2xl:text-[3.5rem]">
                {heroTitle.split("\n").map((line: string, i: number, arr: string[]) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </h1>
            </div>
          </div>
          <div className="relative isolate mt-6 inline-block">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-1 -z-10 rounded-3xl bg-black/65 blur-xl"
            />
            <div className="px-8 py-6 sm:px-10 sm:py-8">
              <p className="max-w-2xl text-lg text-brand-white">{page.heroDescription}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                {heroButtons.map((button, i) => (
                  <CtaButton key={button._key ?? i} button={button} variant="primary" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.sectionTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.sectionBody}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {pathways.map((p, i) => (
              <div key={i} className="flex flex-col justify-between border border-brand-silver/40 p-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-brand-black">{p.title}</h3>
                  <p className="mt-2 text-sm text-brand-silver">{p.description}</p>
                </div>
                <Link
                  href={p.href}
                  className="font-heading mt-6 inline-block text-sm font-bold tracking-wide text-brand-red hover:text-brand-black"
                >
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-brand-silver/30 bg-brand-red px-6 py-16 text-brand-white sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-bold">{page.partnerBandTitle}</h2>
            {page.partnerBandBody && (
              <p className="mt-3 text-brand-white/90">{page.partnerBandBody}</p>
            )}
          </div>
          <CtaButton button={page.partnerBandButton} variant="dark" className="shrink-0" />
        </div>
      </section>
    </>
  );
}
