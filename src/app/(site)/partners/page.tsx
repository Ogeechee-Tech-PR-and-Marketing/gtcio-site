import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import InquiryForm from "@/components/InquiryForm";
import { sanityFetch } from "@/sanity/lib/live";
import { PARTNERS_PAGE_QUERY } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Partners | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "Partners",
  heroTitle: "Bridges to industry",
  heroDescription:
    "GTCIO's training only works when it's built alongside the employers who'll hire our graduates. Here's how to get involved.",
  introText:
    "Whether you want to hire our graduates, put your name on the equipment students train on, or help write the curriculum, there's a partnership pathway built for it.",
  pathwaysTitle: "Partnership Pathways",
  pathways: [
    { title: "Hire Our Graduates", description: "Access a pipeline of technicians trained in maintenance, automation, and industrial operations." },
    { title: "Sponsor Equipment", description: "Invest in the machinery and robotics students train on, and put your company's name on the tools that build careers." },
    { title: "Sponsor a Robot", description: "Put your company's name on a specific piece of automation equipment. It's a hands-on, high-visibility way to support the program." },
    { title: "Host a Facility Tour", description: "Bring your team through GTCIO's facility to see the training firsthand and meet future hires." },
    { title: "Curriculum Advisory Board", description: "Help shape what we teach so graduates arrive ready for the equipment and processes your industry actually uses." },
  ],
  directoryTitle: "Our Partners",
  directoryIntro: "A few of the organizations working with GTCIO to build Georgia's industrial workforce.",
  becomePartnerTitle: "Become a Partner",
  becomePartnerIntro:
    "Tell us a bit about your organization and which pathway interests you, and we'll follow up to talk next steps.",
};

export default async function PartnersPage() {
  const { data } = await sanityFetch({ query: PARTNERS_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    directory?: Array<{ _id: string; name: string; description: string; logo?: unknown }>;
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const pathways = typed?.pathways?.length ? typed.pathways : DEFAULTS.pathways;
  const directory = typed?.directory ?? [];

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        image="/images/hero-partners.jpg"
        imageAlt="Two technicians working together on robotic equipment"
        imagePosition="55% 17%"
      />

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-brand-black">{page.introText}</p>
          <Button href="#become-a-partner" variant="primary" className="shrink-0">
            HOW TO BECOME A PARTNER
          </Button>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.pathwaysTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pathways.map((p: { title: string; description: string }) => (
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
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.directoryTitle}</h2>
          <p className="mt-3 max-w-2xl text-brand-silver">{page.directoryIntro}</p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {directory.map((partner) => (
              <div key={partner._id} className="border border-brand-silver/40 p-6">
                <div className="relative flex h-16 items-center justify-center">
                  {Boolean(partner.logo) && (
                    <Image
                      src={urlForImage(partner.logo as never).width(320).height(128).fit("max").url()}
                      alt={`${partner.name} logo`}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <p className="mt-3 text-center text-sm font-bold text-brand-black">{partner.name}</p>
                <p className="mt-1 text-sm text-brand-silver">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="become-a-partner" className="scroll-mt-24 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.becomePartnerTitle}</h2>
          <p className="mt-3 text-brand-silver">{page.becomePartnerIntro}</p>
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
