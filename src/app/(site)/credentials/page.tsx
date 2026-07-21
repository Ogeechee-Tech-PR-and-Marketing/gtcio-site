import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import CtaButton from "@/components/CtaButton";
import { sanityFetch } from "@/sanity/lib/live";
import { CREDENTIALS_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, type SanityImage } from "@/sanity/lib/image";
import {
  CREDENTIALS,
  CREDENTIAL_FAMILIES,
  PROGRAM_COURSES,
  SACA_INTRO,
} from "@/lib/iot-curriculum";
import { SACA_TIERS, OTHER_CREDENTIALS, AFFILIATIONS } from "@/lib/credentials";
import { DESTINATIONS } from "@/sanity/lib/links";

export const metadata: Metadata = {
  title: "Credentials | GTCIO",
  description:
    "Every industry credential built into GTCIO's training — SACA certifications, FANUC, and OSHA 10 — and the accreditations Ogeechee Tech holds that make them count.",
};

/** Which courses lead to a given credential — the inverse of the course table. */
const COURSES_BY_CREDENTIAL = new Map<string, string[]>();
for (const course of PROGRAM_COURSES) {
  for (const code of course.credentials) {
    COURSES_BY_CREDENTIAL.set(code, [...(COURSES_BY_CREDENTIAL.get(code) ?? []), course.code]);
  }
}

const DEFAULTS = {
  heroEyebrow: "Credentials",
  heroTitle: "Proof you can do the work",
  heroDescription:
    "A diploma says you finished. A credential says an industry body tested you and agreed. Everything GTCIO teaches is built around earning the second one.",
  earnTitle: "What you leave with",
  earnBody:
    "Every graduate of the Industrial Operations Technology diploma is credentialed through SACA, and the program builds in two more credentials employers ask for by name.",
  affiliationsTitle: "Why a credential from here counts",
  affiliationsBody:
    "Ogeechee Tech is accredited by the equipment makers and certification bodies whose credentials it awards — so students test on the same platforms the industry runs, at a site those organisations authorised.",
  sacaTitle: "What SACA is, and why it matters",
  ladderTitle: "How SACA credentials stack",
  ladderBody:
    "SACA is a ladder, not a single exam. Credentials are modular, so each one you pass is banked and counts toward the next tier.",
  glossaryTitle: "Every credential in the diploma",
  glossaryBody:
    "Twenty-two SACA certifications are built into the program. Each is a separate hands-on and written assessment.",
  ctaHeading: "Graduate credentialed, not just qualified",
  ctaBody: "Classes begin August 2026. Applications go through Ogeechee Technical College.",
  applyButton: { label: "APPLY NOW", destination: "apply" as const },
};

type Affiliation = { _key?: string; title: string; detail: string };

/**
 * The site's single home for credential information, combining what was on
 * /iot-diploma-program/certifications (the SACA glossary) with the
 * accreditations that had only appeared on the IOT Training Programs page.
 * Added to the top nav between IOT Diploma Program and Facility (Jake,
 * 2026-07-20). The old certifications URL 308-redirects here — see
 * next.config.ts.
 *
 * Reference data comes from src/lib/credentials.ts and src/lib/iot-curriculum.ts;
 * read those headers before editing. Framing copy is CMS-editable
 * (credentialsPage singleton) and seeded.
 */
