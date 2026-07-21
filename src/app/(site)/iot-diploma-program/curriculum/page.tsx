import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import {
  COURSES,
  PROGRAM_COURSES,
  GENERAL_EDUCATION_COURSES,
  PROGRAM_CREDITS,
  GENERAL_EDUCATION_CREDITS,
  TOTAL_CREDITS,
  CREDENTIALS_BY_CODE,
} from "@/lib/iot-curriculum";
import { DESTINATIONS } from "@/sanity/lib/links";

export const metadata: Metadata = {
  title: "Courses & Credit Hours | IOT Diploma Program | GTCIO",
  description: `Every course in Ogeechee Tech's Industrial Operations Technology diploma — ${PROGRAM_COURSES.length} program courses plus ${GENERAL_EDUCATION_COURSES.length} general education courses, ${TOTAL_CREDITS} credit hours total, and the SACA certification each program course prepares you for.`,
};

/**
 * Course-by-course detail for the IOT diploma. Content comes from
 * src/lib/iot-curriculum.ts — read the note at the top of that file before
 * changing anything here; it explains why this page's data is code and not CMS
 * content, and documents two known defects in the source brochure.
 *
 * Not in the top navigation (Jake, 2026-07-20). Students reach it from the
 * "Every course, in detail" band on /iot-diploma-program.
 */
