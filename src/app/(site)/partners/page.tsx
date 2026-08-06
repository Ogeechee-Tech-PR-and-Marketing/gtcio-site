import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaButton from "@/components/CtaButton";
import InquiryForm from "@/components/InquiryForm";
import { sanityFetch } from "@/sanity/lib/live";
import { PARTNERS_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, urlForImage, type SanityImage } from "@/sanity/lib/image";
import { safeHref } from "@/sanity/lib/links";

export const metadata: Metadata = {
  title: "Partners | GTCIO",
};

// Anchor id for a partner's directory card below, e.g. "Ajin Georgia" → "ajin-georgia".
function partnerSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// A pathway card's title, read as a form checkbox choice instead.
const FORM_LABEL_OVERRIDES: Record<string, string> = {
  "Training Program Partner": "Become a Training Partner",
};

// Form checkbox choices with no pathway card of their own.
const EXTRA_FORM_OPTIONS = ["Facility Tour"];

// Temporarily hides the "Our Partners" section (logo collage + per-partner
// cards) at Jake's request, 2026-08-06. Flip back to true to restore — see
// PROJECT.md §8.
const SHOW_PARTNER_DIRECTORY = false;

// ⚠️ CMS values override these defaults once a field is set on the Sanity doc —
// editing this object alone does NOT change the live site. Patch the published
// doc (and any draft of it) too. PROJECT.md §4, trap 6 has the how.
const DEFAULTS = {
  heroEyebrow: "Partners",
  heroTitle: "Bridges to industry",
  heroDescription:
    "GTCIO's training only works when it's built alongside the employers who'll hire our graduates. Here's how to get involved.",
  introText:
    "Whether you want to hire our graduates, send your employees for training at the GTCIO, or sponsor programming and equipment, there's a partnership pathway built for it.",
  introButton: { label: "HOW TO BECOME A PARTNER", destination: "becomePartner" as const },
  pathwaysTitle: "Partnership Pathways",
  pathways: [
    { title: "Hire Our Graduates", description: "Access a pipeline of technicians and specialists trained in maintenance, automation, and industrial operations." },
    { title: "Sponsorship Opportunities", description: "Invest in the machinery and robotics students train on, and put your company's name on the tools that build careers." },
    { title: "Training Program Partner", description: "Details on this partnership pathway are coming soon." },
    { title: "K-12 Partner", description: "Details on this partnership pathway are coming soon." },
  ],
  directoryTitle: "Our Partners",
  directoryIntro: "A few of the organizations working with GTCIO to build Georgia's industrial workforce.",
  becomePartnerTitle: "Become a GTCIO Partner",
  becomePartnerIntro:
    "GTCIO is actively growing its network of industry partners. Tell us a bit about your organization and which pathway interests you, and we'll follow up to talk next steps.",
};

export default async function PartnersPage() {
  const { data } = await sanityFetch({ query: PARTNERS_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroImage?: SanityImage;
    heroImageAlt?: string;
    partners?: Array<{ _id: string; name: string; description: string; logo?: SanityImage; website?: string }>;
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const pathways = typed?.pathways?.length ? typed.pathways : DEFAULTS.pathways;
  const partners = typed?.partners ?? [];

  // The checkbox list is generated from the pathway cards shown above it, so
  // editing a card in the CMS keeps the form in step with the page
  // automatically — except FORM_LABEL_OVERRIDES (a card title that should read
  // differently as a form choice) and EXTRA_FORM_OPTIONS (a form choice with
  // no pathway card of its own).
  const pathwayOptions = [
    ...pathways.map((p: { title: string }) => FORM_LABEL_OVERRIDES[p.title] ?? p.title),
    ...EXTRA_FORM_OPTIONS,
    "Something else / not sure yet",
  ];

  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-partners.jpg",
    fallbackAlt: "Two technicians working together on robotic equipment",
    fallbackPosition: "55% 17%",
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

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-brand-black">{page.introText}</p>
          <CtaButton button={page.introButton} variant="primary" className="shrink-0" />
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.pathwaysTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pathways.map((p: { title: string; description: string }, i: number) => (
              <div key={i} className="flex flex-col justify-between border border-brand-silver/40 p-6">
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

      {SHOW_PARTNER_DIRECTORY && (
      <section className="border-b border-brand-silver/30 bg-brand-silver/10 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.directoryTitle}</h2>
          <p className="mt-3 max-w-2xl text-brand-silver">{page.directoryIntro}</p>

          {/* Logo collage: a clickable wall of every partner's logo, each
              jumping to its full card (logo, description, Learn More) in the
              directory list below. Uniform white tiles keep very different
              logo shapes/colors (wordmarks vs. icons) reading as one set. */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <a
                key={partner._id}
                href={`#${partnerSlug(partner.name)}`}
                className="group flex flex-col items-center gap-3 border border-brand-silver/20 bg-brand-white p-6 shadow-sm transition-colors hover:border-brand-red"
              >
                <div className="relative h-16 w-full sm:h-20">
                  {partner.logo?.asset && (
                    <Image
                      src={urlForImage(partner.logo).width(320).fit("max").url()}
                      alt={`${partner.name} logo`}
                      fill
                      sizes="200px"
                      className="object-contain"
                    />
                  )}
                </div>
                <span className="font-ui text-center text-xs font-bold tracking-wide text-brand-silver group-hover:text-brand-red">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>

          {/* Wide cards stacked one per row: logo left, copy right, CTA bottom
              right — the layout of the Georgia Cyber Center partners directory
              this page is modelled on. */}
          <div className="mt-8 flex flex-col gap-6">
            {partners.map((partner) => {
              const website = safeHref(partner.website);
              return (
              <div
                key={partner._id}
                id={partnerSlug(partner.name)}
                className="flex scroll-mt-40 flex-col border border-brand-silver/20 bg-brand-white shadow-sm sm:scroll-mt-56"
              >
                <div className="flex flex-col gap-6 p-8 sm:flex-row sm:items-start sm:gap-10">
                  <div className="relative h-20 w-full shrink-0 sm:h-24 sm:w-44">
                    {/* .asset check matters: a logo object with no upload yet
                        (draft preview mid-edit) makes urlForImage() throw. */}
                    {partner.logo?.asset && (
                      <Image
                        // Width only: passing a height too makes Sanity crop the
                        // logo to that aspect ratio and clip wordmarks.
                        src={urlForImage(partner.logo).width(480).fit("max").url()}
                        alt={`${partner.name} logo`}
                        fill
                        sizes="176px"
                        className="object-contain object-left"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-bold text-brand-black">{partner.name}</h3>
                    <p className="mt-2 text-brand-silver">{partner.description}</p>
                  </div>
                </div>
                {website && (
                  <div className="flex justify-end px-8 pb-8">
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui inline-block bg-brand-red px-5 py-2.5 text-xs font-bold tracking-widest text-brand-white transition-colors hover:bg-brand-black"
                    >
                      LEARN MORE
                    </a>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      <section id="become-a-partner" className="scroll-mt-40 sm:scroll-mt-56 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.becomePartnerTitle}</h2>
          <p className="mt-3 text-brand-silver">{page.becomePartnerIntro}</p>
          <div className="mt-8">
            <InquiryForm
              formType="partner"
              fields={[
                {
                  name: "reason",
                  label: "What are you interested in? (select all that apply)",
                  type: "checkboxes",
                  required: true,
                  halfWidth: false,
                  options: pathwayOptions,
                },
                { name: "firstName", label: "First Name", required: true },
                { name: "lastName", label: "Last Name", required: true },
                { name: "organization", label: "Company Name", required: true, halfWidth: false },
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
