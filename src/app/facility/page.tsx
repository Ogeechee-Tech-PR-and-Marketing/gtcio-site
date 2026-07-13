import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Facility | GTCIO",
};

const GALLERY_PLACEHOLDERS = ["Shop Floor", "Automation Lab", "Classroom", "Equipment Bay"];

const FACILITY_STATS = [
  { value: "40,000 sq ft", label: "Purpose-built training space" },
  { value: "$27M", label: "Facility investment" },
  { value: "~460,000 hrs", label: "Instructional capacity per year" },
];

export default function FacilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Facility"
        title="Built for hands-on training"
        description="GTCIO's 40,000-square-foot, $27 million facility was designed so campus tours never interrupt day-to-day training and operations."
        image="/images/hero-facility.jpg"
        imageAlt="Technician repairing an automated robotic arm in a factory"
      />

      <section className="border-b border-brand-silver/30 bg-brand-white px-6 py-14 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {FACILITY_STATS.map((stat) => (
            <div key={stat.label} className="border-l-4 border-brand-red pl-5">
              <p className="font-heading text-3xl font-bold text-brand-black">{stat.value}</p>
              <p className="mt-1 text-sm text-brand-silver">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Overview</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">
            GTCIO&apos;s facility serves both credit students and incumbent workers, and it&apos;s
            stocked with real industrial equipment — maintenance, automation, controls — so students
            train on the same tools they&apos;ll use on the job. Beyond academic programs, the space
            also trains and certifies instructors from across Georgia and the nation.
          </p>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">Equipment Gallery</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GALLERY_PLACEHOLDERS.map((label) => (
              <div
                key={label}
                className="font-heading flex aspect-square items-center justify-center border border-dashed border-brand-silver/60 text-center text-xs font-bold tracking-wide text-brand-silver"
              >
                {label}
                <br />
                PHOTO PLACEHOLDER
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book-a-tour" className="scroll-mt-24 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-brand-black">Book a Tour</h2>
          <p className="mt-3 text-brand-silver">
            Request a visit for your class, business, or organization. This is a request form, not
            a live booking calendar — GTCIO staff will follow up to confirm a date.
          </p>
          <div className="mt-8">
            <InquiryForm
              fields={[
                { name: "firstName", label: "First Name", required: true },
                { name: "lastName", label: "Last Name", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "phone", label: "Phone Number", type: "tel" },
                { name: "organization", label: "Organization", halfWidth: false },
                { name: "preferredDate", label: "Preferred Date", type: "date" },
                { name: "message", label: "Message", type: "textarea", halfWidth: false },
              ]}
              submitLabel="REQUEST A TOUR"
              confirmationMessage="Thanks — GTCIO staff will reach out to confirm a date for your tour."
            />
          </div>
        </div>
      </section>
    </>
  );
}
