import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Training | GTCIO",
};

const EMPLOYER_FAQS = [
  { q: "What are graduates trained in?", a: "Maintenance, electrical/controls, PLCs, precision measurement, and preventive maintenance on real industrial equipment." },
  { q: "What's the value proposition for my business?", a: "A pipeline of work-ready technicians, plus custom training for your existing staff, trained on equipment similar to what you run." },
  { q: "How long does custom training take?", a: "Depends on scope — placeholder, to be scoped per engagement." },
  { q: "How much does it cost?", a: "Depends on scope — placeholder, to be scoped per engagement." },
];

export default function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Training"
        title="Two audiences, one goal: a workforce that's ready"
        description="GTCIO trains individual students building a career, and works directly with employers to train and upskill their teams."
      />

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="border border-brand-silver/40 p-8">
            <h2 className="font-heading text-2xl font-bold text-brand-red">For Students</h2>
            <p className="mt-4 text-brand-silver">
              A hands-on career path into Industrial Operations Technology — see the IOT Diploma
              Program for jobs, pay, timeline, and cost.
            </p>
            <div className="mt-6">
              <Button href="/iot-diploma-program" variant="outline">EXPLORE THE PROGRAM</Button>
            </div>
          </div>
          <div className="border border-brand-silver/40 p-8">
            <h2 className="font-heading text-2xl font-bold text-brand-red">For Employers</h2>
            <p className="mt-4 text-brand-silver">
              Custom training for your current staff, built around your equipment and processes —
              reducing downtime and building internal maintenance capability. GTCIO also serves as
              an instructional training and certification site for instructors from across Georgia
              and the nation.
            </p>
            <div className="mt-6">
              <Button href="/contact" variant="outline">TALK TO US</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Employer FAQ</h2>
          <div className="mt-6 flex flex-col gap-6">
            {EMPLOYER_FAQS.map((item) => (
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
