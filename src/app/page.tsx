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
    description: "Hire skilled graduates, upskill your current team, or shape the curriculum we teach.",
    href: "/training",
    cta: "See Training for Employers",
  },
  {
    title: "Partners",
    description: "Sponsor equipment, host tours, or join the advisory board building Georgia's industrial workforce.",
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
            the maintenance, automation, and controls skills that keep factories, utilities, and
            logistics centers running. The Industrial Operations Technology diploma program enrolls
            now for its August 2026 launch.
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
            Beyond factories, the maintenance and automation skills taught at GTCIO transfer into
            facilities management, utilities, and logistics — anywhere with equipment that has to
            keep running. Students build a foundation in mechanical, electrical, hydraulic, and
            pneumatic systems, then advance into robotics, PLCs, and smart automation — graduating
            with a diploma and the option to earn globally recognized SACA certification alongside
            it. Whether you&apos;re a student building a career or a business building a workforce,
            there&apos;s a path here for you.
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
