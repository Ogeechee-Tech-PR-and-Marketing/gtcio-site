import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { sanityFetch } from "@/sanity/lib/live";
import { NEWS_PAGE_QUERY } from "@/sanity/lib/queries";
import { resolveHeroImage, type SanityImage } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "News | GTCIO",
};

const DEFAULTS = {
  heroEyebrow: "News",
  heroTitle: "News from the GTCIO",
  heroDescription:
    "Press releases from our office, and coverage of GTCIO in the media.",
  introText:
    "Announcements, milestones, and mentions as GTCIO gets underway. For media inquiries, see the contacts on our Contact page.",
  pressTitle: "Press Releases",
  mediaTitle: "In the News",
};

type NewsItem = {
  _id: string;
  category?: "press" | "media";
  title: string;
  date?: string;
  source?: string;
  url?: string;
  excerpt?: string;
};

function formatDate(date?: string) {
  if (!date) return "";
  // Date-only strings ("2026-07-09") parse as UTC midnight; format in UTC so the
  // day never slips backward in a US timezone.
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <ul className="mt-8 flex flex-col divide-y divide-brand-silver/30 border-y border-brand-silver/30">
      {items.map((item) => {
        const meta = [formatDate(item.date), item.source].filter(Boolean).join("  ·  ");
        return (
          <li key={item._id} className="py-6">
            {meta && (
              <p className="font-heading text-xs font-bold uppercase tracking-widest text-brand-silver">
                {meta}
              </p>
            )}
            <h3 className="font-heading mt-2 text-xl font-bold text-brand-black">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-red"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            {item.excerpt && <p className="mt-2 max-w-3xl text-brand-silver">{item.excerpt}</p>}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading mt-3 inline-block text-sm font-bold tracking-wide text-brand-red hover:text-brand-black"
              >
                Read more →
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default async function NewsPage() {
  const { data } = await sanityFetch({ query: NEWS_PAGE_QUERY });
  const typed = data as (Partial<typeof DEFAULTS> & {
    heroImage?: SanityImage;
    heroImageAlt?: string;
    items?: NewsItem[];
  }) | null;
  const page = { ...DEFAULTS, ...typed };
  const items = typed?.items ?? [];
  const press = items.filter((i) => i.category !== "media");
  const media = items.filter((i) => i.category === "media");

  const hero = resolveHeroImage({
    image: typed?.heroImage,
    alt: typed?.heroImageAlt,
    fallbackSrc: "/images/hero-about.jpg",
    fallbackAlt: "Engineer working with a robotic arm",
    fallbackPosition: "61% 25%",
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

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="max-w-3xl text-brand-black">{page.introText}</p>

          {items.length === 0 ? (
            <div className="font-heading mt-10 border border-dashed border-brand-silver/60 px-6 py-16 text-center text-sm font-bold tracking-wide text-brand-silver">
              PRESS &amp; MEDIA ITEMS COMING SOON
              <br />
              Add news items in the Studio to populate this page.
            </div>
          ) : (
            <div className="mt-12 flex flex-col gap-16">
              {press.length > 0 && (
                <div>
                  <h2 className="font-heading text-3xl font-bold text-brand-black">{page.pressTitle}</h2>
                  <NewsList items={press} />
                </div>
              )}
              {media.length > 0 && (
                <div>
                  <h2 className="font-heading text-3xl font-bold text-brand-black">{page.mediaTitle}</h2>
                  <NewsList items={media} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
