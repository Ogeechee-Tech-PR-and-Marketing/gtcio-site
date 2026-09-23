/**
 * The site's page list, in nav order. Feeds the header nav (Header.tsx),
 * the footer's Explore column (Footer.tsx) and sitemap.xml (app/sitemap.ts),
 * so a route is added or renamed in one place. The About entry's children
 * are its in-page anchors; only the header renders them.
 *
 * Two constraints before adding an item:
 * - 9 items fit the desktop nav at the xl breakpoint with only ~21px to
 *   spare and no overflow handling — a 10th item or longer labels need
 *   re-measuring, or the nav collides with the logo.
 * - A new route also needs a DESTINATIONS key in links.ts if buttons should
 *   target it, and an entry in public/SITEMAP.html (PROJECT.md §13).
 */
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const NAV_ITEMS: NavItem[] = [
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
