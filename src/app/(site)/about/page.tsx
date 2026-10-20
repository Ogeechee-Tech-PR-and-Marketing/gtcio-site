import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AboutTimeline from "@/components/AboutTimeline";
import type { TimelineEvent } from "@/components/AboutTimeline";
import PhotoGallery from "@/components/PhotoGallery";
import type { GalleryPhoto } from "@/components/PhotoGallery";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who GTCIO is: the mission, the history of the $27M training center in Statesboro, GA, its advisory board, and answers to common questions.",
  alternates: { canonical: "/about" },
};

type BoardMember = {
  name: string;
  title: string;
  organization: string;
  category: "board" | "exOfficio";
};

// DEFAULTS is this page's content — code-only, no CMS (PROJECT.md §4).
const DEFAULTS = {
  heroEyebrow: "About GTCIO",
  heroTitle: "Building Georgia's industrial workforce, together",
  heroDescription:
    "GTCIO exists to close the gap between the skills employers need and the training available to fill those roles.",
  missionStatement: "Building a workforce ready for industry transformation.",
  missionBody:
    "GTCIO trains people for jobs in industrial operations and automation, the employees that Georgia employers are actively seeking. These jobs pay well, and the demand isn't slowing down. GTCIO exists to meet that demand: training new workers coming up, and helping employers upskill the ones they already have.",
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
    "GTCIO's home is a new $27 million, 39,700-square-foot facility with capacity for nearly 460,000 hours of instruction a year. It exists because demand outpaced the room to meet it: Ogeechee Tech's industrial systems training was on pace to fill its existing building, and the college sits 32 miles from the Bryan County mega site, where the Hyundai electric-vehicle plant was projected to bring roughly 8,100 jobs to the region and nearby suppliers another 3,000. Skilled industrial systems and robotics technicians were already in shorter supply. The GTCIO was designed to address that shortage.\n\nA Georgia Southern University economic-impact study projects the center will generate $13.21 million in regional economic output in its first year in the new building, growing to $16.64 million by FY2035, the study's final year of analysis. The GTCIO serves credit students and incumbent workers alike, running customized workforce development for regional employers, and training and certifying instructors from across Georgia and the nation.",
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
      date: "March 2023",
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
      detail: "Ground is broken on the 39,700-square-foot facility.",
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
      date: "October 2, 2026",
      title: "Building handed over",
      detail: "The building is handed over to Ogeechee Tech, clearing the way for classes to move in.",
    },
    {
      date: "October 5, 2026",
      title: "Classes move into the new building",
      detail:
        "Industrial Operations Technology students begin classes in GTCIO's new building on AJ Riggs Road, ten days before the grand opening.",
    },
    {
      date: "October 15, 2026",
      title: "Grand opening",
      detail:
        "About 200 people fill the lobby as OTC opens the center with a ribbon cutting. TCSG Commissioner Greg Dozier, House Speaker Jon Burns, Sen. Billy Hickman, Rep. Lehman Franklin, and Development Authority of Bulloch County CEO Benjy Thompson join OTC President Lori Durden and OTC VP of Economic Development Jan Moore in marking the milestone.",
      highlight: true,
      sourceUrl:
        "https://www.ogeecheetech.edu/about/news/post/otc-unlocks-expanded-capacity-for-training-in-new-georgia-training-center-for-industrial-operations-",
    },
  ] satisfies TimelineEvent[],
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
  ] satisfies BoardMember[],
  galleryTitle: "Grand Opening",
  galleryBody:
    "State and local leaders, educators, and community partners filled the lobby on October 15, 2026, for the grand opening of the Georgia Training Center for Industrial Operations.",
  // First photo leads full-width; speakers are interleaved with audience shots so
  // no grid row is all podium. Speaker names from Jake; titles checked 2026-10-19
  // (Summers spells it "Micheal" on OTC's own board page).
  galleryPhotos: [
    {
      src: "/images/grand-opening/grand-opening-ribbon.jpg",
      alt: "State and local leaders, OTC staff, and community partners cut the ribbon outside the Georgia Training Center for Industrial Operations.",
    },
    {
      src: "/images/grand-opening/grand-opening-01.jpg",
      alt: 'A "Welcome to the Grand Opening" sign with a rendering of the building, set up in the GTCIO lobby.',
      position: "50% 30%",
    },
    {
      src: "/images/grand-opening/grand-opening-02.jpg",
      alt: "Two guests pose together in the lobby as visitors arrive for the grand opening.",
    },
    {
      src: "/images/grand-opening/grand-opening-03.jpg",
      alt: "The Statesboro High School band performs in front of the GTCIO sign in the lobby.",
    },
    {
      src: "/images/grand-opening/grand-opening-04.jpg",
      alt: "A packed lobby of guests faces the stage during the grand opening program.",
    },
    {
      src: "/images/grand-opening/grand-opening-05.jpg",
      alt: "Greg Dozier speaks at the podium during the grand opening program.",
      caption: "Greg Dozier, Commissioner of the Technical College System of Georgia",
    },
    {
      src: "/images/grand-opening/grand-opening-06.jpg",
      alt: "Sen. Billy Hickman speaks at the podium during the grand opening program.",
      caption: "Sen. Billy Hickman, Georgia State Senate, District 4",
    },
    {
      src: "/images/grand-opening/grand-opening-12.jpg",
      alt: "Guests at a lobby table smile and cheer during the program.",
    },
    {
      src: "/images/grand-opening/grand-opening-07.jpg",
      alt: "Jon Burns speaks at the podium during the grand opening program.",
      caption: "Jon Burns, Speaker of the Georgia House of Representatives",
      position: "50% 28%",
    },
    {
      src: "/images/grand-opening/grand-opening-08.jpg",
      alt: "Jan Moore speaks at the podium during the grand opening program.",
      caption: "Jan Moore, Vice President for Economic Development, Ogeechee Technical College",
      position: "50% 25%",
    },
    {
      src: "/images/grand-opening/grand-opening-13.jpg",
      alt: "Guests laugh together while listening to the program.",
    },
    {
      src: "/images/grand-opening/grand-opening-09.jpg",
      alt: "Micheal Summers speaks at the podium during the grand opening program.",
      caption: "Micheal Summers, Chair, Ogeechee Technical College Board of Directors",
    },
    {
      src: "/images/grand-opening/grand-opening-10.jpg",
      alt: "Benjy Thompson speaks at the podium during the grand opening program.",
      caption: "Benjy Thompson, CEO, Development Authority of Bulloch County",
    },
    {
      src: "/images/grand-opening/grand-opening-14.jpg",
      alt: "Guests embrace and mingle in the lobby during the grand opening.",
    },
    {
      src: "/images/grand-opening/grand-opening-11.jpg",
      alt: "Rep. Lehman Franklin speaks at the podium during the grand opening program.",
      caption: "Rep. Lehman Franklin, Georgia House of Representatives, District 160",
    },
    {
      src: "/images/grand-opening/grand-opening-15.jpg",
      alt: "Guests pose for a group photo outside the building’s main entrance.",
    },
  ] satisfies GalleryPhoto[],
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
        "The diploma program is open for enrollment now, with new students starting each semester. The IOT Diploma Program page has the curriculum, the jobs it leads to, the pay to expect, and how to apply.",
    },
    {
      question: "Where is GTCIO located?",
      answer:
        "GTCIO's new home is at 66 AJ Riggs Road, Statesboro, GA 30458. Students began classes in the new building on October 5, 2026, and the center held its grand opening on October 15, 2026. The Facility page has more about the building.",
    },
  ],
};

