import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import CtaButton from "@/components/CtaButton";
import LinkifyEmail from "@/components/LinkifyEmail";
import { AFFILIATIONS, affiliationsFor } from "@/lib/credentials";

export const metadata: Metadata = {
  title: "IOT Training Programs | GTCIO",
};

// The public flipbook of "OTC Industrial Systems Training Program".
const CATALOG_URL = "https://online.fliphtml5.com/exygb/kvbr/#p=1";
// The same catalog, as a downloadable PDF.
const CATALOG_PDF_URL = "/documents/otc-industrial-systems-training-program-4.pdf";

// DEFAULTS is this page's content — code-only, no CMS (PROJECT.md §4).
const DEFAULTS = {
  heroEyebrow: "IOT Training Programs",
  heroTitle: "Students on one side, employers on the other: same goal",
  employersTitle: "Training for employers",
  employersBody2:
    "Respected for the highly-skilled level of training it provides, the GTCIO also trains and certifies instructors from across Georgia and the nation to provide this same training.",
  employersButton: { label: "TALK TO US ABOUT TRAINING", destination: "contact" as const },
  catalogEyebrow: "Full catalog",
  catalogTitle: "Industrial Systems Training Program",
  catalogBody:
    "Every course description, the training team, apprenticeship details, and full pricing — in Ogeechee Tech's complete training catalog.",
  catalogButton: {
    label: "VIEW THE CATALOG",
    destination: "external" as const,
    externalUrl: CATALOG_URL,
  },
  affiliationsTitle: "Credentials & affiliations",
  servicesTitle: "What we offer employers",
  courseAreasTitle: "Course areas",
  courseAreasIntro:
    "Short courses run 16–40 hours each and can be taken on their own or combined. Full descriptions, hours, and pricing are in the training catalog.",
  employersBody:
    "Custom, hands-on training for your current workforce, applicable to your equipment and processes – resulting in less downtime, more maintenance capability in-house. Ogeechee Tech's industrial systems training team runs everything from simple 16-hour short courses to DOL-registered apprenticeships. Courses are built to stack: an employee can start with a single short course and keep going all the way to a registered apprenticeship.",
  faqTitle: "Employer FAQ",
  employerFaqs: [
    { question: "What are employees trained in?", answer: "Electrical systems and industrial wiring, motor controls, PLCs (Allen-Bradley, Mitsubishi, and Siemens), robotics, process control, fluid power, mechanical drives, and industrial troubleshooting." },
    { question: "What's the value proposition for my business?", answer: "A pipeline of work-ready technicians, plus custom training that upskills the staff you already have, delivered by a team with more than 92 years of combined in-field experience." },
    { question: "How long does training take?", answer: "Short courses run 16–40 hours each. The entry-level Industrial Systems Fast Track is 256 hours over 16 weeks, two 8-hour days a week. The DOL-registered apprenticeships add 384 hours of classroom and lab time, about one 8-hour day a week, alongside 4,000 hours of on-the-job training." },
    { question: "How much does it cost?", answer: "Short courses run about $575–$1,350 depending on length, and FANUC and CNC courses run $1,150–$2,250. Comprehensive programs are $4,750 for the 256-hour Industrial Systems Fast Track and $7,750 for each 384-hour apprenticeship program. Customized contract training is scoped and quoted with your company rather than sold at a flat rate." },
    { question: "What credentials can employees earn?", answer: "Ogeechee Tech is an approved SACA testing site (Silver and Gold), the only authorized FANUC satellite training site in Georgia, a Mitsubishi Electric Automation Training Provider, and a Rockwell Automation Academy of Advanced Manufacturing training site. Note that employees must pass the exam to earn a credential — finishing a course alone doesn't award one. Available credentials are listed below each course description in the training course catalog." },
    { question: "Can I have a training program designed just for my employees?", answer: "Yes. Customized contract training is built around your company's specific equipment, processes, and skill gaps rather than a standardized course, and it's scoped and quoted directly with your company instead of sold at a flat rate. Talk to Jan Moore to start scoping a program for your team." },
    { question: "Who do I contact to set up training?", answer: "Jan Moore, Vice President for Economic Development — jmoore@ogeecheetech.edu, 912-688-6026." },
  ],
};

// Drawn from OTC's "Industrial Systems Training Program" brochure (see
// CATALOG_URL) except the 460,000-hour figure, which is GTCIO's own facility
// capacity, and the credentials figure (see its own comment below).
//
// EXCEPT the two experience figures, which DIVERGE from that brochure on
// purpose: Travis Wright is no longer associated with the IOT diploma
// program (he's still at OTC), so his 28 years come out of both totals —
// in-field 120+ -> 92+, training 80 -> 52. The brochure still prints 120/80
// and the site is intentionally ahead of it: do NOT "fix" these back to
// match the brochure.
const STATS = [
  { value: "~460,000", label: "Hours of instruction GTCIO can deliver each year" },
  { value: "92+ years", label: "Combined in-field industrial systems experience on the training team" },
  { value: "52 years", label: "Combined industrial systems training experience" },
  // 6,226 is sourced internally from Justin Goodman, who oversees
  // certifications for the program — it appears in no published document, so
  // nothing in this repo can confirm it. Confirmed correct (and likely an
  // undercount) by the site owner; ask Justin for a current number before
  // changing it.
  { value: "6,226", label: "Student certifications and credentials earned since 2024" },
];

