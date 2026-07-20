import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import NewsletterSignup from "@/components/NewsletterSignup";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, resolveHeroVideo, type SanityImage } from "@/sanity/lib/image";
import type { CtaButton as CtaButtonData } from "@/sanity/lib/links";

const DEFAULTS = {
  heroEyebrow: "",
  heroTitle: "Building a workforce ready for industry transformation.",
  heroDescription:
    "GTCIO trains Georgia's workforce for careers in Industrial Operations Technology. These are the people who keep factories, utilities, and logistics centers running when something breaks or a line goes down. The diploma program opens for enrollment now, ahead of its August 2026 launch.",
  sectionTitle: "Training the next generation",
  sectionBody:
    "These skills carry well past the factory floor, into facilities management, utilities, and logistics, anywhere equipment has to keep running. Students start with the fundamentals: mechanical, electrical, hydraulic, and pneumatic systems. From there it's robotics, PLCs, and smart automation. Every student who earns the diploma is credentialed through the Smart Automation Certification Alliance (SACA), an industry-recognized certification.",
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
  newsletterEyebrow: "Stay in the loop",
  newsletterTitle: "News from the GTCIO",
  newsletterBody:
    "Program updates, facility milestones, partnership news, and enrollment dates, sent straight to your inbox. No spam.",
  newsletterButtonLabel: "SIGN UP",
  newsletterConfirmation:
    "Thanks for signing up. We'll be in touch with news from the GTCIO.",
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
    fallbackSrc: "/images/hero-construction-poster.jpg",
    fallbackAlt: "Construction of the GTCIO facility",
    fallbackPosition: "50% 50%",
  });
  const heroVideo = resolveHeroVideo({
    video: typed?.heroVideo,
    poster: typed?.heroVideoPoster,
    fallbackSrc: "/videos/hero-construction.mp4",
    fallbackPoster: "/images/hero-construction-poster.jpg",
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
        <div className="absolute inset-0 bg-brand-black/70" />
        <div className="relative mx-auto max-w-7xl">
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
          <p className="mt-6 max-w-2xl text-lg text-brand-silver">{page.heroDescription}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            {heroButtons.map((button, i) => (
              <CtaButton
                key={button._key ?? i}
                button={button}
                // First button is the primary red one; the rest are outlined.
                variant={i === 0 ? "primary" : "outline"}
                className={
                  i === 0
                    ? undefined
                    : "border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-black"
                }
              />
            ))}
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
          <CtaButton
            button={page.partnerBandButton}
            variant="outline"
            className="shrink-0 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-red"
          />
        </div>
      </section>

      <NewsletterSignup
        eyebrow={page.newsletterEyebrow}
        title={page.newsletterTitle}
        body={page.newsletterBody}
        buttonLabel={page.newsletterButtonLabel}
        confirmation={page.newsletterConfirmation}
      />
    </>
  );
}
