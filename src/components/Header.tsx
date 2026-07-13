"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Mission", href: "/about#mission" },
      { label: "Bulloch Development Authority", href: "/about#bulloch-development-authority" },
      { label: "History of Partnership", href: "/about#history-of-partnership" },
      { label: "FAQ", href: "/about#faq" },
    ],
  },
  { label: "IOT Diploma Program", href: "/iot-diploma-program" },
  { label: "Facility", href: "/facility" },
  { label: "Training", href: "/training" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-white">
      <div className="bg-brand-black px-4 py-2 text-center">
        <p className="font-heading text-xs font-bold tracking-widest text-brand-white sm:text-sm">
          WELCOME TO THE GTCIO <span className="text-brand-red">|</span> A DIVISION OF OGEECHEE TECHNICAL COLLEGE
        </p>
      </div>

      <div className="border-b border-brand-silver/40 px-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/gtcio-logo.png"
              alt="GTCIO — Georgia Training Center for Industrial Operations"
              width={220}
              height={88}
              className="h-12 w-auto sm:h-14"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
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
                    className="font-heading text-sm font-bold tracking-wide text-brand-black hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                  {aboutOpen && (
                    <div className="absolute left-0 top-full w-64 border-t-2 border-brand-red bg-brand-white shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="font-heading block px-4 py-3 text-xs font-bold tracking-wide text-brand-black hover:bg-brand-black hover:text-brand-white"
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
                  className="font-heading text-sm font-bold tracking-wide text-brand-black hover:text-brand-red"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/facility#book-a-tour"
              className="font-heading bg-brand-red px-6 py-2.5 text-xs font-bold tracking-widest text-brand-white transition-colors hover:bg-brand-black"
            >
              BOOK A TOUR
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="font-heading text-sm font-bold tracking-wide text-brand-black lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "CLOSE" : "MENU"}
          </button>
        </div>

        {mobileOpen && (
          <nav className="flex flex-col gap-1 pb-4 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading block py-2 text-sm font-bold tracking-wide text-brand-black"
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
                        className="font-heading py-1 text-xs font-bold tracking-wide text-brand-silver"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/facility#book-a-tour"
              onClick={() => setMobileOpen(false)}
              className="font-heading mt-2 bg-brand-red px-6 py-2.5 text-center text-xs font-bold tracking-widest text-brand-white"
            >
              BOOK A TOUR
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