export default async function CredentialsPage() {
  const { data } = await sanityFetch({ query: CREDENTIALS_PAGE_QUERY });
  const typed = data as
    | (Partial<typeof DEFAULTS> & {
        heroImage?: SanityImage;
        heroImageAlt?: string;
        affiliations?: Affiliation[];
      })
    | null;
  const page = { ...DEFAULTS, ...typed };
  // Affiliations are authored on the Training page's document — one field, two
  // pages, so an editor never updates the same accreditation twice.
  const affiliations: Affiliation[] = typed?.affiliations?.length
    ? typed.affiliations
    : AFFILIATIONS;

  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-training.jpg",
    fallbackAlt: "Technician performing PLC maintenance on an electrical control panel",
    fallbackPosition: "61% 31%",
  });

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        image={hero.src}
        imageAlt={hero.alt}
        imagePosition={hero.position}
        cta={
          <div className="flex flex-wrap gap-3">
            <CtaButton button={page.applyButton} variant="primary" />
            <Button href={DESTINATIONS.curriculum} variant="primary">
              COURSES &amp; CREDIT HOURS
            </Button>
          </div>
        }
      />

      {/* Light band under the hero — a dark one makes the hero photo read as
          fading to black early (PROJECT.md §10). */}
      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.earnTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.earnBody}</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="border-l-4 border-brand-red bg-brand-black/[0.03] p-6">
              <p className="font-display text-3xl text-brand-red">{CREDENTIALS.length}</p>
              <p className="font-heading mt-2 font-bold text-brand-black">SACA certifications</p>
              <p className="mt-2 text-sm text-brand-silver">
                Built into the diploma across all {PROGRAM_COURSES.length} program courses.
              </p>
            </div>
            {OTHER_CREDENTIALS.map((credential) => (
              <div key={credential.name} className="border-l-4 border-brand-teal bg-brand-black/[0.03] p-6">
                <p className="font-display text-sm text-brand-gold">{credential.issuer}</p>
                <p className="font-heading mt-2 font-bold text-brand-black">{credential.name}</p>
                <p className="mt-2 text-sm text-brand-silver">{credential.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">
            {page.affiliationsTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.affiliationsBody}</p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {affiliations.map((affiliation, i) => (
              <div key={affiliation._key ?? i} className="border-l-4 border-brand-red pl-5">
                <h3 className="font-heading text-lg font-bold text-brand-black">
                  {affiliation.title}
                </h3>
                <p className="mt-1 text-sm text-brand-silver">{affiliation.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm text-brand-silver">
            Employers can also put current staff through these credentials —{" "}
            <Link href={DESTINATIONS.training} className="font-bold text-brand-red underline hover:text-brand-black">
              see the training we run for industry
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.sacaTitle}</h2>
          <div className="mt-6 flex max-w-3xl flex-col gap-4">
            {SACA_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-brand-silver">
                {paragraph}
              </p>
            ))}
          </div>
          {/* Stated on the IOT Diploma page too — completing a course does not
              by itself award a credential (PROJECT.md §10). */}
          <p className="mt-6 max-w-3xl border-l-4 border-brand-gold pl-5 text-sm text-brand-silver">
            Credentials are awarded on passing the SACA exam — completing the coursework alone does
            not award one. Ogeechee Tech is an approved SACA testing site at Silver and Gold level,
            so students test where they train.
          </p>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.ladderTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.ladderBody}</p>
          <ol className="mt-8 flex flex-col gap-4">
            {SACA_TIERS.map((tier, i) => (
              <li
                key={tier.name}
                className={`border p-6 ${
                  tier.inProgram ? "border-brand-red" : "border-dashed border-brand-silver/60"
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="font-display text-sm text-brand-gold">Tier {i + 1}</p>
                  <h3 className="font-heading text-lg font-bold text-brand-black">{tier.name}</h3>
                  <p className="text-sm text-brand-silver">{tier.codes}</p>
                  {tier.inProgram && (
                    <span className="font-heading border border-brand-red px-2 py-0.5 text-xs font-bold tracking-wide text-brand-red">
                      IN THIS DIPLOMA
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-brand-silver">{tier.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.glossaryTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.glossaryBody}</p>
          {CREDENTIAL_FAMILIES.map((family) => {
            const inFamily = CREDENTIALS.filter((c) => c.family === family);
            if (!inFamily.length) return null;
            return (
              <div key={family} className="mt-10">
                <h3 className="font-heading border-b-2 border-brand-black pb-2 text-lg font-bold text-brand-black">
                  {family}
                </h3>
                <div className="mt-6 flex flex-col gap-6">
                  {inFamily.map((credential) => {
                    const courses = COURSES_BY_CREDENTIAL.get(credential.code) ?? [];
                    return (
                      <article
                        key={credential.code}
                        id={credential.code.toLowerCase()}
                        className="scroll-mt-24 border border-brand-silver/40 p-6"
                      >
                        <p className="font-display text-sm text-brand-gold">{credential.code}</p>
                        <h4 className="font-heading mt-1 text-lg font-bold text-brand-black">
                          {credential.title ?? credential.code}
                        </h4>
                        <p className="mt-3 text-brand-silver">{credential.description}</p>
                        {courses.length > 0 && (
                          <p className="mt-4 text-sm text-brand-silver">
                            <span className="font-heading font-bold text-brand-black">
                              Earned in:{" "}
                            </span>
                            {courses.map((code, i) => (
                              <span key={code}>
                                {i > 0 && ", "}
                                <Link
                                  href={`${DESTINATIONS.curriculum}#${code.replace(/\s+/g, "-").toLowerCase()}`}
                                  className="font-bold text-brand-red underline hover:text-brand-black"
                                >
                                  {code}
                                </Link>
                              </span>
                            ))}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-brand-black px-6 py-20 text-center text-brand-white sm:px-10">
        <h2 className="font-heading text-3xl font-bold">{page.ctaHeading}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-brand-silver">{page.ctaBody}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CtaButton button={page.applyButton} variant="primary" />
          <Button href={DESTINATIONS.iot} variant="primary">
            THE DIPLOMA PROGRAM
          </Button>
        </div>
      </section>
    </>
  );
}
