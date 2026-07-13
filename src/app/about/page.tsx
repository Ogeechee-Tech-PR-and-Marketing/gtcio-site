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
      />

      <section id="mission" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">Mission</h2>
          <p className="mt-4 text-brand-black">
            GTCIO exists to equip students with the expertise needed to succeed and grow
            professionally in today&apos;s automated industrial environments. Georgia&apos;s
            employers are looking for workers with these skill sets — the jobs pay well, offer
            excellent career growth, and demand keeps increasing. GTCIO is built to meet that
            demand, for students entering the workforce and for employers upskilling the team they
            already have.
          </p>
          <p className="mt-4 text-sm text-brand-silver">
            (Formal mission-statement wording pending final sign-off from GTCIO leadership.)
          </p>
        </div>
      </section>

      <section id="bulloch-development-authority" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">Development Authority of Bulloch County</h2>
          <p className="mt-4 text-brand-black">
            GTCIO&apos;s new facility was built with the direct support of the Development
            Authority of Bulloch County, recognizing what a training center of this scale means for
            the region&apos;s workforce.
          </p>
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg text-brand-black">
              &ldquo;I cannot stress enough what an asset this will be for Bulloch County and the
              surrounding region. The training will range from foundational skills in industrial
              operations to that of an automation engineer. Finding that under one roof is almost
              unheard of. It will be life changing for many of our residents.&rdquo;
            </p>
            <p className="font-heading mt-3 text-sm font-bold tracking-wide text-brand-red">
              BENJY THOMPSON — CEO, DEVELOPMENT AUTHORITY OF BULLOCH COUNTY
            </p>
          </blockquote>
        </div>
      </section>

      <section id="history-of-partnership" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">History of Partnership</h2>
          <p className="mt-4 text-brand-black">
            GTCIO is housed in a new $27 million, 40,000-square-foot facility built to serve both
            credit students and incumbent workers — with capacity for nearly 460,000 hours of
            instruction a year. The building was designed so tours never interrupt day-to-day
            training, and beyond academic programs, it provides customized workforce development
            and upskilling for regional employers, while also serving as an instructional training
            and certification site for instructors from across Georgia and the nation.
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