export default function AboutPage() {
  const page = DEFAULTS;
  const boardMembers = page.advisoryMembers.filter((m) => m.category !== "exOfficio");
  const exOfficioMembers = page.advisoryMembers.filter((m) => m.category === "exOfficio");

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        video="/videos/hero-about-3.mp4"
        videoPoster="/images/hero-about-poster.jpg"
      />

      <section id="mission" className="scroll-mt-52 sm:scroll-mt-60 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">Mission</h2>
          {page.missionStatement && (
            <p className="font-display mt-4 text-3xl leading-tight text-brand-black sm:text-4xl">
              {page.missionStatement}
            </p>
          )}
          <p className="mt-6 text-brand-black">{page.missionBody}</p>
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg italic text-brand-black">&ldquo;{page.missionQuote}&rdquo;</p>
            <p className="mt-3 text-sm text-brand-gray">{page.missionQuoteAttribution}</p>
          </blockquote>
        </div>
      </section>

      <section id="history" className="scroll-mt-52 sm:scroll-mt-60 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.historyTitle}</h2>
          {page.historyBody.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mt-4 text-brand-black">{paragraph}</p>
          ))}

          <AboutTimeline items={page.historyTimeline} />
        </div>
      </section>

      <section id="advisory-board" className="scroll-mt-52 sm:scroll-mt-60 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.advisoryTitle}</h2>
          <p className="mt-4 text-brand-black">{page.advisoryBody}</p>

          <div className="mt-10">
            <h3 className="font-heading text-sm font-bold tracking-wide text-brand-gray uppercase">
              Board Members
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {boardMembers.map((member) => (
                <div key={member.name} className="border-l-4 border-brand-red pl-4">
                  <p className="font-heading font-bold text-brand-black">{member.name}</p>
                  <p className="text-sm text-brand-gray">{member.title}</p>
                  <p className="text-sm text-brand-gray">{member.organization}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="font-heading text-sm font-bold tracking-wide text-brand-gray uppercase">
              Ex Officio
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {exOfficioMembers.map((member) => (
                <div key={member.name} className="border-l-4 border-brand-black pl-4">
                  <p className="font-heading font-bold text-brand-black">{member.name}</p>
                  <p className="text-sm text-brand-gray">{member.title}</p>
                  <p className="text-sm text-brand-gray">{member.organization}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="bulloch-development-authority" className="scroll-mt-52 sm:scroll-mt-60 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.bdaTitle}</h2>
          <p className="mt-4 text-brand-black">{page.bdaBody}</p>
          <blockquote className="mt-6 border-l-4 border-brand-black pl-5">
            <p className="text-lg italic text-brand-black">&ldquo;{page.bdaQuote}&rdquo;</p>
            <p className="mt-3 text-sm text-brand-gray">{page.bdaQuoteAttribution}</p>
          </blockquote>
          <a
            href={page.bdaWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui mt-6 inline-block bg-brand-red px-5 py-2.5 text-xs font-bold tracking-widest text-brand-white transition-colors hover:bg-brand-black"
          >
            LEARN MORE
          </a>
        </div>
      </section>

      <section id="grand-opening" className="scroll-mt-52 sm:scroll-mt-60 border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">{page.galleryTitle}</h2>
          <p className="mt-4 text-brand-black">{page.galleryBody}</p>
          <div className="mt-8">
            <PhotoGallery photos={page.galleryPhotos} />
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-52 sm:scroll-mt-60 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-brand-red">FAQ</h2>
          <div className="mt-6 flex flex-col gap-6">
            {page.faqs.map((item) => (
              <div key={item.question} className="border-l-4 border-brand-black pl-5">
                <p className="font-heading font-bold text-brand-black">{item.question}</p>
                <p className="mt-1 text-brand-gray">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
