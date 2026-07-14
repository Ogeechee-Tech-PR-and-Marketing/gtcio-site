import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { sanityFetch } from "@/sanity/lib/live";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "About | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "About GTCIO",
  heroTitle: "Building Georgia's industrial workforce, together",
  heroDescription:
    "GTCIO exists to close the gap between the skills employers need and the training available to fill those roles.",
  missionBody:
    "GTCIO trains people for jobs in industrial automation, the kind of work Georgia employers are actively short on candidates for. These jobs pay well, and the demand isn't slowing down. GTCIO exists to meet that demand: training new workers coming up, and helping employers upskill the ones they already have.",
  missionNote: "(Formal mission-statement wording pending final sign-off from GTCIO leadership.)",
  missionQuote:
    "We are surrounded by industries that are looking for employees with these skill sets. The jobs pay well, offer excellent career growth opportunities, and the demand continues to increase.",
  missionQuoteAttribution: "Jan Moore — Vice President for Economic Development, Ogeechee Technical College",
  bdaTitle: "Development Authority of Bulloch County",
  bdaBody:
    "The Development Authority of Bulloch County helped make GTCIO's new facility possible. A training center this size doesn't get built without local backing.",
  bdaQuote:
    "I cannot stress enough what an asset this will be for Bulloch County and the surrounding region. The training will range from foundational skills in industrial operations to that of an automation engineer. Finding that under one roof is almost unheard of. It will be life changing for many of our residents.",
  bdaQuoteAttribution: "Benjy Thompson — CEO, Development Authority of Bulloch County",
  historyBody:
    "GTCIO's home is a new $27 million, 40,000-square-foot facility with capacity for nearly 460,000 hours of instruction a year. It serves credit students and incumbent workers alike. Tours run through the building without interrupting day-to-day training. That was a design decision from the start. Beyond academic programs, GTCIO also runs customized workforce development for regional employers, and trains and certifies instructors from across Georgia and the nation.",
  historyNote: "(Full partnership history and timeline to be added.)",
  faqs: [
    {
      question: "Who runs GTCIO?",
      answer: "GTCIO is a division of Ogeechee Technical College, part of the Technical College System of Georgia.",
    },
    {
      question: "Is GTCIO only for students?",
      answer: "No. We train individual students pursuing a diploma and we partner directly with employers to train and upskill their existing workforce.",
    },
    {
      question: "When does the Industrial Operations Technology program start?",
      answer: "The diploma program launches in August 2026.",
    },
    {
      question: "Where is GTCIO located?",
      answer: "Details on our campus and facility are on the Facility page, including how to schedule an in-person tour.",
    },
  ],
};

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: ABOUT_PAGE_QUERY });
  const typed = data as Partial<typeof DEFAULTS> | null;
  const page = { ...DEFAULTS, ...typed };
  const faqs = typed?.faqs?.length ? typed.faqs : DEFAULTS.faqs;

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        image="/images/hero-about.jpg"
        imageAlt="Engineer working with a robotic arm"
        imagePosition="61% 25%"
      />

      <section id="mission" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">Mission</h2>
          <p className="mt-4 text-brand-black">{page.missionBody}</p>
          {page.missionNote && <p className="mt-4 text-sm text-brand-silver">{page.missionNote}</p>}
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg italic text-brand-black">&ldquo;{page.missionQuote}&rdquo;</p>
            <p className="mt-3 text-sm text-brand-silver">{page.missionQuoteAttribution}</p>
          </blockquote>
        </div>
      </section>

      <section id="bulloch-development-authority" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.bdaTitle}</h2>
          <p className="mt-4 text-brand-black">{page.bdaBody}</p>
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg italic text-brand-black">&ldquo;{page.bdaQuote}&rdquo;</p>
            <p className="mt-3 text-sm text-brand-silver">{page.bdaQuoteAttribution}</p>
          </blockquote>
        </div>
      </section>

      <section id="history-of-partnership" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">History of Partnership</h2>
          <p className="mt-4 text-brand-black">{page.historyBody}</p>
          {page.historyNote && <p className="mt-4 text-sm text-brand-silver">{page.historyNote}</p>}
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">FAQ</h2>
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
    </>
  );
}
