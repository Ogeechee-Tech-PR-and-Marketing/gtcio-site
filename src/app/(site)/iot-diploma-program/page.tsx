import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaButton from "@/components/CtaButton";
import LinkifyEmail from "@/components/LinkifyEmail";

export const metadata: Metadata = {
  title: "IOT Diploma Program | GTCIO",
  description:
    "Ogeechee Tech's Industrial Operations Technology diploma: four semesters of hands-on training in mechanical, electrical, robotics, and PLC systems, with SACA credentials built in.",
  alternates: { canonical: "/iot-diploma-program" },
};

// Only the diploma carries a program code; the map below widens the union.
type ProgramOption = { name: string; code?: string; detail: string; url: string };

// DEFAULTS is this page's content — code-only, no CMS (PROJECT.md §4).
const DEFAULTS = {
  heroEyebrow: "IOT Diploma Program: Enrolling Now",
  heroTitle: "What is Industrial Operations Technology?",
  heroDescription:
    "It's the training behind keeping manufacturing facilities, utilities, and logistics centers running. Make things work. Keep them working.",
  whatIsTitle: "What is Industrial Operations Technology?",
  whatIsBody:
    "These same skills apply well outside of a manufacturing facility. Facilities management (office buildings, apartment complexes, schools, hospitals) needs people who can keep equipment running, and so do utilities and distribution centers.",
  nonTraditionalHeading: "This is a non-traditional program",
  nonTraditionalBody:
    "OTC classifies Industrial Operations Technology as a non-traditional program — one where a single gender makes up less than 25% of the field's workforce, which today mostly means women. OTC supports students pursuing careers in under-represented fields; here are a few places to start:",
  nonTraditionalResources: [
    { label: "Women in Manufacturing", url: "https://www.womeninmanufacturing.org/about/who-we-are" },
    { label: "Women's Manufacturing Network", url: "https://www.wmnorg.com" },
    { label: "WIM Georgia", url: "https://www.womeninmanufacturing.org/georgia" },
  ],
  viewProgramButton: { label: "VIEW IOT PROGRAM CATALOG (FLIP)", destination: "iotProgramFlipbook" as const },
  downloadProgramButton: { label: "DOWNLOAD IOT PROGRAM (PDF)", destination: "iotProgramPdf" as const },
  curriculumTitle: "Curriculum & credentials",
  curriculumStages: [
    { stage: "Foundation", detail: "Mechanical, electrical, hydraulic, and pneumatic systems." },
    { stage: "Advanced", detail: "Robotics, programmable logic controllers (PLCs), automation controls, smart sensors, industrial wiring, and motor controls." },
    { stage: "Credential", detail: "Every graduate earns the diploma including credentials with each course through the Smart Automation Certification Alliance (SACA) – industry-recognized credentials built into the program, not an optional add-on." },
  ],
  courseDetailHeading: "Every course, in detail",
  courseDetailBody:
    "The diploma is 15 courses and 53 credit hours — 12 program courses plus 3 general education courses. See exactly what each course covers and which industry credential it prepares you for.",
  curriculumButton: { label: "COURSES & CREDIT HOURS", destination: "curriculum" as const },
  certificationsButton: { label: "VIEW CREDENTIALS", destination: "certifications" as const },
  moreWaysTitle: "More than one way in",
  moreWaysBody:
    "The diploma isn't the only option. OTC also breaks the same curriculum into three standalone certificates, so you can start smaller, or focus on just the part of the job you're after.",
  programOptions: [
    {
      name: "Industrial Operations Technology Diploma",
      code: "IS32",
      detail: "The full program.",
      url: "https://ogeecheetech.smartcatalogiq.com/current/catalog/programs-of-study/industrial-operations-technology/industrial-operations-technology-diploma-is32",
    },
    {
      name: "Certificate: Electrical/Mechanical",
      detail: "Focused on the electrical and mechanical side of the curriculum.",
      url: "https://ogeecheetech.smartcatalogiq.com/current/catalog/programs-of-study/industrial-operations-technology/industrial-operations-technology-electricalmechanical-certificate-ia91",
    },
    {
      name: "Certificate: PLC",
      detail: "Focused on programmable logic controllers.",
      url: "https://ogeecheetech.smartcatalogiq.com/current/catalog/programs-of-study/industrial-operations-technology/industrial-operations-technology-plc-certificate-ic91",
    },
    {
      name: "Certificate: Robotics",
      detail: "Focused on robotics.",
      url: "https://ogeecheetech.smartcatalogiq.com/current/catalog/programs-of-study/industrial-operations-technology/industrial-smart-automation-technology-robotics-certificate-ie91",
    },
  ],
  careersTitle: "Careers this prepares you for",
  careers: ["Industrial Maintenance Technician", "Industrial Operations Technician", "Automation & Controls Specialist"],
  careersNote: "Stick with it and there's room to move up, into production supervisor or operations manager roles.",
  jobDutiesTitle: "What the job looks like",
  // Rendered in a row-major 2-col grid (sm:grid-cols-2), so this array order
  // controls the visual columns: odd positions (1st, 3rd, 5th) fall in the
  // left column, even positions (2nd, 4th, 6th) in the right column.
  jobDuties: [
    { label: "Keeping things moving", detail: "Running the line day to day: setting up new machinery, maintaining the equipment and controls already on the floor, and getting production back up fast when something stops." },
    { label: "Tracking down the problems", detail: "Figuring out what's wrong by watching and listening to a machine run, then getting it fixed, whether that's a motor, a conveyor, a pump, or a hydraulic or pneumatic system." },
    { label: "Electrical and controls work", detail: "AC/DC circuit troubleshooting, industrial wiring, motor controls, and programming/troubleshooting PLCs, the \"brains\" behind automated equipment." },
    { label: "Reading blueprints and schematics", detail: "Understanding how a machine goes together or how a system is wired." },
    { label: "Preventive maintenance", detail: "Scheduled inspections, lubrication, and adjustments make up a huge share of the actual job, not just emergency repairs." },
    { label: "Precision measurement and adjustment", detail: "Checking part dimensions with calipers and gauges, calibrating equipment, running metalworking machines to make replacement fittings." },
  ],
  payTitle: "Jobs & pay after graduation",
  payRanges: [
    { value: "Mid-$30ks to low-$40ks", label: "Entry-Level Maintenance Technician" },
    { value: "$55k – $75k", label: "Experienced Maintenance and Operations Technician" },
    { value: "$75k – $100k+", label: "Automation and Controls Specialist and Supervisor" },
  ],
  timeToComplete: "Four semesters.",
  approximateCost: "$9,500 before financial aid such as the HOPE Grant, HOPE Career Grant, and Pell Grant funds are applied.",
  studentFaqTitle: "Student FAQ",
  // Ordered the way a prospective student actually asks: when → am I eligible →
  // how do I apply → where/when → how long → how much → what do I get → what
  // will I earn.
  faqs: [
    { question: "When does the program start?", answer: "The Industrial Operations Technology diploma program is open for enrollment now, with new students starting each semester." },
    { question: "Do I need any experience to start?", answer: "No. The program is built for people coming into the field, whatever their background. You start with the fundamentals — mechanical, electrical, hydraulic, and pneumatic systems — and move on to robotics, PLCs, and automation controls from there." },
    { question: "How do I apply?", answer: "Applications go through Ogeechee Technical College — any of the Apply Now buttons on this page take you straight there. Admissions will walk you through what's needed. If you'd rather talk to a person first, Jan Moore is the program contact: jmoore@ogeecheetech.edu, 912-688-6026." },
    { question: "Where will classes be held?", answer: "Classes begin in the Industrial Technology Building on Ogeechee Tech's main campus, the college's existing robotics facility, and move into GTCIO's new building once it opens. The grand opening is scheduled for October 15, 2026." },
    { question: "Is this an online program?", answer: "Some lectures are available online, but labs are not. Skills are acquired through hands-on labs at Ogeechee Tech." },
    { question: "How long does it take to finish?", answer: "The entire program can be completed in four semesters." },
    { question: "How much does the program cost?", answer: "The program costs approximately $9,500 before financial aid — such as the HOPE Grant, HOPE Career Grant, and Pell Grant — is applied." },
    { question: "What credential do I earn?", answer: "Every student who completes the diploma earns micro-credentials through SACA (the Smart Automation Certification Alliance). Twenty-one SACA credentials are built into the program for all graduates, and they are recognized industry-wide, not just in Georgia." },
    { question: "Should I do the diploma or one of the certificates?", answer: "The diploma is the full program, and every diploma graduate is credentialed through SACA. The three certificates — Electrical/Mechanical, PLC, and Robotics — break the same curriculum into smaller pieces, so you can start smaller or focus on just the part of the job you're after. All four options are listed under \"More than one way in\" above." },
    { question: "How much can I expect to earn after graduating with the full diploma?", answer: "Most graduates start in entry-level or operator roles and grow from there. The pay ranges are listed above: mid-$30ks to low-$40ks starting out, $55k–$75k for an experienced maintenance and operations technician, and $75k–$100k+ for an automation and controls specialist and supervisor." },
  ],
  applyHeading: "Sign up today, and we'll see you here!",
  applyButton: { label: "APPLY NOW", destination: "apply" as const },
};

