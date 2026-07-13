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
            Placeholder — final mission statement pending sign-off. GTCIO's mission is to prepare
            Georgia's workforce for careers in Industrial Operations Technology through hands-on
            training that meets the real needs of local employers.
          </p>
        </div>
      </section>

      <section id="bulloch-development-authority" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">Bulloch Development Authority</h2>
          <p className="mt-4 text-brand-black">
            Content coming soon — details on GTCIO's relationship with the Bulloch Development
            Authority will be added here.
          </p>
        </div>
      </section>

      <section id="history-of-partnership" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">History of Partnership</h2>
          <p className="mt-4 text-brand-black">
            Placeholder — this section will tell the story of how GTCIO's employer and community
            partnerships took shape, from the first collaborations to the new facility built so
            tours don&apos;t interrupt daily operations.
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
