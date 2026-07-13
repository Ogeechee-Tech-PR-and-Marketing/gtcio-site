import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About | GTCIO",
};

const FAQS = [
  {
    q: "Who runs GTCIO?",
    a: "GTCIO is a division of Ogeechee Technical College, part of the Technical College System of Georgia.",
  },
  {
    q: "Is GTCIO only for students?",
    a: "No. We train individual students pursuing a diploma and we partner directly with employers to train and upskill their existing workforce.",
  },
  {
    q: "When does the Industrial Operations Technology program start?",
    a: "The diploma program launches in August 2026.",
  },
  {
    q: "Where is GTCIO located?",
    a: "Details on our campus and facility are on the Facility page, including how to schedule an in-person tour.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About GTCIO"
        title="Building Georgia's industrial workforce, together"
        description="GTCIO exists to close the gap between the skills employers need and the training available to fill those roles."
        image="/images/hero-about.jpg"
        imageAlt="Engineer working with a robotic arm"
        imagePosition="center 7%"
      />

      <section id="mission" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">Mission</h2>
          <p className="mt-4 text-brand-black">
            GTCIO trains people for jobs in industrial automation — the kind of work Georgia
            employers are actively short on candidates for. These jobs pay well, and the demand
            isn&apos;t slowing down. GTCIO exists to meet that demand: training new workers coming
            up, and helping employers upskill the ones they already have.
          </p>
          <p className="mt-4 text-sm text-brand-silver">
            (Formal mission-statement wording pending final sign-off from GTCIO leadership.)
          </p>
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg italic text-brand-black">
              &ldquo;We are surrounded by industries that are looking for employees with these skill
              sets. The jobs pay well, offer excellent career growth opportunities, and the demand
              continues to increase.&rdquo;
            </p>
            <p className="mt-3 text-sm text-brand-silver">
              Jan Moore — Vice President for Economic Development, Ogeechee Technical College
            </p>
          </blockquote>
        </div>
      </section>

      <section id="bulloch-development-authority" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">Development Authority of Bulloch County</h2>
          <p className="mt-4 text-brand-black">
            The Development Authority of Bulloch County helped make GTCIO&apos;s new facility
            possible — a training center this size doesn&apos;t get built without local backing.
          </p>
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg italic text-brand-black">
              &ldquo;I cannot stress enough what an asset this will be for Bulloch County and the
              surrounding region. The training will range from foundational skills in industrial
              operations to that of an automation engineer. Finding that under one roof is almost
              unheard of. It will be life changing for many of our residents.&rdquo;
            </p>
            <p className="mt-3 text-sm text-brand-silver">
              Benjy Thompson — CEO, Development Authority of Bulloch County
            </p>
          </blockquote>
        </div>
      </section>

      <section id="history-of-partnership" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">History of Partnership</h2>
          <p className="mt-4 text-brand-black">
            GTCIO&apos;s home is a new $27 million, 40,000-square-foot facility with capacity for
            nearly 460,000 hours of instruction a year. It serves credit students and incumbent
            workers alike. Tours run through the building without interrupting day-to-day training —
            that was a design decision from the start. Beyond academic programs, GTCIO also runs
            customized workforce development for regional employers, and trains and certifies
            instructors from across Georgia and the nation.
          </p>
          <p className="mt-4 text-sm text-brand-silver">
            (Full partnership history and timeline to be added.)
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">FAQ</h2>
          <div className="mt-6 flex flex-col gap-6">
            {FAQS.map((item) => (
              <div key={item.q} className="border-l-4 border-brand-black pl-5">
                <p className="font-heading font-bold text-brand-black">{item.q}</p>
                <p className="mt-1 text-brand-silver">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