export default function CurriculumPage() {
  return (
    <>
      <PageHero
        eyebrow="IOT Diploma Program"
        title="Courses & credit hours"
        description={`The full Industrial Operations Technology diploma: ${PROGRAM_COURSES.length} program courses plus ${GENERAL_EDUCATION_COURSES.length} general education courses, ${TOTAL_CREDITS} credit hours total, and an industry certification attached to nearly every program course.`}
        image="/images/hero-iot-program.jpg"
        imageAlt="Students gathered around automation equipment as an instructor explains it"
        imagePosition="50% 18%"
        cta={
          <div className="flex flex-wrap gap-3">
            <Button href={DESTINATIONS.apply} variant="primary" target="_blank" rel="noopener noreferrer">
              APPLY NOW
            </Button>
            <Button href={DESTINATIONS.certifications} variant="primary">
              CREDENTIALS
            </Button>
          </div>
        }
      />

      {/* Light band directly under the hero — a dark one here makes the hero
          photo read as fading to black early (PROJECT.md §10). */}
      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">
            The program at a glance
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: String(PROGRAM_COURSES.length + GENERAL_EDUCATION_COURSES.length), label: "Courses" },
              { value: String(TOTAL_CREDITS), label: "Credit hours" },
              { value: "IS32", label: "Program code" },
            ].map((stat) => (
              <div key={stat.label} className="border border-brand-silver/40 p-6">
                <p className="font-display text-4xl text-brand-red">{stat.value}</p>
                <p className="font-heading mt-2 text-sm font-bold tracking-wide text-brand-silver">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Wide content scrolls inside its own container rather than pushing
              the page sideways. */}
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <caption className="sr-only">
                Industrial Operations Technology diploma program courses, credit hours, and SACA
                certifications
              </caption>
              <thead>
                <tr className="border-b-2 border-brand-black">
                  <th scope="col" className="font-heading py-3 pr-4 text-sm font-bold tracking-wide text-brand-black">
                    Course
                  </th>
                  <th scope="col" className="font-heading py-3 pr-4 text-sm font-bold tracking-wide text-brand-black">
                    Title
                  </th>
                  <th scope="col" className="font-heading py-3 pr-4 text-right text-sm font-bold tracking-wide text-brand-black">
                    Credits
                  </th>
                  <th scope="col" className="font-heading py-3 text-sm font-bold tracking-wide text-brand-black">
                    Certifications
                  </th>
                </tr>
              </thead>
              <tbody>
                {PROGRAM_COURSES.map((course) => (
                  <tr key={course.code} className="border-b border-brand-silver/30 align-top">
                    <td className="py-3 pr-4 whitespace-nowrap font-bold text-brand-black">
                      <a href={`#${course.code.replace(/\s+/g, "-").toLowerCase()}`} className="hover:text-brand-red">
                        {course.code}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-brand-black">{course.title}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-brand-black">{course.credits}</td>
                    <td className="py-3 text-sm text-brand-silver">
                      {course.credentials.length ? course.credentials.join(", ") : "—"}
                    </td>
                  </tr>
                ))}
                <tr className="border-b-2 border-brand-black">
                  <td className="font-heading py-3 pr-4 font-bold text-brand-black" colSpan={2}>
                    Program course totals
                  </td>
                  <td className="font-heading py-3 pr-4 text-right font-bold tabular-nums text-brand-black">
                    {PROGRAM_CREDITS}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-3xl text-sm text-brand-silver">
            Certification codes beginning with <span className="font-bold">C-</span> are issued by
            the Smart Automation Certification Alliance (SACA).{" "}
            <Link href={DESTINATIONS.certifications} className="font-bold text-brand-red underline hover:text-brand-black">
              See what each one covers
            </Link>
            .
          </p>

          <h3 className="font-heading mt-14 text-xl font-bold text-brand-black">
            Required general education courses
          </h3>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-left">
              <caption className="sr-only">
                Required general education courses for the Industrial Operations Technology diploma
              </caption>
              <thead>
                <tr className="border-b-2 border-brand-black">
                  <th scope="col" className="font-heading py-3 pr-4 text-sm font-bold tracking-wide text-brand-black">
                    Course
                  </th>
                  <th scope="col" className="font-heading py-3 pr-4 text-sm font-bold tracking-wide text-brand-black">
                    Title
                  </th>
                  <th scope="col" className="font-heading py-3 text-right text-sm font-bold tracking-wide text-brand-black">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody>
                {GENERAL_EDUCATION_COURSES.map((course) => (
                  <tr key={course.code} className="border-b border-brand-silver/30 align-top">
                    <td className="py-3 pr-4 whitespace-nowrap font-bold text-brand-black">
                      <a href={`#${course.code.replace(/\s+/g, "-").toLowerCase()}`} className="hover:text-brand-red">
                        {course.code}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-brand-black">{course.title}</td>
                    <td className="py-3 text-right tabular-nums text-brand-black">{course.credits}</td>
                  </tr>
                ))}
                <tr className="border-b-2 border-brand-black">
                  <td className="font-heading py-3 pr-4 font-bold text-brand-black" colSpan={2}>
                    General education totals
                  </td>
                  <td className="font-heading py-3 text-right font-bold tabular-nums text-brand-black">
                    {GENERAL_EDUCATION_CREDITS}
                  </td>
                </tr>
                <tr>
                  <td className="font-heading py-3 pr-4 font-bold text-brand-black" colSpan={2}>
                    Total credits
                  </td>
                  <td className="font-heading py-3 text-right font-bold tabular-nums text-brand-black">
                    {TOTAL_CREDITS}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Course by course</h2>
          <div className="mt-10 flex flex-col gap-12">
            {COURSES.map((course) => (
              <article
                key={course.code}
                id={course.code.replace(/\s+/g, "-").toLowerCase()}
                className="scroll-mt-24 border-l-4 border-brand-red pl-6"
              >
                <p className="font-display text-sm text-brand-gold">
                  {course.code} · {course.credits} credit hours
                </p>
                <h3 className="font-heading mt-1 text-xl font-bold text-brand-black">
                  {course.title}
                </h3>

                {course.summary && <p className="mt-3 max-w-3xl text-brand-silver">{course.summary}</p>}

                {course.objectives && (
                  <>
                    <p className="font-heading mt-5 text-sm font-bold tracking-wide text-brand-black">
                      What you&apos;ll learn to do
                    </p>
                    <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                      {course.objectives.map((objective) => (
                        <li key={objective} className="flex gap-2 text-sm text-brand-silver">
                          <span aria-hidden className="text-brand-red">&#8250;</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {course.credentials.length > 0 && (
                  <>
                    <p className="font-heading mt-6 text-sm font-bold tracking-wide text-brand-black">
                      Certifications earned
                    </p>
                    <div className="mt-3 flex flex-col gap-3">
                      {course.credentials.map((code) => {
                        const credential = CREDENTIALS_BY_CODE.get(code);
                        // OSHA 10 is a mapping the brochure lists, not a SACA
                        // credential, so it has no glossary entry to link to.
                        if (!credential) {
                          return (
                            <p key={code} className="text-sm text-brand-silver">
                              <span className="font-bold text-brand-black">{code}</span>
                            </p>
                          );
                        }
                        return (
                          <Link
                            key={code}
                            href={`${DESTINATIONS.certifications}#${code.toLowerCase()}`}
                            className="group border border-brand-silver/40 p-4 transition-colors hover:border-brand-red"
                          >
                            <p className="font-heading font-bold text-brand-black group-hover:text-brand-red">
                              {code}
                              {credential.title && (
                                <span className="font-normal text-brand-silver"> — {credential.title}</span>
                              )}
                            </p>
                            <p className="mt-1 text-sm text-brand-silver">{credential.description}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-black px-6 py-20 text-center text-brand-white sm:px-10">
        <h2 className="font-heading text-3xl font-bold">Ready to start?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-brand-silver">
          Classes begin August 2026. Applications go through Ogeechee Technical College.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={DESTINATIONS.apply} variant="primary" target="_blank" rel="noopener noreferrer">
            APPLY NOW
          </Button>
          <Button href={DESTINATIONS.iot} variant="primary">
            BACK TO THE PROGRAM
          </Button>
        </div>
      </section>
    </>
  );
}
