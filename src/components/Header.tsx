"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Two constraints before adding an item:
 * - 9 items fit the desktop nav at the xl breakpoint with only ~21px to
 *   spare and no overflow handling — a 10th item or longer labels need
 *   re-measuring, or the nav collides with the logo.
 * - A new route must ALSO go in src/app/sitemap.ts, Footer.tsx,
 *   src/lib/links.ts, and public/SITEMAP.html (the add-a-page checklist in
 *   PROJECT.md §13 lists every step).
 */
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Mission", href: "/about#mission" },
      { label: "History", href: "/about#history" },
      { label: "Advisory Board", href: "/about#advisory-board" },
      { label: "Development Authority of Bulloch County", href: "/about#bulloch-development-authority" },
      { label: "FAQ", href: "/about#faq" },
    ],
  },
  { label: "IOT Training Programs", href: "/training" },
  { label: "IOT Diploma Program", href: "/iot-diploma-program" },
  { label: "Credentials", href: "/credentials" },
  { label: "Facility", href: "/facility" },
  { label: "Partners", href: "/partners" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const BANNER_ORG_TEXT = "WELCOME TO THE GTCIO";
const BANNER_PARENT_TEXT = "A DIVISION OF OGEECHEE TECHNICAL COLLEGE";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    // The header is sticky, so in-page anchor targets need a scroll margin
    // matching its real height (~152px mobile / ~205px from sm up). That's the
    // scroll-mt-40 sm:scroll-mt-56 on every id'd section — if the banner, logo
    // size, or padding here changes, those margins must change with it.
    <header className="sticky top-0 z-50 bg-brand-white">
      <div className="bg-brand-black px-4 py-2 text-center">
        <p className="font-ui text-xs font-bold tracking-widest text-brand-white sm:text-sm">
          {BANNER_ORG_TEXT} <span className="text-brand-red">|</span> {BANNER_PARENT_TEXT}
        </p>
      </div>

      <div className="border-b border-brand-silver/40 px-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/gtcio-logo.png"
              alt="GTCIO — Georgia Training Center for Industrial Operations"
              width={750}
              height={300}
              // Displayed at ~240-360px wide; without `sizes`, next/image
              // preloads a 1920px rendition of it on every page for retina.
              sizes="(min-width: 640px) 360px, 240px"
              className="h-24 w-auto sm:h-36"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-4 xl:flex xl:gap-6">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="font-ui text-sm font-bold tracking-wide text-brand-black hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                  {aboutOpen && (
                    <div className="absolute left-0 top-full w-72 border-t-2 border-brand-red bg-brand-white shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="font-ui block px-4 py-3 text-xs font-bold tracking-wide text-brand-black hover:bg-brand-black hover:text-brand-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-ui text-sm font-bold tracking-wide text-brand-black hover:text-brand-red"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="font-ui text-sm font-bold tracking-wide text-brand-black xl:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "CLOSE" : "MENU"}
          </button>
        </div>

        {mobileOpen && (
          <nav className="flex flex-col gap-1 pb-4 xl:hidden">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-ui block py-2 text-sm font-bold tracking-wide text-brand-black"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 flex flex-col gap-1 border-l border-brand-silver/40 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="font-ui py-1 text-xs font-bold tracking-wide text-brand-silver"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
