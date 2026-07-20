import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { sanityFetch } from "@/sanity/lib/live";
import { FACILITY_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, urlForImage, type SanityImage } from "@/sanity/lib/image";

type GalleryPhoto = SanityImage & { caption?: string; alt?: string };

export const metadata: Metadata = {
  title: "Facility | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "Facility",
  heroTitle: "Built for hands-on training",
  heroDescription:
    "A $27 million, 40,000-square-foot center built to train the industrial systems and robotics workforce southeast Georgia's manufacturers are short on.",
  overviewTitle: "Overview",
  overviewBody:
    "GTCIO's facility serves both credit students and incumbent workers, and it's stocked with real industrial equipment (maintenance, automation, controls) so students train on the same tools they'll use on the job. It was planned as a regional center rather than a single college's building: Ogeechee Tech partnered with Southeastern Technical College to train manufacturers across their service areas once the center came online, which avoids duplicating facilities across the region. The space also trains and certifies instructors from across Georgia and the nation.",
  renderingTitle: "What it will look like",
  // Labelled as a rendering on purpose — the building is under construction
  // until autumn 2026, and an unlabelled render reads as a photo of something
  // that already exists.
  renderingCaption:
    "Architectural rendering of the GTCIO facility on AJ Riggs Road. Construction is scheduled for completion in September 2026, with a ribbon cutting on October 15, 2026.",
  galleryTitle: "Equipment Gallery",
  galleryLabels: ["Shop Floor", "Automation Lab", "Classroom", "Equipment Bay"],
  focusAreasTitle: "What the center is built around",
  focusAreasIntro:
    "The center was planned around four areas of advanced manufacturing, the skills southeast Georgia's employers are hiring for.",
  stats: [
    { value: "40,000 sq ft", label: "Purpose-built training space" },
    { value: "$27M", label: "Facility investment" },
    { value: "~460,000 hrs", label: "Instructional capacity per year" },
  ],
};

// Fallback only — the live copy lives in the CMS (Facility Page → What it's
// built around). Sourced from Ogeechee Tech's capital outlay project profile.
const FOCUS_AREAS = [
  {
    title: "Industrial Systems Maintenance",
    detail:
      "Keeping production equipment running: electrical and mechanical systems, fluid power, motor controls, and the troubleshooting that ties them together.",
  },
  {
    title: "Industrial Robotics Programming & Fault Diagnostics",
    detail:
      "Programming industrial robots, and diagnosing them when a line goes down and the robot is the reason.",
  },
  {
    title: "IoT Infrastructure & Troubleshooting",
    detail:
      "The connected sensors, networks, and data behind a smart factory, and what to do when that layer misbehaves.",
  },
  {
    title: "CNC in Advanced Manufacturing",
    detail:
      "Computer-controlled machining, the precision side of modern manufacturing.",
  },
];

export default async function FacilityPage() {
  const { data } = await sanityFetch({ query: FACILITY_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroImage?: SanityImage;
    heroImageAlt?: string;
    gallery?: GalleryPhoto[];
    focusAreas?: Array<{ _key?: string; title: string; detail: string }>;
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const stats = typed?.stats?.length ? typed.stats : DEFAULTS.stats;
  const gallery = typed?.gallery ?? [];
  const focusAreas = typed?.focusAreas?.length ? typed.focusAreas : FOCUS_AREAS;

  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-facility.jpg",
    fallbackAlt: "Technician repairing an automated robotic arm in a factory",
    fallbackPosition: "66% 36%",
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

      <section className="border-b border-brand-silver/30 bg-brand-white px-6 py-14 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat: { value: string; label: string }, i: number) => (
            <div key={i} className="border-l-4 border-brand-red pl-5">
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

      {/* The exterior rendering, from Ogeechee Tech's own Industrial Operations
          Program brochure. Its own band rather than a slot in the square
          Equipment Gallery below — it is 16:9 and a square crop loses the
          building. */}
      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.renderingTitle}</h2>
          <figure className="mt-8">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src="/images/facility-rendering.jpg"
                alt="Architectural rendering of the GTCIO building: a single-storey brick and white-panel facility with a two-storey glass entrance atrium"
                fill
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-brand-silver">
              {page.renderingCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.focusAreasTitle}</h2>
          {page.focusAreasIntro && (
            <p className="mt-3 max-w-3xl text-brand-silver">{page.focusAreasIntro}</p>
          )}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {focusAreas.map((area, i) => (
              <div key={i} className="border-l-4 border-brand-red pl-5">
                <h3 className="font-heading text-lg font-bold text-brand-black">{area.title}</h3>
                <p className="mt-1 text-sm text-brand-silver">{area.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-silver/30 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-brand-black">{page.galleryTitle}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {gallery.length > 0
              ? gallery.map((photo, i) => (
                  <figure key={photo._key ?? i} className="relative aspect-square overflow-hidden">
                    <Image
                      src={urlForImage(photo).width(600).height(600).fit("crop").url()}
                      alt={photo.alt ?? photo.caption ?? ""}
                      fill
                      sizes="(min-width: 640px) 25vw, 50vw"
                      className="object-cover"
                    />
                    {photo.caption && (
                      <figcaption className="font-heading absolute inset-x-0 bottom-0 bg-brand-black/70 px-2 py-1.5 text-center text-xs font-bold tracking-wide text-brand-white">
                        {photo.caption}
                      </figcaption>
                    )}
                  </figure>
                ))
              : DEFAULTS.galleryLabels.map((label) => (
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
    </>
  );
}
