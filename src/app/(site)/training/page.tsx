import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { sanityFetch } from "@/sanity/lib/live";
import { TRAINING_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, type SanityImage } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "IOT Training Programs | GTCIO",
};

// The public flipbook of "OTC Industrial Systems Training Program".
const CATALOG_URL = "https://online.fliphtml5.com/exygb/kvbr/#p=1";

const DEFAULTS = {
  heroEyebrow: "IOT Training Programs",
  heroTitle: "Students on one side, employers on the other: same goal",
  heroDescription:
    "GTCIO trains individual students building a career, and works directly with employers who need to upskill the team they've already got.",
  employersBody:
    "Custom, hands-on training for your current workforce, built around your own equipment and processes — less downtime, more maintenance capability in-house. Ogeechee Tech's industrial systems training team runs everything from single 16-hour short courses to DOL-registered apprenticeships, and trains and certifies instructors from across Georgia and the nation.",
  faqTitle: "Employer FAQ",
  employerFaqs: [
    { question: "What are employees trained in?", answer: "Electrical systems and industrial wiring, motor controls, PLCs (Allen-Bradley and Siemens), robotics (FANUC), process control, fluid power, mechanical drives, and industrial troubleshooting — all on real industrial equipment." },
    { question: "What's the value proposition for my business?", answer: "A pipeline of work-ready technicians, plus custom training that upskills the staff you already have, delivered by a team with more than 120 years of combined in-field experience." },
    { question: "How long does training take?", answer: "Short courses run 16–40 hours each. The entry-level Industrial Systems Fast Track is 256 hours over 16 weeks, two 8-hour days a week. The DOL-registered apprenticeships add 384 hours of classroom and lab time, about one 8-hour day a week, alongside 4,000 hours of on-the-job training." },
    { question: "How much does it cost?", answer: "Short courses run about $450–$950 depending on length, and FANUC robotics and CNC courses run $750–$1,936. Comprehensive programs are $4,750 for the 256-hour Industrial Systems Fast Track and $7,750 for each 384-hour apprenticeship program. Customized contract training is scoped and quoted with your company rather than sold at a flat rate." },
    { question: "What credentials can employees earn?", answer: "Ogeechee Tech is an approved SACA testing site (Silver and Gold) and an Amatrol certification provider. The entry-level track prepares students to sit for 8 SACA exams, and the Electrical Apprenticeship lists 14 SACA credentials. Note that employees must pass the exam to earn a credential — finishing a course alone doesn't award one." },
    { question: "Who do I contact to set up training?", answer: "Jan Moore, Vice President for Economic Development — jmoore@ogeecheetech.edu, 912-688-6026." },
  ],
};

// Everything below is drawn from OTC's "Industrial Systems Training Program"
// brochure (see CATALOG_URL) except the 460,000-hour figure, which is GTCIO's
// own facility capacity. Rendered from code rather than the CMS because these
// are standing facts, not routine copy edits.
const STATS = [
  { value: "~460,000", label: "Hours of instruction GTCIO can deliver each year" },
  { value: "120+ years", label: "Combined in-field industrial systems experience on the training team" },
  { value: "80 years", label: "Combined industrial systems training experience" },
];

const AFFILIATIONS = [
  { label: "FANUC", detail: "The only authorized FANUC satellite training site in the state of Georgia." },
  { label: "SACA Gold", detail: "A Smart Automation Certification Alliance Gold Certification Site, and a SACA Regional Instructor Training Center — the first in Georgia." },
  { label: "Amatrol", detail: "An Amatrol Certified Instructor Training Site, hosting Amatrol Technical Training Institute (ATTI) courses." },
  { label: "Mitsubishi Electric", detail: "A Mitsubishi Electric Automation Training Provider." },
  { label: "Advanced Manufacturing Academy", detail: "An Advanced Manufacturing Academy Training Center." },
];

const SERVICES = [
  { title: "Standardized training", detail: "Short and comprehensive courses developed when several industries need the same training. Content is industry-wide, not specific to one company, and runs at basic, intermediate, and advanced levels." },
  { title: "Customized contract training", detail: "Programs designed in collaboration with your company to fill specific gaps in your employees' knowledge and skills." },
  { title: "Skills assessments", detail: "Hands-on and written assessments — for prospective hires or current employees — to gauge real skill levels, using Amatrol's e-learning curriculum." },
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

export default async function TrainingPage() {
  const { data } = await sanityFetch({ query: TRAINING_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroImage?: SanityImage;
    heroImageAlt?: string;
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const employerFaqs = typed?.employerFaqs?.length ? typed.employerFaqs : DEFAULTS.employerFaqs;

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
      />

      <section className="border-b border-brand-silver/30 bg-brand-white px-6 py-14 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="border-l-4 border-brand-red pl-5">
              <p className="font-heading text-3xl font-bold text-brand-black">{stat.value}</p>
              <p className="mt-1 text-sm text-brand-silver">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Training for employers</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.employersBody}</p>
          <p className="mt-4 max-w-3xl text-brand-silver">
            Training happens on the same industrial equipment your team works on every
            day, and courses are built to stack: an employee can start with a single
            short course and keep going, all the way to a registered apprenticeship.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="primary">TALK TO US ABOUT TRAINING</Button>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Credentials &amp; affiliations</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AFFILIATIONS.map((a) => (
              <div key={a.label} className="border border-brand-silver/40 p-6">
                <p className="font-heading text-lg font-bold text-brand-red">{a.label}</p>
                <p className="mt-2 text-sm text-brand-silver">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">What we offer employers</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="border border-brand-silver/40 p-6">
                <h3 className="font-heading text-lg font-bold text-brand-red">{s.title}</h3>
                <p className="mt-2 text-sm text-brand-silver">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Course areas</h2>
          <p className="mt-3 max-w-3xl text-brand-silver">
            Short courses run 16–40 hours each and can be taken on their own or
            combined. Full descriptions, hours, and pricing are in the training
            catalog.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {COURSE_AREAS.map((c) => (
              <div key={c.area} className="border-t-2 border-brand-red pt-4">
                <h3 className="font-heading text-lg font-bold text-brand-black">{c.area}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {c.courses.map((course) => (
                    <li key={course} className="text-sm text-brand-silver">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 bg-brand-black px-6 py-16 text-brand-white sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-sm text-brand-gold">Full catalog</p>
            <h2 className="font-heading mt-2 text-3xl font-bold">
              Industrial Systems Training Program
            </h2>
            <p className="mt-3 text-brand-silver">
              Every course description, the training team, apprenticeship details, and
              full pricing — in Ogeechee Tech&apos;s complete training catalog.
            </p>
          </div>
          <Button
            href={CATALOG_URL}
            variant="primary"
            className="shrink-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW THE CATALOG
          </Button>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.faqTitle}</h2>
          <div className="mt-6 flex flex-col gap-6">
            {employerFaqs.map((item: { question: string; answer: string }) => (
              <div key={item.question} className="border-l-4 border-brand-black pl-5">
                <p className="font-heading font-bold text-brand-black">{item.question}</p>
                <p className="mt-1 text-brand-silver">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
