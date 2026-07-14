import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
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
  curriculumTitle: "Curriculum & credentials",
  curriculumStages: [
    { stage: "Foundation", detail: "Mechanical, electrical, hydraulic, and pneumatic systems." },
    { stage: "Advanced", detail: "Robotics, programmable logic controllers (PLCs), automation controls, smart sensors, industrial wiring, and motor controls." },
    { stage: "Credential", detail: "Graduate with a diploma, plus the option to add a Smart Automation Certification Alliance (SACA) credential on top of it." },
  ],
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
  timeToComplete: "Placeholder, final program length pending confirmation.",
  approximateCost: "Placeholder, final tuition figure pending confirmation.",
  studentFaqTitle: "Student FAQ",
  faqs: [
    { question: "When does the program start?", answer: "The Industrial Operations Technology diploma program launches in August 2026." },
    { question: "How much can I expect to earn after graduating?", answer: "See the pay ranges below. Most graduates start in entry-level/operator roles and grow from there." },
    { question: "What credential do I earn?", answer: "A college diploma, plus the option to add a SACA (Smart Automation Certification Alliance) credential. It's recognized industry-wide, not just in Georgia." },
    { question: "How much does the program cost?", answer: "Placeholder, final tuition figure pending confirmation." },
    { question: "How long does it take to finish?", answer: "Placeholder, final program length pending confirmation." },
    { question: "Is this an online program?", answer: "No. It's in-person, day classes. This is hands-on work, so you need to be in the shop." },
  ],
  applyHeading: "Sign up today, and we'll see you here!",
};

export default async function IotDiplomaProgramPage() {
  const { data } = await sanityFetch({ query: IOT_DIPLOMA_PROGRAM_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroImage?: SanityImage;
    heroImageAlt?: string;
  }) | null;
  const page = { ...DEFAULTS, ...typed };
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
    fallbackAlt: "Engineer inspecting an industrial engine",
    fallbackPosition: "85% 32%",
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
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.curriculumTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {curriculumStages.map((stage: { stage: string; detail: string }, i: number) => (
              <div key={stage.stage} className="border border-brand-silver/40 p-6">
                <p className="font-display text-sm text-brand-gold">Stage {i + 1}</p>
                <h3 className="font-heading mt-2 text-lg font-bold text-brand-black">{stage.stage}</h3>
                <p className="mt-2 text-sm text-brand-silver">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.moreWaysTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.moreWaysBody}</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {programOptions.map((option: { name: string; code?: string; detail: string }) => (
              <div key={option.name} className="border border-brand-silver/40 p-5">
                <p className="font-bold text-brand-black">
                  {option.name}
                  {option.code && <span className="text-brand-silver"> ({option.code})</span>}
                </p>
                <p className="mt-1 text-sm text-brand-silver">{option.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.careersTitle}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {careers.map((career: string) => (
              <span
                key={career}
                className="font-heading border-2 border-brand-red px-4 py-2 text-sm font-bold tracking-wide text-brand-red"
              >
                {career}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-brand-silver">{page.careersNote}</p>
          <h3 className="font-heading mt-10 text-xl font-bold text-brand-black">{page.jobDutiesTitle}</h3>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {jobDuties.map((duty: { label: string; detail: string }) => (
              <li key={duty.label} className="border-l-4 border-brand-red pl-5">
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
            {payRanges.map((tier: { value: string; label: string }) => (
              <div key={tier.label} className="border border-brand-silver/40 p-6">
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
            {faqs.map((item: { question: string; answer: string }) => (
              <div key={item.question} className="border-l-4 border-brand-black pl-5">
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
          <Button href="https://www.ogeecheetech.edu/IOT" variant="primary">APPLY NOW</Button>
        </div>
      </section>
    </>
  );
}
