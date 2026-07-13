import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Partners | GTCIO",
};

const PATHWAYS = [
  {
    title: "Hire Our Graduates",
    description: "Access a pipeline of technicians trained in maintenance, automation, and industrial operations.",
  },
  {
    title: "Sponsor Equipment",
    description: "Invest in the machinery and robotics students train on, and put your company's name on the tools that build careers.",
  },
  {
    title: "Sponsor a Robot",
    description: "Put your company's name on a specific piece of automation equipment. It's a hands-on, high-visibility way to support the program.",
  },
  {
    title: "Host a Facility Tour",
    description: "Bring your team through GTCIO's facility to see the training firsthand and meet future hires.",
  },
  {
    title: "Curriculum Advisory Board",
    description: "Help shape what we teach so graduates arrive ready for the equipment and processes your industry actually uses.",
  },
];

const DIRECTORY = [
  { name: "Development Authority of Bulloch County", description: "Supported development of GTCIO's $27 million training facility." },
  { name: "Koyo Bearings", description: "Manufacturer of precision bearings for heavy industrial machinery." },
  { name: "Georgia Power", description: "Utility provider for energy infrastructure and maintenance." },
  { name: "Ajin Georgia", description: "Automotive parts manufacturer with a strong regional maintenance and automation footprint." },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Bridges to industry"
        description="GTCIO's training only works when it's built alongside the employers who'll hire our graduates. Here's how to get involved."
      />

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-brand-black">
            Whether you want to hire our graduates, put your name on the equipment students train
            on, or help write the curriculum, there's a partnership pathway built for it.
          </p>
          <Button href="#become-a-partner" variant="primary" className="shrink-0">
            HOW TO BECOME A PARTNER
          </Button>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">Partnership Pathways</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PATHWAYS.map((p) => (
              <div key={p.title} className="flex flex-col justify-between border border-brand-silver/40 p-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-red">{p.title}</h3>
                  <p className="mt-2 text-sm text-brand-silver">{p.description}</p>
                </div>
                <a
                  href="#become-a-partner"
                  className="font-heading mt-6 inline-block text-sm font-bold tracking-wide text-brand-black hover:text-brand-red"
                >
                  Get Started →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">Our Partners</h2>
          <p className="mt-3 max-w-2xl text-brand-silver">
            Confirmed and prospective partners. Logos and additional quotes will be added as
            they're provided.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTORY.map((partner) => (
              <div key={partner.name} className="border border-dashed border-brand-silver/60 p-6">
                <div className="font-heading flex h-16 items-center text-lg font-bold text-brand-silver">
                  {partner.name}
                </div>
                <p className="mt-2 text-sm text-brand-silver">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="become-a-partner" className="scroll-mt-24 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">Become a Partner</h2>
          <p className="mt-3 text-brand-silver">
            Tell us a bit about your organization and which pathway interests you, and we'll
            follow up to talk next steps.
          </p>
          <div className="mt-8">
            <InquiryForm
              fields={[
                { name: "firstName", label: "First Name", required: true },
                { name: "lastName", label: "Last Name", required: true },
                { name: "company", label: "Company Name", required: true, halfWidth: false },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "phone", label: "Phone Number", type: "tel" },
                { name: "message", label: "Message", type: "textarea", halfWidth: false },
              ]}
              submitLabel="SUBMIT INQUIRY"
            />
          </div>
        </div>
      </section>
    </>
  );
}
