import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { safeHref } from "@/lib/links";
import { NEWS_ITEMS, type NewsItem } from "@/lib/news";

export const metadata: Metadata = {
  title: "News | GTCIO",
};

// DEFAULTS is this page's content — code-only, no CMS (PROJECT.md §4).
const DEFAULTS = {
  heroEyebrow: "News",
  heroTitle: "News from the GTCIO",
  heroDescription:
    "Press releases from our office, and coverage of GTCIO in the media.",
  introText: "Announcements, milestones, and mentions as GTCIO gets underway.",
  pressTitle: "Press Releases",
  mediaTitle: "In the News",
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
        const url = safeHref(item.url);
        return (
          <li key={item.id} className="flex flex-col gap-6 py-6 sm:flex-row">
            {item.image && (
              <div className="relative h-40 w-full shrink-0 sm:h-28 sm:w-44">
                <Image
                  src={item.image}
                  alt={item.imageAlt || item.title}
                  fill
                  sizes="176px"
                  style={{ objectPosition: item.imagePosition || "50% 50%" }}
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {meta && (
                <p className="font-heading text-xs font-bold uppercase tracking-widest text-brand-silver">
                  {meta}
                </p>
              )}
              <h3 className="font-heading mt-2 text-xl font-bold text-brand-black">
                {url ? (
                  <a
                    href={url}
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
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading mt-3 inline-block text-sm font-bold tracking-wide text-brand-red hover:text-brand-black"
                >
                  Read more →
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function NewsPage() {
  const page = DEFAULTS;
  const items = NEWS_ITEMS;
  const press = items.filter((i) => i.category !== "media");
  const media = items.filter((i) => i.category === "media");

  // Same media contact siteSettings.mediaContact used to supply — kept in
  // sync with the Contact page's hardcoded default.
  const mediaContactName = "Sean Payne";
  const mediaContactEmail = "spayne@ogeecheetech.edu";

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        image="/images/hero-about.jpg"
        imageAlt="Engineer working with a robotic arm"
        imagePosition="61% 25%"
      />

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="max-w-3xl text-brand-black">
            {page.introText}{" "}
            For media inquiries, contact{" "}
            <a
              href={`mailto:${mediaContactEmail}`}
              className="font-bold text-brand-red hover:text-brand-black"
            >
              {mediaContactName}
            </a>
            , or see our{" "}
            <Link href="/contact" className="font-bold text-brand-red hover:text-brand-black">
              Contact page
            </Link>
            .
          </p>

          {items.length === 0 ? (
            <div className="font-heading mt-10 border border-dashed border-brand-silver/60 px-6 py-16 text-center text-sm font-bold tracking-wide text-brand-silver">
              PRESS &amp; MEDIA ITEMS COMING SOON
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
