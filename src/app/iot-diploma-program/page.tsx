import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "IOT Diploma Program | GTCIO",
};

const CURRICULUM_STAGES = [
  {
    stage: "Foundation",
    detail: "Mechanical, electrical, hydraulic, and pneumatic systems.",
  },
  {
    stage: "Advanced",
    detail: "Robotics, programmable logic controllers (PLCs), automation controls, smart sensors, industrial wiring, and motor controls.",
  },
  {
    stage: "Credential",
    detail: "Graduate with a diploma, plus the option to add a Smart Automation Certification Alliance (SACA) credential on top of it.",
  },
];

const PROGRAM_OPTIONS = [
  { name: "Industrial Operations Technology Diploma", code: "IS32", detail: "The full program." },
  { name: "Certificate — Electrical/Mechanical", detail: "Focused on the electrical and mechanical side of the curriculum." },
  { name: "Certificate — PLC", detail: "Focused on programmable logic controllers." },
  { name: "Certificate — Robotics", detail: "Focused on robotics." },
];

const CAREERS = [
  "Industrial Maintenance Technician",
  "Operations Technician",
  "Automation & Controls Specialist",
];

const JOB_DUTIES = [
  "Fixing things that break — diagnosing a problem by watching a machine run, then replacing the bad part: motors, conveyors, transmissions, pumps, hydraulic and pneumatic systems.",
  "Preventing things from breaking — scheduled inspections, lubrication, and adjustments make up a huge share of the actual job, not just emergency repairs.",
  "Electrical and controls work — AC/DC circuit troubleshooting, industrial wiring, motor controls, and programming/troubleshooting PLCs, the \"brains\" behind automated equipment.",
  "Reading blueprints and schematics to understand how a machine goes together or how a system is wired.",
  "Precision measurement and adjustment — checking part dimensions with calipers and gauges, calibrating equipment, running metalworking machines to make replacement fittings.",
  "Paperwork — writing maintenance reports, logging downtime and repairs, tracking parts inventory.",
];

const PAY_RANGES = [
  { tier: "Entry-Level / Operator", range: "Mid-$30ks to low-$40ks" },
  { tier: "Working Technician (a few years in)", range: "$55k – $70k" },
  { tier: "Specialists & Supervisors", range: "$80k – $100k+" },
];

const FAQS = [
  { q: "When does the program start?", a: "The Industrial Operations Technology diploma program launches in August 2026." },
  { q: "How much can I expect to earn after graduating?", a: "See the pay ranges below — most graduates start in entry-level/operator roles and grow from there." },
  { q: "What credential do I earn?", a: "A college diploma, plus the option to add a SACA (Smart Automation Certification Alliance) credential — it's recognized industry-wide, not just in Georgia." },
  { q: "How much does the program cost?", a: "Placeholder — final tuition figure pending confirmation." },
  { q: "How long does it take to finish?", a: "Placeholder — final program length pending confirmation." },
  { q: "Is this an online program?", a: "No — it's in-person, day classes. This is hands-on work, so you need to be in the shop." },
];

export default function IotDiplomaProgramPage() {
  return (
    <>
      <PageHero
        eyebrow="IOT Diploma Program — Enrolling now for August 2026"
        title="What is Industrial Operations Technology?"
        description="In plain English: it's the training behind keeping factories, utilities, and logistics centers running — make things work, keep them working."
        image="/images/hero-iot-program.jpg"
        imageAlt="Engineer inspecting an industrial engine"
      />

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">What is Industrial Operations Technology?</h2>
          <div className="mt-6 flex aspect-video items-center justify-center border border-dashed border-brand-silver/60 text-center">
            <p className="font-heading text-sm font-bold tracking-wide text-brand-silver">
              VIDEO PLACEHOLDER
              <br />
              &quot;What&apos;s Industrial Operations Technology?&quot; (~3 min)
            </p>
          </div>
          <p className="mt-6 max-w-3xl text-brand-silver">
            These same skills apply well outside a factory. Facilities management — office
            buildings, apartment complexes, schools, hospitals — needs people who can keep
            equipment running, and so do utilities, warehouses, and distribution centers.
          </p>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Curriculum &amp; credentials</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {CURRICULUM_STAGES.map((stage, i) => (
              <div key={stage.stage} className="border border-brand-silver/40 p-6">
                <p className="font-display text-sm text-brand-gold">Stage {i + 1}</p>
                <h3 className="font-heading mt-2 text-lg font-bold text-brand-black">{stage.stage}</h3>
                <p className="mt-2 text-sm text-brand-silver">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">More than one way in</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">
            The diploma isn&apos;t the only option. OTC also breaks the same curriculum into three
            standalone certificates, so you can start smaller — or focus on just the part of the job
            you&apos;re after.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PROGRAM_OPTIONS.map((option) => (
              <div key={option.name} className="border border-brand-silver/40 p-5">
                <p className="font-bold text-brand-black">
                  {option.name}
                  {option.code && <span className="text-brand-silver"> ({option.code})</span>}
                </p>
                <p className="mt-1 text-sm text-brand-silver">{option.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Careers this prepares you for</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {CAREERS.map((career) => (
              <span
                key={career}
                className="font-heading border-2 border-brand-red px-4 py-2 text-sm font-bold tracking-wide text-brand-red"
              >
                {career}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-brand-silver">
            Stick with it and there&apos;s room to move up — into production supervisor or
            operations manager roles.
          </p>
          <h3 className="font-heading mt-10 text-xl font-bold text-brand-black">What the job looks like</h3>
          <ul className="mt-6 flex flex-col gap-4">
            {JOB_DUTIES.map((duty) => (
              <li key={duty} className="border-l-4 border-brand-red pl-5 text-brand-black">
                {duty}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Jobs &amp; pay after graduation</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PAY_RANGES.map((tier) => (
              <div key={tier.tier} className="border border-brand-silver/40 p-6">
                <p className="font-heading text-2xl font-bold text-brand-red">{tier.range}</p>
                <p className="mt-2 text-sm text-brand-silver">{tier.tier}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-brand-silver/40 p-6">
              <p className="font-heading font-bold text-brand-black">Time to complete</p>
              <p className="mt-1 text-brand-silver">Placeholder — final program length pending confirmation.</p>
            </div>
            <div className="border border-brand-silver/40 p-6">
              <p className="font-heading font-bold text-brand-black">Approximate cost</p>
              <p className="mt-1 text-brand-silver">Placeholder — final tuition figure pending confirmation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Student FAQ</h2>
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

      <section id="apply" className="scroll-mt-24 bg-brand-black px-6 py-20 text-center text-brand-white sm:px-10">
        <h2 className="font-heading text-3xl font-bold">Sign up today, and we&apos;ll see you here!</h2>
        <div className="mt-8">
          <Button href="https://www.ogeecheetech.edu/IOT" variant="primary">APPLY NOW</Button>
        </div>
      </section>
    </>
  );
}
