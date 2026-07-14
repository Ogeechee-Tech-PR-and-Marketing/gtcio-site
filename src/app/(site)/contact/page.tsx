import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { sanityFetch } from "@/sanity/lib/live";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, type SanityImage } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Contact | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "Contact",
  heroTitle: "Get in touch",
};

export default async function ContactPage() {
  const [{ data }, { data: settingsData }] = await Promise.all([
    sanityFetch({ query: CONTACT_PAGE_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroDescription?: string;
    heroImage?: SanityImage;
    heroImageAlt?: string;
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-contact.jpg",
    fallbackAlt:
      "Technician reviewing diagnostics on a tablet at an electrical control panel",
    fallbackPosition: "19% 28%",
  });
  const settings = settingsData as {
    footerTagline?: string;
    address?: string;
    phone?: string;
    programContact?: { name?: string; office?: string; phone?: string; email?: string };
    mediaContact?: { name?: string; email?: string; phone?: string };
  } | null;

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

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 sm:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-black">GTCIO</h2>
            <p className="mt-1 text-brand-silver">{settings?.footerTagline ?? "A Division of Ogeechee Technical College"}</p>
            <div className="mt-6 flex flex-col gap-2 text-brand-black">
              <p>{settings?.address ?? "1 Joe Kennedy Blvd., Statesboro, GA 30458"}</p>
              <p>Phone: {settings?.phone ?? "(800) 646-1316"}</p>
            </div>

            <h2 className="font-heading mt-10 text-xl font-bold text-brand-black">Program Questions</h2>
            <div className="mt-3 flex flex-col gap-2 text-brand-black">
              <p>{settings?.programContact?.name ?? "Jan Moore, Vice President for Economic Development"}</p>
              <p>{settings?.programContact?.office ?? "Office 1110, Jack Hill Building"}</p>
              <p>{settings?.programContact?.phone ?? "912-688-6026"}</p>
              <p>{settings?.programContact?.email ?? "jmoore@ogeecheetech.edu"}</p>
            </div>

            <h2 className="font-heading mt-10 text-xl font-bold text-brand-black">Media Inquiries</h2>
            <div className="mt-3 flex flex-col gap-2 text-brand-black">
              <p>{settings?.mediaContact?.name ?? "Sean Payne"}</p>
              <p>{settings?.mediaContact?.email ?? "spayne@ogeecheetech.edu"}</p>
              <p>{settings?.mediaContact?.phone ?? "(O) 912-871-8559"}</p>
            </div>
          </div>
          <div>
            <InquiryForm
              fields={[
                { name: "firstName", label: "First Name", required: true },
                { name: "lastName", label: "Last Name", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "phone", label: "Phone Number", type: "tel" },
                { name: "message", label: "Message", type: "textarea", required: true, halfWidth: false },
              ]}
              submitLabel="SEND MESSAGE"
            />
          </div>
        </div>
      </section>
    </>
  );
}
