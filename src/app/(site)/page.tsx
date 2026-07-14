import Button from "@/components/Button";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";

const DEFAULTS = {
  heroEyebrow: "Georgia Training Center for Industrial Operations",
  heroTitle: "Make things work.\nKeep them working.",
  heroDescription:
    "GTCIO trains Georgia's workforce for careers in Industrial Operations Technology. These are the people who keep factories, utilities, and logistics centers running when something breaks or a line goes down. The diploma program opens for enrollment now, ahead of its August 2026 launch.",
  sectionTitle: "Training the next generation",
  sectionBody:
    "These skills carry well past the factory floor, into facilities management, utilities, and logistics, anywhere equipment has to keep running. Students start with the fundamentals: mechanical, electrical, hydraulic, and pneumatic systems. From there it's robotics, PLCs, and smart automation, with the option to add a SACA credential to the diploma along the way.",
  studentsCard: {
    title: "Students",
    description: "Earn a diploma built around hands-on work with real industrial equipment, not just theory.",
  },
  employersCard: {
    title: "Employers",
    description: "Need to hire skilled graduates or upskill the crew you've already got? GTCIO can help with both.",
  },
  partnersCard: {
    title: "Partners",
    description: "Equipment sponsorships, facility tours, a seat on the advisory board: there's more than one way in.",
  },
};

export default async function Home() {
  const { data } = await sanityFetch({ query: HOME_PAGE_QUERY });
  const page = { ...DEFAULTS, ...(data as Partial<typeof DEFAULTS>) };

  const pathways = [
    { ...DEFAULTS.studentsCard, ...page.studentsCard, href: "/iot-diploma-program", cta: "Explore the IOT Diploma Program" },
    { ...DEFAULTS.employersCard, ...page.employersCard, href: "/training", cta: "See Training for Employers" },
    { ...DEFAULTS.partnersCard, ...page.partnersCard, href: "/partners", cta: "Become a Partner" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-brand-black px-6 py-24 text-brand-white sm:px-10 sm:py-32">
        <video
          src="/videos/hero-construction.mp4"
          poster="/images/hero-construction-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-black/70" />
        <div className="relative mx-auto max-w-5xl">
          <p className="font-display mb-4 text-sm text-brand-gold">{page.heroEyebrow}</p>
          <h1 className="font-display text-5xl leading-tight sm:text-6xl">
            {page.heroTitle.split("\n").map((line: string, i: number, arr: string[]) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-silver">{page.heroDescription}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/iot-diploma-program" variant="primary">IOT DIPLOMA PROGRAM</Button>
            <Button href="/facility#book-a-tour" variant="outline" className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-black">
              BOOK A TOUR
            </Button>
            <Button href="/partners#become-a-partner" variant="outline" className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-black">
              BECOME A PARTNER
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.sectionTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.sectionBody}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {pathways.map((p) => (
              <div key={p.title} className="flex flex-col justify-between border border-brand-silver/40 p-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-brand-black">{p.title}</h3>
                  <p className="mt-2 text-sm text-brand-silver">{p.description}</p>
                </div>
                <Link
                  href={p.href}
                  className="font-heading mt-6 inline-block text-sm font-bold tracking-wide text-brand-red hover:text-brand-black"
                >
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
