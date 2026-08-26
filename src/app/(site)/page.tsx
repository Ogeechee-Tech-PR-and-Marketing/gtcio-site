import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import HeroCard from "@/components/HeroCard";
import type { CtaButton as CtaButtonData } from "@/lib/links";

// DEFAULTS is this page's content — code-only, no CMS (PROJECT.md §4).
const DEFAULTS = {
  heroEyebrow: "",
  heroTitle: "Building a workforce ready for industry transformation.",
  heroDescription:
    "The GTCIO trains Georgia's workforce for careers in Industrial Operations Technology. These individuals are essential in keeping manufacturing facilities, utilities, logistics centers, and related industries up and running.",
  sectionTitle: "Training the next generation",
  sectionBody:
    "These skills carry well past the manufacturing floor, into facilities management, utilities, and logistics – anywhere equipment has to keep running. Training includes the fundamentals: mechanical, electrical, hydraulic, and pneumatic systems. From there it's robotics, PLCs, and smart automation. Certification and credentialing are done through the Smart Automation Certification Alliance (SACA), the leader in industry-recognized credentialing.",
  studentsCard: {
    title: "Students",
    description: "Earn a diploma built around hands-on work with real industrial equipment, not just theory.",
  },
  employersCard: {
    title: "Employers",
    description: "Need to hire skilled graduates or upskill the crew that you have? GTCIO can help with both.",
  },
  partnersCard: {
    title: "Partners",
    description: "Internships, apprenticeships, hiring, sponsorships, tours – there's more than one way in.",
  },
  heroButtons: [
    { label: "IOT TRAINING PROGRAMS", destination: "training" },
    { label: "IOT DIPLOMA PROGRAM", destination: "iot" },
    { label: "BECOME A PARTNER", destination: "becomePartner" },
  ] as CtaButtonData[],
  partnerBandTitle: "Become a GTCIO Partner",
  partnerBandBody:
    "GTCIO is built alongside the employers who hire our graduates. Hire our technicians, provide internships and apprenticeships; there is more than one way to get involved. We are actively growing our partner network – come be a part!",
  partnerBandButton: { label: "BECOME A PARTNER", destination: "becomePartner" } as CtaButtonData,
};

export default function Home() {
  const page = DEFAULTS;
  const heroButtons = DEFAULTS.heroButtons;
  const heroTitle = DEFAULTS.heroTitle;

  const pathways = [
    { ...DEFAULTS.employersCard, href: "/training", cta: "See Training for Employers" },
    { ...DEFAULTS.studentsCard, href: "/iot-diploma-program", cta: "Explore the IOT Diploma Program" },
    { ...DEFAULTS.partnersCard, href: "/partners", cta: "Become a Partner" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-brand-black px-6 py-24 text-brand-white sm:px-10 sm:py-32">
        {/* No CMS hero photo override anymore — the banner always plays the
            looping construction video. */}
        <video
          src="/videos/hero-construction-6.mp4"
          poster="/images/hero-construction-poster-5.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative mx-auto max-w-7xl">
          {/*
            Kept in sync with PageHero.tsx's hero scrim: a blurred rectangle
            behind the text, opacity .65, isolate + -z-10 so it sandwiches
            between the video and the text (see PageHero.tsx for why
            `isolate` is load-bearing), blur-xl edge, brand-white description
            for contrast headroom.

            TWO separate cards, not one — this headline is deliberately sized
            to almost fill the container on one line (see the measured-font-
            size comment below), far wider than the description and buttons;
            splitting eyebrow+title from description+buttons lets each card
            fit its own content.

            Each card is a <HeroCard>, not a plain `inline-block` div — a
            shrink-to-fit box's auto width resolves to the full *available*
            width the moment its content wraps to a second line, not to the
            width the wrapped lines actually render at (same with
            `display:table`; it's how CSS auto-width works). On mid-width
            viewports the card would visibly overshoot a wrapped headline.
            HeroCard measures the rendered text and sets an explicit width.
          */}
          <HeroCard>
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
          </HeroCard>
          <HeroCard className="mt-6">
            <p className="max-w-2xl text-lg text-brand-white">{page.heroDescription}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              {heroButtons.map((button, i) => (
                <CtaButton key={button._key ?? i} button={button} variant="primary" />
              ))}
            </div>
          </HeroCard>
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
