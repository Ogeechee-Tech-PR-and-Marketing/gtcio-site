import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaButton from "@/components/CtaButton";
import { sanityFetch } from "@/sanity/lib/live";
import { IOT_DIPLOMA_PROGRAM_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, type SanityImage } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "IOT Diploma Program | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "IOT Diploma Program: Enrolling now for August 2026",
  heroTitle: "What is Industrial Operations Technology?",
  heroDescription:
    "It's the training behind keeping factories, utilities, and logistics centers running. Make things work. Keep them working.",
  whatIsTitle: "What is Industrial Operations Technology?",
  whatIsBody:
    "These same skills apply well outside a factory. Facilities management (office buildings, apartment complexes, schools, hospitals) needs people who can keep equipment running, and so do utilities, warehouses, and distribution centers.",
  nonTraditionalHeading: "This is a non-traditional program",
  nonTraditionalBody:
    "OTC classifies Industrial Operations Technology as a non-traditional program — one where a single gender makes up less than 25% of the field's workforce, which today mostly means women. OTC supports students pursuing careers in under-represented fields; here are a few places to start:",
  nonTraditionalResources: [
    { label: "Women in Manufacturing", url: "https://www.womeninmanufacturing.org/about/who-we-are" },
    { label: "Women's Manufacturing Network", url: "https://www.wmnorg.com" },
    { label: "WIM Georgia", url: "https://www.womeninmanufacturing.org/georgia" },
  ],
  viewProgramButton: { label: "VIEW IOT PROGRAM", destination: "iotProgramFlipbook" as const },
  downloadProgramButton: { label: "DOWNLOAD IOT PROGRAM", destination: "iotProgramPdf" as const },
  curriculumTitle: "Curriculum & credentials",
  curriculumStages: [
    { stage: "Foundation", detail: "Mechanical, electrical, hydraulic, and pneumatic systems." },
    { stage: "Advanced", detail: "Robotics, programmable logic controllers (PLCs), automation controls, smart sensors, industrial wiring, and motor controls." },
    { stage: "Credential", detail: "Every graduate earns the diploma and is credentialed through the Smart Automation Certification Alliance (SACA) — an industry-recognized certification built into the program, not an optional add-on." },
  ],
  courseDetailHeading: "Every course, in detail",
  courseDetailBody:
    "The diploma is 12 courses and 45 credit hours. See exactly what each course covers and which industry certification it prepares you for.",
  curriculumButton: { label: "COURSES & CREDIT HOURS", destination: "curriculum" as const },
  certificationsButton: { label: "SACA CERTIFICATIONS", destination: "certifications" as const },
  moreWaysTitle: "More than one way in",
  moreWaysBody:
    "The diploma isn't the only option. OTC also breaks the same curriculum into three standalone certificates, so you can start smaller, or focus on just the part of the job you're after.",
  programOptions: [
    { name: "Industrial Operations Technology Diploma", code: "IS32", detail: "The full program." },
    { name: "Certificate: Electrical/Mechanical", detail: "Focused on the electrical and mechanical side of the curriculum." },
    { name: "Certificate: PLC", detail: "Focused on programmable logic controllers." },
    { name: "Certificate: Robotics", detail: "Focused on robotics." },
  ],
  careersTitle: "Careers this prepares you for",
  careers: ["Industrial Maintenance Technician", "Operations Technician", "Automation & Controls Specialist"],
  careersNote: "Stick with it and there's room to move up, into production supervisor or operations manager roles.",
  jobDutiesTitle: "What the job looks like",
  jobDuties: [
    { label: "Preventive maintenance", detail: "Scheduled inspections, lubrication, and adjustments make up a huge share of the actual job, not just emergency repairs." },
    { label: "Fixing what breaks", detail: "Diagnosing a problem by watching a machine run, then replacing the bad part: motors, conveyors, transmissions, pumps, hydraulic and pneumatic systems." },
    { label: "Electrical and controls work", detail: "AC/DC circuit troubleshooting, industrial wiring, motor controls, and programming/troubleshooting PLCs, the \"brains\" behind automated equipment." },
    { label: "Reading blueprints and schematics", detail: "Understanding how a machine goes together or how a system is wired." },
    { label: "Precision measurement and adjustment", detail: "Checking part dimensions with calipers and gauges, calibrating equipment, running metalworking machines to make replacement fittings." },
  ],
  payTitle: "Jobs & pay after graduation",
  payRanges: [
    { value: "Mid-$30ks to low-$40ks", label: "Entry-Level / Operator" },
    { value: "$55k – $70k", label: "Working Technician (a few years in)" },
    { value: "$80k – $100k+", label: "Specialists & Supervisors" },
  ],
  // Student-facing wording for figures GTCIO hasn't confirmed yet. Deliberately
  // not the word "Placeholder" — that's an internal note, and it was rendering
  // to prospective students. The Studio field descriptions still flag both as
  // needing replacement, and PROJECT.md §8 tracks them.
  timeToComplete: "Still being confirmed ahead of the August 2026 launch.",
  approximateCost: "Still being confirmed ahead of the August 2026 launch.",
  studentFaqTitle: "Student FAQ",
  // Ordered the way a prospective student actually asks: when → am I eligible →
  // how do I apply → where/when → how long → how much → what do I get → what
  // will I earn.
  faqs: [
    { question: "When does the program start?", answer: "The Industrial Operations Technology diploma program launches in August 2026, and it's open for enrollment now." },
    { question: "Do I need any experience to start?", answer: "No. The program is built for people coming into the field, whatever their background. You start with the fundamentals — mechanical, electrical, hydraulic, and pneumatic systems — and move on to robotics, PLCs, and automation controls from there." },
    { question: "How do I apply?", answer: "Applications go through Ogeechee Technical College — any of the Apply Now buttons on this page take you straight there. Admissions will walk you through what's needed. If you'd rather talk to a person first, Jan Moore is the program contact: jmoore@ogeecheetech.edu, 912-688-6026." },
    { question: "Where will classes be held?", answer: "Classes begin in the Industrial Technology Building on Ogeechee Tech's main campus, the college's existing robotics facility, and move into GTCIO's new building once it opens. The ribbon cutting is scheduled for October 15, 2026." },
    { question: "Is this an online program?", answer: "No. It's in person, in day classes. This is hands-on work on real industrial equipment, so you need to be in the shop. Ogeechee Tech's admissions team has the current class times." },
    { question: "How long does it take to finish?", answer: "The final program length is still being confirmed ahead of the August 2026 launch. Ogeechee Tech's admissions team can tell you where it lands." },
    { question: "How much does the program cost?", answer: "The final tuition figure is still being confirmed ahead of the August 2026 launch. Ogeechee Tech's admissions team can give you the current cost." },
    { question: "What credential do I earn?", answer: "Every student who completes the diploma is credentialed through SACA (the Smart Automation Certification Alliance). The SACA credential is built into the program for all graduates, and it's recognized industry-wide, not just in Georgia." },
    { question: "Should I do the diploma or one of the certificates?", answer: "The diploma is the full program, and every diploma graduate is credentialed through SACA. The three certificates — Electrical/Mechanical, PLC, and Robotics — break the same curriculum into smaller pieces, so you can start smaller or focus on just the part of the job you're after. All four options are listed under \"More than one way in\" above." },
    { question: "How much can I expect to earn after graduating?", answer: "Most graduates start in entry-level or operator roles and grow from there. The pay ranges are listed above: mid-$30ks to low-$40ks starting out, $55k–$70k for a working technician a few years in, and $80k–$100k+ for specialists and supervisors." },
  ],
  applyHeading: "Sign up today, and we'll see you here!",
  applyButton: { label: "APPLY NOW", destination: "apply" as const },
};

