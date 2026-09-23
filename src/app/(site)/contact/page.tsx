import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { CONTACTS, ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact GTCIO at Ogeechee Technical College: program questions, employer training, partnerships, and media inquiries.",
  alternates: { canonical: "/contact" },
};

// DEFAULTS is this page's content — code-only, no CMS (PROJECT.md §4).
const DEFAULTS = {
  heroEyebrow: "Contact",
  heroTitle: "Get in touch",
  // The chosen reason becomes the notification email's subject line, and
  // "Media inquiry" is string-matched (case-insensitive) by MEDIA_REASON in
  // src/app/api/inquiry/route.ts to route that email to the media contact —
  // renaming that option without updating MEDIA_REASON silently breaks the
  // routing.
  contactReasons: [
    "Prospective student / program question",
    "Employer training inquiry",
    "Partnership inquiry",
    "Media inquiry",
    "Something else",
  ],
};

export default function ContactPage() {
  const page = DEFAULTS;

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        image="/images/hero-contact.jpg"
        imageAlt="Technician reviewing diagnostics on a tablet at an electrical control panel"
        imagePosition="19% 28%"
      />

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 sm:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-black">GTCIO</h2>
            <p className="mt-1 text-brand-gray">{ORG.tagline}</p>
            <div className="mt-6 flex flex-col gap-2 text-brand-black">
              <p>{ORG.address}</p>
              <p>{`Phone: ${ORG.phone}`}</p>
            </div>

            <h2 className="font-heading mt-10 text-xl font-bold text-brand-black">Program Questions</h2>
            <div className="mt-3 flex flex-col gap-2 text-brand-black">
              <p>{`${CONTACTS.general.name}, ${CONTACTS.general.title}`}</p>
              <p>Office 1110, Jack Hill Building</p>
              <p>{CONTACTS.general.phone}</p>
              <p><a href={`mailto:${CONTACTS.general.email}`} className="font-bold text-brand-red hover:text-brand-black">{CONTACTS.general.email}</a></p>
            </div>

            <h2 className="font-heading mt-10 text-xl font-bold text-brand-black">Media Inquiries</h2>
            <div className="mt-3 flex flex-col gap-2 text-brand-black">
              <p>{`${CONTACTS.media.name}, ${CONTACTS.media.title}`}</p>
              <p>{CONTACTS.media.phone}</p>
              <p><a href={`mailto:${CONTACTS.media.email}`} className="font-bold text-brand-red hover:text-brand-black">{CONTACTS.media.email}</a></p>
            </div>
          </div>
          <div>
            <InquiryForm
              formType="contact"
              fields={[
                {
                  name: "reason",
                  label: "What's this about?",
                  type: "select",
                  required: true,
                  halfWidth: false,
                  options: page.contactReasons,
                  placeholder: "Select a reason…",
                },
                { name: "firstName", label: "First Name", required: true },
                { name: "lastName", label: "Last Name", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "phone", label: "Phone Number", type: "tel" },
                { name: "message", label: "Message", type: "textarea", required: true, halfWidth: false },
                {
                  name: "newsletterOptIn",
                  label: "Sign me up for GTCIO's newsletter",
                  type: "checkbox",
                  halfWidth: false,
                },
              ]}
              submitLabel="SEND MESSAGE"
            />
          </div>
        </div>
      </section>
    </>
  );
}
