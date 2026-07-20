import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import {
  CREDENTIALS,
  CREDENTIAL_FAMILIES,
  COURSES,
  SACA_INTRO,
} from "@/lib/iot-curriculum";
import { DESTINATIONS } from "@/sanity/lib/links";

export const metadata: Metadata = {
  title: "SACA Certifications | IOT Diploma Program | GTCIO",
  description:
    "Every industry certification built into Ogeechee Tech's Industrial Operations Technology diploma, and what each one qualifies you to do.",
};

/** Which courses lead to a given credential — the inverse of the course table. */
const COURSES_BY_CREDENTIAL = new Map<string, string[]>();
for (const course of COURSES) {
  for (const code of course.credentials) {
    COURSES_BY_CREDENTIAL.set(code, [...(COURSES_BY_CREDENTIAL.get(code) ?? []), course.code]);
  }
}

/**
 * The SACA credential glossary. Data lives in src/lib/iot-curriculum.ts — read
 * that file's header note before editing; it explains why this is code rather
 * than CMS content and records the C-301 title gap in the source brochure.
 *
 * Not in the top navigation (Jake, 2026-07-20).
 */
export default function CertificationsPage() {
  return (
    <>
      <PageHero
        eyebrow="IOT Diploma Program"
        title="SACA certifications"
        description="Every graduate is credentialed through SACA. Here is each certification the diploma builds in, and what it says you can do."
        image="/images/hero-iot-program.jpg"
        imageAlt="Students gathered around automation equipment as an instructor explains it"
        imagePosition="50% 18%"
        cta={
          <div className="flex flex-wrap gap-3">
            <Button href={DESTINATIONS.apply} variant="primary" target="_blank" rel="noopener noreferrer">
              APPLY NOW
            </Button>
            <Button href={DESTINATIONS.curriculum} variant="heroOutline">
              COURSES &amp; CREDIT HOURS
            </Button>
          </div>
        }
      />

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">
            What SACA is, and why it matters
          </h2>
          <div className="mt-6 flex max-w-3xl flex-col gap-4">
            {SACA_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-brand-silver">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: String(CREDENTIALS.length), label: "Certifications in the diploma" },
              { value: "ISO 17024", label: "Standard SACA is built to" },
              { value: "Every graduate", label: "Is credentialed through SACA" },
            ].map((stat) => (
              <div key={stat.label} className="border border-brand-silver/40 p-6">
                <p className="font-display text-2xl text-brand-red">{stat.value}</p>
                <p className="font-heading mt-2 text-sm font-bold tracking-wide text-brand-silver">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          {/* Stated on the IOT Diploma page too — completing a course does not by
              itself award a credential (see PROJECT.md §10). */}
          <p className="mt-6 max-w-3xl text-sm text-brand-silver">
            Certifications are awarded on passing the SACA exam — completing the coursework alone
            does not award one. Ogeechee Tech is an approved SACA testing site.
          </p>
        </div>
      </section>

      {CREDENTIAL_FAMILIES.map((family) => {
        const inFamily = CREDENTIALS.filter((c) => c.family === family);
        if (!inFamily.length) return null;
        return (
          <section key={family} className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-heading text-2xl font-bold text-brand-black">{family}</h2>
              <div className="mt-8 flex flex-col gap-6">
                {inFamily.map((credential) => {
                  const courses = COURSES_BY_CREDENTIAL.get(credential.code) ?? [];
                  return (
                    <article
                      key={credential.code}
                      id={credential.code.toLowerCase()}
                      className="scroll-mt-24 border border-brand-silver/40 p-6"
                    >
                      <p className="font-display text-sm text-brand-gold">{credential.code}</p>
                      {credential.title ? (
                        <h3 className="font-heading mt-1 text-lg font-bold text-brand-black">
                          {credential.title}
                        </h3>
                      ) : (
                        <h3 className="font-heading mt-1 text-lg font-bold text-brand-black">
                          {credential.code}
                        </h3>
                      )}
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
          </section>
        );
      })}

      <section className="bg-brand-black px-6 py-20 text-center text-brand-white sm:px-10">
        <h2 className="font-heading text-3xl font-bold">Graduate credentialed, not just qualified</h2>
        <p className="mx-auto mt-4 max-w-2xl text-brand-silver">
          Classes begin August 2026. Applications go through Ogeechee Technical College.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={DESTINATIONS.apply} variant="primary" target="_blank" rel="noopener noreferrer">
            APPLY NOW
          </Button>
          <Button href={DESTINATIONS.iot} variant="heroOutline">
            BACK TO THE PROGRAM
          </Button>
        </div>
      </section>
    </>
  );
}