export default async function IotDiplomaProgramPage() {
  const { data } = await sanityFetch({ query: IOT_DIPLOMA_PROGRAM_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroImage?: SanityImage;
    heroImageAlt?: string;
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const nonTraditionalResources = typed?.nonTraditionalResources?.length
    ? typed.nonTraditionalResources
    : DEFAULTS.nonTraditionalResources;
  const curriculumStages = typed?.curriculumStages?.length ? typed.curriculumStages : DEFAULTS.curriculumStages;
  const programOptions = typed?.programOptions?.length ? typed.programOptions : DEFAULTS.programOptions;
  const careers = typed?.careers?.length ? typed.careers : DEFAULTS.careers;
  const jobDuties = typed?.jobDuties?.length ? typed.jobDuties : DEFAULTS.jobDuties;
  const payRanges = typed?.payRanges?.length ? typed.payRanges : DEFAULTS.payRanges;
  const faqs = typed?.faqs?.length ? typed.faqs : DEFAULTS.faqs;

  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-iot-program.jpg",
    fallbackAlt:
      "Students gathered around automation equipment as an instructor explains it",
    // Measured, not eyeballed. The hero is a wide band — at 1920 only ~27% of the
    // photo's height is visible — and the seven faces span roughly 12%–33% of it.
    // Centring on the faces (~22%) clips the front student's hairline; 12% clips
    // the student in glasses. 18% is the one value that keeps every face in frame
    // from 1280 through 1920, and mobile crops almost nothing (the box is ~1.47:1
    // against the photo's 1.5:1). Re-check this if the hero copy length changes,
    // since that changes the band height.
    fallbackPosition: "50% 18%",
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
          // Three buttons: apply, read the brochure, save the brochure. They
          // wrap rather than shrink — at 375px each takes its own row, which
          // keeps the long "DOWNLOAD IOT PROGRAM" label on one line.
          <div className="flex flex-wrap gap-3">
            <CtaButton button={page.applyButton} variant="primary" />
            <CtaButton button={page.viewProgramButton} variant="heroOutline" />
            <CtaButton button={page.downloadProgramButton} variant="heroOutline" />
          </div>
        }
      />

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.whatIsTitle}</h2>
          <div className="mt-6 flex aspect-video items-center justify-center border border-dashed border-brand-silver/60 text-center">
            <p className="font-heading text-sm font-bold tracking-wide text-brand-silver">
              VIDEO PLACEHOLDER
              <br />
              &quot;What&apos;s Industrial Operations Technology?&quot; (~3 min)
            </p>
          </div>
          <p className="mt-6 max-w-3xl text-brand-silver">{page.whatIsBody}</p>

          {page.nonTraditionalHeading && (
            <div className="mt-8 max-w-3xl border border-brand-silver/40 p-6">
              <p className="font-heading font-bold text-brand-black">{page.nonTraditionalHeading}</p>
              {page.nonTraditionalBody && (
                <p className="mt-2 text-sm text-brand-silver">{page.nonTraditionalBody}</p>
              )}
              {nonTraditionalResources.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {nonTraditionalResources.map((resource: { label: string; url: string }, i: number) => (
                    <li key={i}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-brand-red underline hover:text-brand-black"
                      >
                        {resource.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.curriculumTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {curriculumStages.map((stage: { stage: string; detail: string }, i: number) => (
              <div key={i} className="border border-brand-silver/40 p-6">
                <p className="font-display text-sm text-brand-gold">Stage {i + 1}</p>
                <h3 className="font-heading mt-2 text-lg font-bold text-brand-black">{stage.stage}</h3>
                <p className="mt-2 text-sm text-brand-silver">{stage.detail}</p>
              </div>
            ))}
          </div>

          {/* Gateway to the two detail pages. Kept out of the top nav (Jake,
              2026-07-20) — a prospective student reaches them from here. */}
          <div className="mt-10 border-l-4 border-brand-teal bg-brand-black/[0.03] p-6 sm:p-8">
            <h3 className="font-heading text-xl font-bold text-brand-black">
              {page.courseDetailHeading}
            </h3>
            <p className="mt-3 max-w-2xl text-brand-silver">{page.courseDetailBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaButton button={page.curriculumButton} variant="primary" />
              <CtaButton button={page.certificationsButton} variant="outline" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.moreWaysTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.moreWaysBody}</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {programOptions.map((option: { name: string; code?: string; detail: string }, i: number) => (
              <div key={i} className="border border-brand-silver/40 p-5">
                <p className="font-bold text-brand-black">
                  {option.name}
                  {option.code && <span className="text-brand-silver"> ({option.code})</span>}
                </p>
                <p className="mt-1 text-sm text-brand-silver">{option.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <CtaButton button={page.applyButton} variant="primary" />
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.careersTitle}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {careers.map((career: string, i: number) => (
              <span
                key={i}
                className="font-heading border-2 border-brand-red px-4 py-2 text-sm font-bold tracking-wide text-brand-red"
              >
                {career}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-brand-silver">{page.careersNote}</p>
          <h3 className="font-heading mt-10 text-xl font-bold text-brand-black">{page.jobDutiesTitle}</h3>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {jobDuties.map((duty: { label: string; detail: string }, i: number) => (
              <li key={i} className="border-l-4 border-brand-red pl-5">
                <p className="font-bold text-brand-black">{duty.label}</p>
                <p className="mt-1 text-sm text-brand-silver">{duty.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.payTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {payRanges.map((tier: { value: string; label: string }, i: number) => (
              <div key={i} className="border border-brand-silver/40 p-6">
                <p className="font-heading text-2xl font-bold text-brand-red">{tier.value}</p>
                <p className="mt-2 text-sm text-brand-silver">{tier.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-brand-silver/40 p-6">
              <p className="font-heading font-bold text-brand-black">Time to complete</p>
              <p className="mt-1 text-brand-silver">{page.timeToComplete}</p>
            </div>
            <div className="border border-brand-silver/40 p-6">
              <p className="font-heading font-bold text-brand-black">Approximate cost</p>
              <p className="mt-1 text-brand-silver">{page.approximateCost}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.studentFaqTitle}</h2>
          <div className="mt-6 flex flex-col gap-6">
            {faqs.map((item: { question: string; answer: string }, i: number) => (
              <div key={i} className="border-l-4 border-brand-black pl-5">
                <p className="font-heading font-bold text-brand-black">{item.question}</p>
                <p className="mt-1 text-brand-silver">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 bg-brand-black px-6 py-20 text-center text-brand-white sm:px-10">
        <h2 className="font-heading text-3xl font-bold">{page.applyHeading}</h2>
        <div className="mt-8">
          <CtaButton button={page.applyButton} variant="primary" />
        </div>
      </section>
    </>
  );
}
