import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact | GTCIO",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" />

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 sm:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-black">GTCIO</h2>
            <p className="mt-1 text-brand-silver">A Division of Ogeechee Technical College</p>
            <div className="mt-6 flex flex-col gap-2 text-brand-black">
              <p>1189 Deloach Rd, Statesboro, GA 30458 (placeholder)</p>
              <p>Phone: (912) 871-XXXX (placeholder)</p>
              <p>Email: gtcio@ogeecheetech.edu (placeholder)</p>
            </div>

            <h2 className="font-heading mt-10 text-xl font-bold text-brand-black">Media Inquiries</h2>
            <div className="mt-3 flex flex-col gap-2 text-brand-black">
              <p>Sean Payne</p>
              <p>spayne@ogeecheetech.edu</p>
              <p>(O) 912-871-8559</p>
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