// AFFILIATIONS lives in src/lib/credentials.ts, shared with /credentials so
// both pages render the same accreditations from one place — see
// affiliationsFor() below.

const SERVICES = [
  { title: "Standardized training", detail: "Short and comprehensive courses developed when several industries need the same training. Content is industry-wide, not specific to one company, and runs at basic, intermediate, and advanced levels." },
  { title: "Customized contract training", detail: "Programs designed in collaboration with your company to fill specific gaps in your employees' knowledge and skills." },
  { title: "Skills assessments", detail: "Hands-on and written assessments to gauge real skill levels and design training plans." },
  { title: "DOL-registered apprenticeships", detail: "Electrical, Mechanical, and Industrial Systems apprenticeship tracks pairing classroom and lab work with on-the-job hours under a mentor." },
  { title: "Amatrol LMS & open lab", detail: "Access to the full Amatrol LMS libraries with progress tracking, plus open-lab time on the industrial systems equipment." },
  { title: "Instructor training", detail: "SACA Gold instructor training and Amatrol ATTI courses, for instructors and trainers from across Georgia and the nation." },
];

const COURSE_AREAS = [
  { area: "Electrical", courses: ["Electrical Basics", "Industrial Electrical Wiring", "Troubleshooting Methodology"] },
  { area: "Electrical & Instrumentation", courses: ["Level and Flow Process Control", "Thermal Process Control"] },
  { area: "Motor Controls", courses: ["Introduction to Motor Controls with Troubleshooting", "Advanced Motor Controls with Troubleshooting"] },
  { area: "PLCs & Controls", courses: ["Introduction to PLCs (Allen-Bradley CompactLogix / ControlLogix, or Siemens S7-300)", "Advanced PLC Programming", "PLC Troubleshooting", "PLC Process Control"] },
  { area: "Robotics", courses: ["Basic Robot Operations", "Basic Robot Vision", "FANUC HandlingTool (operations and programming)", "FANUC iRVision 2D"] },
  { area: "SCADA Systems", courses: ["Visual Communications (Industry 4.0)"] },
];

export default function TrainingPage() {
  const page = DEFAULTS;
  const employerFaqs = DEFAULTS.employerFaqs;
  const stats = STATS;
  // Filtered to this page's audience — see the matching filter on /credentials.
  const affiliations = affiliationsFor(AFFILIATIONS, "employer");
  const services = SERVICES;
  const courseAreas = COURSE_AREAS;

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        image="/images/hero-training.jpg"
        imageAlt="Technician performing PLC maintenance on an electrical control panel"
        imagePosition="61% 31%"
        extra={
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="border-l-4 border-brand-red pl-5">
                <p className="font-heading text-3xl font-bold text-brand-white">{stat.value}</p>
                <p className="mt-1 text-sm text-brand-silver">{stat.label}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.employersTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.employersBody}</p>
          {page.employersBody2 && (
            <p className="mt-4 max-w-3xl text-brand-silver">{page.employersBody2}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <CtaButton button={page.employersButton} variant="primary" />
            <CtaButton button={page.catalogButton} variant="primary" />
            <Button href={CATALOG_PDF_URL} download variant="primary">
              DOWNLOAD THE CATALOG
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 bg-brand-black px-6 py-16 text-brand-white sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            {page.catalogEyebrow && (
              <p className="font-display text-sm text-brand-gold">{page.catalogEyebrow}</p>
            )}
            <h2 className="font-heading mt-2 text-3xl font-bold">{page.catalogTitle}</h2>
            {page.catalogBody && <p className="mt-3 text-brand-silver">{page.catalogBody}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <CtaButton button={page.catalogButton} variant="primary" />
            <Button href={CATALOG_PDF_URL} download variant="primary">
              DOWNLOAD THE CATALOG
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.affiliationsTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {affiliations.map((a, i) => (
              <div key={i} className="border border-brand-silver/40 p-6">
                <p className="font-heading text-lg font-bold text-brand-red">{a.title}</p>
                <p className="mt-2 text-sm text-brand-silver">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.servicesTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div key={i} className="border border-brand-silver/40 p-6">
                <h3 className="font-heading text-lg font-bold text-brand-red">{s.title}</h3>
                <p className="mt-2 text-sm text-brand-silver">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.courseAreasTitle}</h2>
          {page.courseAreasIntro && (
            <p className="mt-3 max-w-3xl text-brand-silver">{page.courseAreasIntro}</p>
          )}
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {courseAreas.map((c, i) => (
              <div key={i} className="border-t-2 border-brand-red pt-4">
                <h3 className="font-heading text-lg font-bold text-brand-black">{c.area}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {c.courses.map((course, j) => (
                    <li key={j} className="text-sm text-brand-silver">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.faqTitle}</h2>
          <div className="mt-6 flex flex-col gap-6">
            {employerFaqs.map((item: { question: string; answer: string }, i: number) => (
              <div key={i} className="border-l-4 border-brand-black pl-5">
                <p className="font-heading font-bold text-brand-black">{item.question}</p>
                <p className="mt-1 text-brand-silver"><LinkifyEmail text={item.answer} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
