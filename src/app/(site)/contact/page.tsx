import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact | GTCIO",
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
  const contactReasons = DEFAULTS.contactReasons;

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
            <p className="mt-1 text-brand-silver">A Division of Ogeechee Technical College</p>
            <div className="mt-6 flex flex-col gap-2 text-brand-black">
              <p>66 AJ Riggs Road, Statesboro, GA 30458</p>
              <p>Phone: (800) 646-1316</p>
            </div>

            <h2 className="font-heading mt-10 text-xl font-bold text-brand-black">Program Questions</h2>
            <div className="mt-3 flex flex-col gap-2 text-brand-black">
              <p>Jan Moore, Vice President for Economic Development</p>
              <p>Office 1110, Jack Hill Building</p>
              <p>912-688-6026</p>
              <p><a href="mailto:jmoore@ogeecheetech.edu" className="font-bold text-brand-red hover:text-brand-black">jmoore@ogeecheetech.edu</a></p>
            </div>

            <h2 className="font-heading mt-10 text-xl font-bold text-brand-black">Media Inquiries</h2>
            <div className="mt-3 flex flex-col gap-2 text-brand-black">
              <p>Sean Payne, Executive Director for Public Relations &amp; Marketing</p>
              <p>912-871-8559</p>
              <p><a href="mailto:spayne@ogeecheetech.edu" className="font-bold text-brand-red hover:text-brand-black">spayne@ogeecheetech.edu</a></p>
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
                  options: contactReasons,
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
