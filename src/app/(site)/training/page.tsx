import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { sanityFetch } from "@/sanity/lib/live";
import { TRAINING_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, type SanityImage } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Training | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "Training",
  heroTitle: "Students on one side, employers on the other: same goal",
  heroDescription:
    "GTCIO trains individual students building a career, and works directly with employers who need to upskill the team they've already got.",
  studentsBody:
    "A hands-on career path into Industrial Operations Technology. See the IOT Diploma Program for jobs, pay, timeline, and cost.",
  employersBody:
    "Custom training for your current staff, built around your own equipment and processes. Less downtime, more maintenance capability in-house. GTCIO also trains and certifies instructors from across Georgia and the nation.",
  faqTitle: "Employer FAQ",
  employerFaqs: [
    { question: "What are graduates trained in?", answer: "Maintenance, electrical/controls, PLCs, precision measurement, and preventive maintenance on real industrial equipment." },
    { question: "What's the value proposition for my business?", answer: "A pipeline of work-ready technicians, plus custom training for your existing staff, trained on equipment similar to what you run." },
    { question: "How long does custom training take?", answer: "It depends on what you need covered. Placeholder for now, pricing and timelines get worked out per engagement." },
    { question: "How much does it cost?", answer: "Same answer as above: it's scoped per engagement, not a flat rate. Placeholder until we have real numbers to share." },
  ],
};

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