export default function IotDiplomaProgramPage() {
  const page = DEFAULTS;

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        image="/images/hero-iot-program.jpg"
        imageAlt="Students gathered around automation equipment as an instructor explains it"
        // Measured, not eyeballed. The hero is a wide band — at 1920 only ~27% of
        // the photo's height is visible — and the seven faces span roughly
        // 12%–33% of it. Centring on the faces (~22%) clips the front student's
        // hairline; 12% clips the student in glasses. 18% is the one value that
        // keeps every face in frame from 1280 through 1920, and mobile crops
        // almost nothing (the box is ~1.47:1 against the photo's 1.5:1).
        // Re-check this if the hero copy length changes, since that changes the
        // band height.
        imagePosition="50% 18%"
        cta={
          // Three buttons: apply, read the brochure, save the brochure. They
          // wrap rather than shrink — at 375px each takes its own row, which
          // keeps the long "VIEW IOT PROGRAM CATALOG (FLIP)" label on one line.
          <div className="flex flex-wrap gap-3">
            <CtaButton button={page.applyButton} variant="primary" />
            <CtaButton button={page.viewProgramButton} variant="primary" />
            <CtaButton button={page.downloadProgramButton} variant="primary" />
          </div>
        }
      />

      {/* "What is Industrial Operations Technology" video section — removed
          2026-09-03 pending a re-shot video (the current YouTube embed is
          being replaced). DEFAULTS.whatIsTitle/whatIsBody are left intact
          below; re-add this section with the new embed URL when it's ready. */}

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.curriculumTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {page.curriculumStages.map((stage, i) => (
              <div key={stage.stage} className="border border-brand-silver/40 p-6">
                <p className="font-display text-sm text-brand-red">Stage {i + 1}</p>
                <h3 className="font-heading mt-2 text-lg font-bold text-brand-black">{stage.stage}</h3>
                <p className="mt-2 text-sm text-brand-gray">{stage.detail}</p>
              </div>
            ))}
          </div>

          {/* Gateway to the two detail pages, which are deliberately out of
              the top nav — a prospective student reaches them from here. */}
          <div className="mt-10 border-l-4 border-brand-teal bg-brand-black/[0.03] p-6 sm:p-8">
            <h3 className="font-heading text-xl font-bold text-brand-black">
              {page.courseDetailHeading}
            </h3>
            <p className="mt-3 max-w-2xl text-brand-gray">{page.courseDetailBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaButton button={page.curriculumButton} variant="primary" />
              <CtaButton button={page.certificationsButton} variant="primary" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.moreWaysTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-gray">{page.moreWaysBody}</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {page.programOptions.map((option: ProgramOption) => (
              <div key={option.name} className="border border-brand-silver/40 p-5">
                <p className="font-bold text-brand-black">
                  {option.name}
                  {option.code && <span className="text-brand-gray"> ({option.code})</span>}
                </p>
                <p className="mt-1 text-sm text-brand-gray">{option.detail}</p>
                <a
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading mt-3 inline-block text-sm font-bold tracking-wide text-brand-red hover:text-brand-black"
                >
                  View OTC catalog page →
                </a>
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
            {page.careers.map((career) => (
              <span
                key={career}
                className="font-heading border-2 border-brand-red px-4 py-2 text-sm font-bold tracking-wide text-brand-red"
              >
                {career}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-brand-gray">{page.careersNote}</p>
          <h3 className="font-heading mt-10 text-xl font-bold text-brand-black">{page.jobDutiesTitle}</h3>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {page.jobDuties.map((duty) => (
              <li key={duty.label} className="border-l-4 border-brand-red pl-5">
                <p className="font-bold text-brand-black">{duty.label}</p>
                <p className="mt-1 text-sm text-brand-gray">{duty.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.payTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {page.payRanges.map((tier) => (
              <div key={tier.label} className="border border-brand-silver/40 p-6">
                <p className="font-heading text-2xl font-bold text-brand-red">{tier.value}</p>
                <p className="mt-2 text-sm text-brand-gray">{tier.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-brand-silver/40 p-6">
              <p className="font-heading font-bold text-brand-black">Time to complete</p>
              <p className="mt-1 text-brand-gray">{page.timeToComplete}</p>
            </div>
            <div className="border border-brand-silver/40 p-6">
              <p className="font-heading font-bold text-brand-black">Approximate cost</p>
              <p className="mt-1 text-brand-gray">{page.approximateCost}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.studentFaqTitle}</h2>
          <div className="mt-6 flex flex-col gap-6">
            {page.faqs.map((item) => (
              <div key={item.question} className="border-l-4 border-brand-black pl-5">
                <p className="font-heading font-bold text-brand-black">{item.question}</p>
                <p className="mt-1 text-brand-gray"><LinkifyEmail text={item.answer} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-52 sm:scroll-mt-60 bg-brand-black px-6 py-20 text-center text-brand-white sm:px-10">
        <h2 className="font-heading text-3xl font-bold">{page.applyHeading}</h2>
        <div className="mt-8">
          <CtaButton button={page.applyButton} variant="primary" />
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl border border-brand-silver/40 p-6">
            <p className="font-heading font-bold text-brand-black">{page.nonTraditionalHeading}</p>
            <p className="mt-2 text-sm text-brand-gray">{page.nonTraditionalBody}</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {page.nonTraditionalResources.map((resource) => (
                <li key={resource.url}>
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
          </div>
        </div>
      </section>
    </>
  );
}
