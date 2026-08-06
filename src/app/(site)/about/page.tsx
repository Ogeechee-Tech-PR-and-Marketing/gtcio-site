import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AboutTimeline from "@/components/AboutTimeline";
import { sanityFetch } from "@/sanity/lib/live";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, resolveHeroVideo, type SanityImage } from "@/sanity/lib/image";
import { safeHref } from "@/sanity/lib/links";

export const metadata: Metadata = {
  title: "About | GTCIO",
};

// ⚠️ CMS values override these defaults once a field is set on the Sanity doc —
// editing this object alone does NOT change the live site. Patch the published
// doc (and any draft of it) too. PROJECT.md §4, trap 6 has the how.
const DEFAULTS = {
  heroEyebrow: "About GTCIO",
  heroTitle: "Building Georgia's industrial workforce, together",
  heroDescription:
    "GTCIO exists to close the gap between the skills employers need and the training available to fill those roles.",
  missionStatement: "Building a workforce ready for industry transformation.",
  missionBody:
    "GTCIO trains people for jobs in industrial operations and automation, the employees that Georgia employers are actively seeking. These jobs pay well, and the demand isn't slowing down. GTCIO exists to meet that demand: training new workers coming up, and helping employers upskill the ones they already have.",
  missionNote: "",
  missionQuote:
    "We are surrounded by industries that are looking for employees with these skill sets. The jobs pay well, offer excellent career growth opportunities, and the demand continues to increase.",
  missionQuoteAttribution: "Jan Moore — Vice President for Economic Development, Ogeechee Technical College",
  bdaTitle: "Development Authority of Bulloch County",
  bdaBody:
    "The Development Authority of Bulloch County deeded the land GTCIO sits on to the Technical College System of Georgia, and Bulloch County's Board of Commissioners funded the project's initial site design, an economic-impact study, and an access road from Highway 301 — the local backing that turned GTCIO from an idea into a funded state capital project.",
  bdaQuote:
    "I cannot stress enough what an asset this will be for Bulloch County and the surrounding region. The training will range from foundational skills in industrial operations to that of an automation engineer. Finding that under one roof is almost unheard of. It will be life changing for many of our residents.",
  bdaQuoteAttribution: "Benjy Thompson — CEO, Development Authority of Bulloch County",
  bdaWebsite: "https://advantagebulloch.com/",
  historyTitle: "History",
  historyBody:
    "GTCIO's home is a new $27 million, 40,000-square-foot facility with capacity for nearly 460,000 hours of instruction a year. It exists because demand outpaced the room to meet it: Ogeechee Tech's industrial systems training was on pace to fill its existing building, and the college sits 32 miles from the Bryan County mega site, where the Hyundai electric-vehicle plant was projected to bring roughly 8,100 jobs to the region and nearby suppliers another 3,000. Skilled industrial systems and robotics technicians were already in shorter supply. The GTCIO was designed to address that shortage.\n\nA Georgia Southern University economic-impact study projects the center will generate $13.21 million in regional economic output in its first year in the new building, growing to $16.64 million by FY2035, the study's final year of analysis. The GTCIO serves credit students and incumbent workers alike, running customized workforce development for regional employers, and training and certifying instructors from across Georgia and the nation.",
  historyTimeline: [
    {
      date: "September 2021",
      title: "County commissioners support project",
      detail:
        "Bulloch County commissioners vote to seek funding for the project — the earliest public step toward what became GTCIO.",
      sourceUrl:
        "https://www.ogeecheetech.edu/about/news/post/commissioners-otc-to-build-new-training-facility",
    },
    {
      date: "July 2022",
      title: "The push for funding begins",
      detail:
        "Work kicks off to fund the project, including a pledge to donate the land from the Development Authority of Bulloch County.",
    },
    {
      date: "September 2022",
      title: "Initial funding approved",
      detail:
        "The Technical College System of Georgia's state board approves the project on its FY24 capital outlay list, clearing the way from idea to plan.",
    },
    {
      date: "June 2023",
      title: "State budget funds the project",
      detail:
        "Governor Brian Kemp signs the project's construction funding into Georgia's amended FY23 budget.",
      sourceUrl:
        "https://www.ogeecheetech.edu/about/news/post/ogeechee-technical-college-announces-development-of-state-of-the-art-industrial-systems-industrial-robotics-training-center",
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
        "Design work starts on a building meant to triple Ogeechee Tech's industrial systems and robotics training capacity, to anchor training for the wider region, and to serve as a model other technical colleges in Georgia can replicate.",
    },
    {
      date: "November 2024",
      title: "Groundbreaking ceremony",
      detail:
        "OTC breaks ground on the facility, a project built in partnership with Bulloch County and the Development Authority of Bulloch County.",
      sourceUrl:
        "https://www.ogeecheetech.edu/about/news/post/otc-breaks-ground-on-37-000-sq-ft-industrial-systems-robotics-facility",
    },
    {
      date: "June 2025",
      title: "Construction begins",
      detail: "Ground is broken on the 40,000-square-foot facility.",
    },
    {
      date: "December 2025",
      title: "Beam signing ceremony",
      detail:
        "OTC faculty and staff, joined by design and construction partners PRAXIS3, ICB, LS3P, and Buro Happold, sign one of the last beams to be installed in the building during the college's Fall Professional Development Day.",
      sourceUrl:
        "https://www.ogeecheetech.edu/about/news/post/intimate-beam-signing-ceremony-marks-progress-for-new-robotics-building",
    },
    {
      date: "August 2026",
      title: "First classes begin",
      detail:
        "The Industrial Operations Technology diploma program launches in the Industrial Technology Building on Ogeechee Tech's main campus, the college's existing industrial operations training facility, while the new building is finished.",
      highlight: true,
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
      highlight: true,
    },
  ],
  historyNote: "",
  advisoryTitle: "Advisory Board",
  advisoryBody:
    "GTCIO's curriculum is shaped by an advisory board of regional employers and industry leaders, so what we teach stays aligned with the equipment and skills the workforce actually needs.",
  advisoryMembers: [
    {
      name: "Jan Moore",
      title: "Board Chair and Vice President for Economic Development",
      organization: "Ogeechee Technical College",
      category: "board",
    },
    {
      name: "Daniel Cox",
      title: "Professor and Founding Chair of Manufacturing Engineering",
      organization: "Georgia Southern University",
      category: "board",
    },
    {
      name: "Tramaine Melvin",
      title: "Manufacturing Production Manager",
      organization: "JTEKT",
      category: "board",
    },
    {
      name: "Stuart Gregory",
      title: "Director of Business Development",
      organization: "Shalotek",
      category: "board",
    },
    {
      name: "Sandy Lake",
      title: "Director of Logistics",
      organization: "Georgia Center of Innovation",
      category: "board",
    },
    {
      name: "Rob Lanham",
      title: "General Manager",
      organization: "Silver Lake Automation",
      category: "board",
    },
    {
      name: "Kent Powell",
      title: "Vice President of Sales",
      organization: "Amatrol",
      category: "board",
    },
    {
      name: "David Rogers",
      title: "CEO",
      organization: "Georgia Technologies",
      category: "board",
    },
    {
      name: "Jim Wall",
      title: "Executive Director",
      organization: "Smart Automation Certification Alliance",
      category: "board",
    },
    {
      name: "Lori Durden",
      title: "President",
      organization: "Ogeechee Technical College",
      category: "exOfficio",
    },
    {
      name: "Matt Dollar",
      title: "Deputy Commissioner — Economic Development",
      organization: "Technical College System of Georgia",
      category: "exOfficio",
    },
    {
      name: "Billy Hickman",
      title: "Georgia State Senator, District 4",
      organization: "Georgia General Assembly",
      category: "exOfficio",
    },
    {
      name: "Lehman Franklin",
      title: "Georgia State Representative, District 160",
      organization: "Georgia General Assembly",
      category: "exOfficio",
    },
    {
      name: "Doug Lambert",
      title: "Board Member",
      organization: "Technical College System of Georgia State Board",
      category: "exOfficio",
    },
    {
      name: "Benjy Thompson",
      title: "CEO",
      organization: "Development Authority of Bulloch County",
      category: "exOfficio",
    },
  ],
  advisoryNote: "",
  faqs: [
    {
      question: "Who runs GTCIO?",
      answer:
        "GTCIO is a division of Ogeechee Technical College, part of the Technical College System of Georgia. Ogeechee Tech already delivers the system's most comprehensive noncredit industrial systems and robotics training, and it runs the center as a regional resource rather than a single college's building: it partnered with Southeastern Technical College so manufacturers across both service areas can use it instead of duplicating facilities.",
    },
    {
      question: "Is GTCIO only for students?",
      answer:
        "No. Three groups use it. Students earn the Industrial Operations Technology diploma. Employers send the staff they already have for short courses, customized contract training, and DOL-registered apprenticeships. And instructors come from across Georgia and the nation to be trained and certified — Ogeechee Tech is a SACA Regional Instructor Training Center.",
    },
    {
      question: "When does the Industrial Operations Technology program start?",
      answer:
        "The diploma program launches in August 2026 and is open for enrollment now. The IOT Diploma Program page has the curriculum, the jobs it leads to, the pay to expect, and how to apply.",
    },
    {
      question: "Where is GTCIO located?",
      answer:
        "GTCIO's new home is at 66 AJ Riggs Road, Statesboro, GA 30458. Until it opens — the ribbon cutting is October 15, 2026 — classes are held in the Industrial Technology Building on Ogeechee Tech's main campus. The Facility page has more about the building.",
    },
  ],
};

