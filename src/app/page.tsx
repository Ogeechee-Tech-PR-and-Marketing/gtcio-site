import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";

const PATHWAYS = [
  {
    title: "Students",
    description: "Earn a diploma built around hands-on work with real industrial equipment, not just theory.",
    href: "/iot-diploma-program",
    cta: "Explore the IOT Diploma Program",
  },
  {
    title: "Employers",
    description: "Need to hire skilled graduates or upskill the crew you've already got? GTCIO can help with both.",
    href: "/training",
    cta: "See Training for Employers",
  },
  {
    title: "Partners",
    description: "Equipment sponsorships, facility tours, a seat on the advisory board — there's more than one way in.",
    href: "/partners",
    cta: "Become a Partner",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-black px-6 py-24 text-brand-white sm:px-10 sm:py-32">
        <Image
          src="/images/hero-robotic-arm.jpg"
          alt="Industrial robotic arm on an automated assembly line"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-black/70" />
        <div className="relative mx-auto max-w-5xl">
          <p className="font-display mb-4 text-sm text-brand-gold">
            Georgia Training Center for Industrial Operations
          </p>
          <h1 className="font-display text-5xl leading-tight sm:text-6xl">
            Make things work.
            <br />
            Keep them working.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-silver">
            GTCIO trains Georgia&apos;s workforce for careers in Industrial Operations Technology —
            the people who keep factories, utilities, and logistics centers running when
            something breaks or a line goes down. The diploma program opens for enrollment now,
            ahead of its August 2026 launch.
          </p>
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
          <h2 className="font-heading text-3xl font-bold text-brand-black">Training the next generation</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">
            These skills carry well past the factory floor — into facilities management, utilities,
            and logistics, anywhere equipment has to keep running. Students start with the
            fundamentals: mechanical, electrical, hydraulic, and pneumatic systems. From there it&apos;s
            robotics, PLCs, and smart automation, with the option to add a SACA credential to the
            diploma along the way.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PATHWAYS.map((p) => (
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
