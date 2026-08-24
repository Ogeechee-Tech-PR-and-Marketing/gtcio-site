import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS } from "@/lib/links";
import NewsletterSignup from "./NewsletterSignup";
import Year from "./Year";

/**
 * Code-only by design, like the header nav — a typo'd href here breaks
 * navigation on every page (PROJECT.md §8). The Explore column mirrors the
 * top nav's page list; when a route is added or renamed, update both (plus
 * sitemap.ts, links.ts, SITEMAP.html — PROJECT.md §12's runbook).
 */
const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "IOT Training Programs", href: "/training" },
      { label: "IOT Diploma Program", href: "/iot-diploma-program" },
      { label: "Credentials", href: "/credentials" },
      { label: "Facility", href: "/facility" },
      { label: "Partners", href: "/partners" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Become a Partner", href: "/partners#become-a-partner" },
      { label: "Apply to the Program", href: DESTINATIONS.apply },
    ],
  },
];

const TAGLINE = "A Division of Ogeechee Technical College";
const ADDRESS = "66 AJ Riggs Road, Statesboro, GA 30458";
const PHONE = "(800) 646-1316";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="border-b border-white/10">
        <NewsletterSignup />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        <div>
          {/* Dedicated white asset, not the header's red/black logo forced
              white via CSS filters — brightness-0 invert flattened every
              opaque pixel to white regardless of color, so the OTC diamond
              icon (drawn as color-on-color, not a transparency cutout)
              disappeared into the surrounding Georgia shape. */}
          <Image
            src="/images/gtcio-logo-white.png"
            alt="GTCIO — Georgia Training Center for Industrial Operations"
            width={505}
            height={200}
            className="h-20 w-auto sm:h-24"
          />
          <p className="mt-4 text-sm text-brand-silver">{TAGLINE}</p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="font-display text-sm text-brand-gold">{col.heading}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {col.links.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="text-sm text-brand-silver hover:text-brand-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-display text-sm text-brand-gold">Contact</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-silver">
            <li>{ADDRESS}</li>
            <li>Phone: {PHONE}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-xs text-brand-silver sm:flex-row sm:justify-between">
          <p>
            © <Year /> Georgia Training Center for Industrial Operations. All rights reserved.
          </p>
          {/* Red pipe separator matches the utility banner at the top of the page. */}
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:justify-end sm:text-right">
            <a
              href="https://www.ogeecheetech.edu/about/equal-opportunity"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-white"
            >
              Equal Opportunity Institution
            </a>
            <span aria-hidden className="text-brand-red">
              |
            </span>
            <span>A unit of the Technical College System of Georgia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