type TimelineEvent = {
  _key?: string;
  date: string;
  title: string;
  detail?: string;
  highlight?: boolean;
  sourceUrl?: string;
};

type BoardMember = {
  _key?: string;
  name: string;
  title: string;
  organization: string;
  category: "board" | "exOfficio";
};

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: ABOUT_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroImage?: SanityImage;
    heroImageAlt?: string;
    heroVideo?: { asset?: { url?: string } | null };
    heroVideoPoster?: SanityImage;
    historyTimeline?: TimelineEvent[];
    advisoryMembers?: BoardMember[];
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const faqs = typed?.faqs?.length ? typed.faqs : DEFAULTS.faqs;
  const timeline: TimelineEvent[] = typed?.historyTimeline?.length
    ? typed.historyTimeline
    : DEFAULTS.historyTimeline;
  const advisoryMembers: BoardMember[] = typed?.advisoryMembers?.length
    ? typed.advisoryMembers
    : (DEFAULTS.advisoryMembers as BoardMember[]);
  const boardMembers = advisoryMembers.filter((m) => m.category !== "exOfficio");
  const exOfficioMembers = advisoryMembers.filter((m) => m.category === "exOfficio");
  const bdaWebsite = safeHref(page.bdaWebsite);

  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-about.jpg",
    fallbackAlt: "Engineer working with a robotic arm",
    fallbackPosition: "61% 25%",
  });

  // The banner plays GTCIO's own footage of the robotics lab. An editor can
  // override it by uploading a Background photo in the Studio — otherwise that
  // field would silently do nothing, which the schema description promises it
  // won't. The fallback position above is tuned for the stock photo, so it is
  // deliberately not applied to the video (centred is right for the robot).
  // Absent a photo, an uploaded Background video replaces the default footage.
  const useVideo = !typed?.heroImage;
  const heroVideo = resolveHeroVideo({
    video: typed?.heroVideo,
    poster: typed?.heroVideoPoster,
    fallbackSrc: "/videos/hero-about-2.mp4",
    fallbackPoster: "/images/hero-about-poster.jpg",
  });

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        image={hero.src}
        imageAlt={hero.alt}
        imagePosition={useVideo ? undefined : hero.position}
        video={useVideo ? heroVideo.src : undefined}
        videoPoster={useVideo ? heroVideo.poster : undefined}
      />

      <section id="mission" className="scroll-mt-40 sm:scroll-mt-56 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">Mission</h2>
          {page.missionStatement && (
            <p className="font-display mt-4 text-3xl leading-tight text-brand-black sm:text-4xl">
              {page.missionStatement}
            </p>
          )}
          <p className="mt-6 text-brand-black">{page.missionBody}</p>
          {page.missionNote && <p className="mt-4 text-sm text-brand-silver">{page.missionNote}</p>}
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg italic text-brand-black">&ldquo;{page.missionQuote}&rdquo;</p>
            <p className="mt-3 text-sm text-brand-silver">{page.missionQuoteAttribution}</p>
          </blockquote>
        </div>
      </section>

      <section id="history" className="scroll-mt-40 sm:scroll-mt-56 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.historyTitle}</h2>
          {page.historyBody.split("\n\n").map((paragraph: string, i: number) => (
            <p key={i} className="mt-4 text-brand-black">{paragraph}</p>
          ))}

          {timeline.length > 0 && <AboutTimeline items={timeline} />}

          {page.historyNote && <p className="mt-8 text-sm text-brand-silver">{page.historyNote}</p>}
        </div>
      </section>

      <section id="advisory-board" className="scroll-mt-40 sm:scroll-mt-56 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.advisoryTitle}</h2>
          <p className="mt-4 text-brand-black">{page.advisoryBody}</p>

          {boardMembers.length > 0 && (
            <div className="mt-10">
              <h3 className="font-heading text-sm font-bold tracking-wide text-brand-silver uppercase">
                Board Members
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {boardMembers.map((member, i) => (
                  <div key={member._key ?? i} className="border-l-4 border-brand-red pl-4">
                    <p className="font-heading font-bold text-brand-black">{member.name}</p>
                    <p className="text-sm text-brand-silver">{member.title}</p>
                    <p className="text-sm text-brand-silver">{member.organization}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {exOfficioMembers.length > 0 && (
            <div className="mt-10">
              <h3 className="font-heading text-sm font-bold tracking-wide text-brand-silver uppercase">
                Ex Officio
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {exOfficioMembers.map((member, i) => (
                  <div key={member._key ?? i} className="border-l-4 border-brand-black pl-4">
                    <p className="font-heading font-bold text-brand-black">{member.name}</p>
                    <p className="text-sm text-brand-silver">{member.title}</p>
                    <p className="text-sm text-brand-silver">{member.organization}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page.advisoryNote && <p className="mt-8 text-sm text-brand-silver">{page.advisoryNote}</p>}
        </div>
      </section>

      <section id="bulloch-development-authority" className="scroll-mt-40 sm:scroll-mt-56 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.bdaTitle}</h2>
          <p className="mt-4 text-brand-black">{page.bdaBody}</p>
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg italic text-brand-black">&ldquo;{page.bdaQuote}&rdquo;</p>
            <p className="mt-3 text-sm text-brand-silver">{page.bdaQuoteAttribution}</p>
          </blockquote>
          {bdaWebsite && (
            <a
              href={bdaWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui mt-6 inline-block bg-brand-red px-5 py-2.5 text-xs font-bold tracking-widest text-brand-white transition-colors hover:bg-brand-black"
            >
              LEARN MORE
            </a>
          )}
        </div>
      </section>

      <section id="faq" className="scroll-mt-40 sm:scroll-mt-56 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">FAQ</h2>
          <div className="mt-6 flex flex-col gap-6">
            {faqs.map((item: { question: string; answer: string }, i: number) => (
              <div key={i} className="border-l-4 border-brand-black pl-5">
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
