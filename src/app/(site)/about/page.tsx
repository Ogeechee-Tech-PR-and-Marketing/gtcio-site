import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { sanityFetch } from "@/sanity/lib/live";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, type SanityImage } from "@/sanity/lib/image";

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
  historyTitle: "History",
  historyBody:
    "GTCIO's home is a new $27 million, 40,000-square-foot facility with capacity for nearly 460,000 hours of instruction a year. It exists because demand outran the room to meet it: Ogeechee Tech's industrial systems training was on pace to fill its existing building, and the college sits 32 miles from the Bryan County mega site, where the Hyundai electric-vehicle plant was projected to bring roughly 8,100 jobs to the region and nearby suppliers another 3,000. Skilled industrial systems and robotics technicians were already in shorter supply than Georgia industry could hire. The center was planned as a regional answer to that, serving credit students and incumbent workers alike, running customized workforce development for regional employers, and training and certifying instructors from across Georgia and the nation.",
  historyTimeline: [
    {
      date: "July 2022",
      title: "The push for funding begins",
      detail:
        "Work kicks off to fund the project, including acquiring the land from the Development Authority of Bulloch County.",
    },
    {
      date: "September 2022",
      title: "Initial funding approved",
      detail:
        "The Technical College System of Georgia's state board approves the project on its FY24 capital outlay list, clearing the way from idea to plan.",
    },
    {
      date: "July 2023",
      title: "Design team selected",
      detail:
        "PRAXIS3, an Atlanta-based architecture and design firm, is chosen to design the facility.",
    },
    {
      date: "August 2023",
      title: "Construction team selected",
      detail:
        "ICB Construction Group, a general contractor based in Macon, is brought on to build it.",
    },
    {
      date: "September 2023",
      title: "Design begins",
      detail:
        "Design work starts on a building meant to triple Ogeechee Tech's industrial systems and robotics training capacity, anchor training for the wider region, and serve as a model other technical colleges in Georgia can replicate.",
    },
    {
      date: "June 2025",
      title: "Construction begins",
      detail: "Ground is broken on the 40,000-square-foot facility.",
    },
    {
      date: "August 2026",
      title: "First classes begin",
      detail:
        "The Industrial Operations Technology diploma program launches in the Industrial Technology Building on Ogeechee Tech's main campus, the college's existing robotics facility, while the new building is finished.",
    },
    {
      date: "September 2026",
      title: "Construction targeted for completion",
      detail: "The building is scheduled to be finished and handed over.",
    },
    {
      date: "October 15, 2026",
      title: "Ribbon cutting",
      detail: "GTCIO officially opens its doors.",
    },
  ],
  historyNote: "",
  advisoryTitle: "Advisory Board",
  advisoryBody:
    "GTCIO's curriculum is shaped by an advisory board of regional employers and industry leaders, so what we teach stays aligned with the equipment and skills the workforce actually needs.",
  advisoryNote: "(Advisory board members and full description to be added.)",
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
      answer:
        "GTCIO's new home is at 66 AJ Riggs Road, Statesboro, GA 30458. Until it opens — the ribbon cutting is October 15, 2026 — classes are held in the Industrial Technology Building on Ogeechee Tech's main campus. The Facility page has more, including how to request a tour.",
    },
  ],
};

type TimelineEvent = {
  _key?: string;
  date: string;
  title: string;
  detail?: string;
};

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: ABOUT_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroImage?: SanityImage;
    heroImageAlt?: string;
    historyTimeline?: TimelineEvent[];
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const faqs = typed?.faqs?.length ? typed.faqs : DEFAULTS.faqs;
  const timeline: TimelineEvent[] = typed?.historyTimeline?.length
    ? typed.historyTimeline
    : DEFAULTS.historyTimeline;

  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-about.jpg",
    fallbackAlt: "Engineer working with a robotic arm",
    fallbackPosition: "61% 25%",
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

      <section id="history" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.historyTitle}</h2>
          <p className="mt-4 text-brand-black">{page.historyBody}</p>

          {timeline.length > 0 && (
            <ol className="mt-12 border-l-2 border-brand-silver/30 pl-8 sm:pl-10">
              {timeline.map((item: TimelineEvent, i: number) => (
                <li
                  key={item._key ?? `${item.date}-${i}`}
                  className="relative pb-10 last:pb-0"
                >
                  {/* Sits on the 2px rule: half the dot (8px) + half the border (1px). */}
                  <span
                    aria-hidden
                    className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-[3px] border-brand-white bg-brand-red sm:-left-[49px]"
                  />
                  <p className="font-display text-sm text-brand-red">{item.date}</p>
                  <h3 className="font-heading mt-1 text-lg font-bold text-brand-black">
                    {item.title}
                  </h3>
                  {item.detail && (
                    <p className="mt-1 max-w-2xl text-brand-silver">{item.detail}</p>
                  )}
                </li>
              ))}
            </ol>
          )}

          {page.historyNote && <p className="mt-8 text-sm text-brand-silver">{page.historyNote}</p>}
        </div>
      </section>

      <section id="advisory-board" className="scroll-mt-24 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.advisoryTitle}</h2>
          <p className="mt-4 text-brand-black">{page.advisoryBody}</p>
          {page.advisoryNote && <p className="mt-4 text-sm text-brand-silver">{page.advisoryNote}</p>}
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
