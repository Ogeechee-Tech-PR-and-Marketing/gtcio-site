import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { sanityFetch } from "@/sanity/lib/live";
import { FACILITY_PAGE_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Facility | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "Facility",
  heroTitle: "Built for hands-on training",
  heroDescription:
    "GTCIO's 40,000-square-foot, $27 million facility was designed so campus tours never interrupt day-to-day training and operations.",
  overviewTitle: "Overview",
  overviewBody:
    "GTCIO's facility serves both credit students and incumbent workers, and it's stocked with real industrial equipment (maintenance, automation, controls) so students train on the same tools they'll use on the job. Beyond academic programs, the space also trains and certifies instructors from across Georgia and the nation.",
  galleryTitle: "Equipment Gallery",
  galleryLabels: ["Shop Floor", "Automation Lab", "Classroom", "Equipment Bay"],
  bookTourTitle: "Book a Tour",
  bookTourIntro:
    "Request a visit for your class, business, or organization. This is a request form, not a live booking calendar. GTCIO staff will follow up to confirm a date.",
  stats: [
    { value: "40,000 sq ft", label: "Purpose-built training space" },
    { value: "$27M", label: "Facility investment" },
    { value: "~460,000 hrs", label: "Instructional capacity per year" },
  ],
};

export default async function FacilityPage() {
  const { data } = await sanityFetch({ query: FACILITY_PAGE_QUERY });
  const typed = data as Partial<typeof DEFAULTS> | null;
  const page = { ...DEFAULTS, ...typed };
  const stats = typed?.stats?.length ? typed.stats : DEFAULTS.stats;
  const galleryLabels = typed?.galleryLabels?.length ? typed.galleryLabels : DEFAULTS.galleryLabels;

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        image="/images/hero-facility.jpg"
        imageAlt="Technician repairing an automated robotic arm in a factory"
        imagePosition="66% 36%"
      />

      <section className="border-b border-brand-silver/30 bg-brand-white px-6 py-14 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat: { value: string; label: string }) => (
            <div key={stat.label} className="border-l-4 border-brand-red pl-5">
              <p className="font-heading text-3xl font-bold text-brand-black">{stat.value}</p>
              <p className="mt-1 text-sm text-brand-silver">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.overviewTitle}</h2>
          <p className="mt-4 max-w-3xl text-brand-silver">{page.overviewBody}</p>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.galleryTitle}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleryLabels.map((label: string) => (
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
          <h2 className="font-heading text-3xl font-bold text-brand-black">{page.bookTourTitle}</h2>
          <p className="mt-3 text-brand-silver">{page.bookTourIntro}</p>
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
              confirmationMessage="Thanks! GTCIO staff will reach out to confirm a date for your tour."
            />
          </div>
        </div>
      </section>
    </>
  );
}
