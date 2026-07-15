import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { sanityFetch } from "@/sanity/lib/live";
import { TRAINING_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, type SanityImage } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "IOT Training Programs | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "IOT Training Programs",
  heroTitle: "Students on one side, employers on the other: same goal",
  heroDescription:
    "GTCIO trains individual students building a career, and works directly with employers who need to upskill the team they've already got.",
  studentsBody:
    "A hands-on career path into Industrial Operations Technology. See the IOT Diploma Program for jobs, pay, timeline, and cost.",
  employersBody:
    "Custom, hands-on training for your current workforce, built around your own equipment and processes — less downtime, more maintenance capability in-house. Ogeechee Tech delivered 242,000 hours of industrial systems training in 2024, from single short courses to DOL-registered apprenticeships. GTCIO also trains and certifies instructors from across Georgia and the nation.",
  faqTitle: "Employer FAQ",
  employerFaqs: [
    { question: "What are employees trained in?", answer: "Electrical systems and industrial wiring, motor controls, PLCs (Allen-Bradley and Siemens), robotics (FANUC), fluid power, mechanical drives, process control, and industrial troubleshooting — all on real industrial equipment." },
    { question: "What's the value proposition for my business?", answer: "A pipeline of work-ready technicians, plus custom training that upskills the staff you already have, delivered by a team with more than 120 years of combined in-field experience." },
    { question: "How long does training take?", answer: "It ranges from short courses (16–40 hours each) up to comprehensive programs. The entry-level Industrial Systems Technician track runs 16 weeks, and DOL-registered apprenticeships run 18 months (576 training hours plus 4,000 on-the-job hours). Customized on-site training is scoped to what you need." },
    { question: "How much does it cost?", answer: "Standardized short courses run roughly $450–$950 each. Comprehensive programs, including the entry-level fast track and the apprenticeships, range from about $4,750 to $7,750. Customized on-site training is quoted per engagement." },
    { question: "What credentials can employees earn?", answer: "Ogeechee Tech is an approved SACA testing site (Silver and Gold) and an Amatrol certification provider. Individual courses prepare employees for specific SACA credentials, and the apprenticeship tracks can earn up to 14 SACA credentials." },
    { question: "Who do I contact to set up training?", answer: "Reach out through our Contact page and GTCIO's Business & Industry Training team will follow up to scope a program for your company." },
  ],
};

// Stable facts from OTC's Industrial Systems Training Program. Rendered from
// code (not the CMS) because they're standing credentials, not routine edits.
const AFFILIATIONS = [
  { label: "FANUC", detail: "The only authorized FANUC satellite training site in Georgia" },
  { label: "SACA Gold", detail: "SACA Gold Certification Site and Regional Instructor Training Center" },
  { label: "Amatrol", detail: "Amatrol Certified Instructor Training Site" },
  { label: "Mitsubishi Electric", detail: "Mitsubishi Electric Automation Training Provider" },
];

const SERVICES = [
  { title: "Standardized short courses", detail: "Focused 16–40 hour courses in electrical, motor controls, PLCs, robotics, and process control." },
  { title: "Comprehensive technician training", detail: "The 16-week entry-level Industrial Systems Technician track, covering electrical through fluid power." },
  { title: "DOL-registered apprenticeships", detail: "18-month Electrical, Mechanical, and Industrial Systems apprenticeships combining lab work and on-the-job hours." },
  { title: "Customized contract training", detail: "Programs built with your company to close specific gaps in your team's knowledge and skills." },
  { title: "Skills assessments", detail: "Pre-hire and current-employee assessments, hands-on and written, to gauge real skill levels." },
  { title: "Instructor training & open lab", detail: "Amatrol (ATTI) and SACA Gold instructor training, plus open-lab access to industrial systems equipment." },
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

      <section className="border-b border-brand-silver/30 bg-brand-black px-6 py-14 text-brand-white sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-5xl font-bold text-brand-gold sm:text-6xl">242,000</p>
              <p className="mt-2 max-w-md text-brand-silver">
                hours of industrial systems training delivered in 2024, led by a team with
                more than 120 years of combined in-field experience.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {AFFILIATIONS.map((a) => (
              <div key={a.label} className="bg-brand-black p-6">
                <p className="font-heading text-lg font-bold text-brand-white">{a.label}</p>
                <p className="mt-2 text-sm text-brand-silver">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="border border-brand-silver/40 p-8">
            <h2 className="font-heading text-2xl font-bold text-brand-red">For Students</h2>
            <p className="mt-4 text-brand-silver">{page.studentsBody}</p>
            <div className="mt-6">
              <Button href="/iot-diploma-program" variant="outline">EXPLORE THE PROGRAM</Button>
            </div>
          </div>
          <div className="border border-brand-silver/40 p-8">
            <h2 className="font-heading text-2xl font-bold text-brand-red">For Employers</h2>
            <p className="mt-4 text-brand-silver">{page.employersBody}</p>
            <div className="mt-6">
              <Button href="/contact" variant="outline">TALK TO US</Button>
            </div>
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
