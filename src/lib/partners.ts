// Partner directory — exported from Sanity's `partner` documents 2026-08-11
// when the Sanity CMS was removed from this site ahead of the Third Wave
// Digital handoff. This replaces what used to be a live PARTNERS_PAGE_QUERY
// fetch; there is no CMS fallback anymore, so this array IS the content.
// Logo images live in public/images/partner-<slug>.<ext>, downloaded
// byte-for-byte from Sanity's CDN at the same time.
export type Partner = {
  id: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
};

export const PARTNERS: Partner[] = [
  {
    id: "partner-ajin-georgia",
    name: "Ajin Georgia",
    description:
      "Automotive parts manufacturer with a strong regional maintenance and automation footprint.",
    logo: "/images/partner-ajin-georgia.jpg",
    website: "https://ajingeorgia.com/",
  },
  {
    id: "partner-amazon",
    name: "Amazon",
    description: "Logistics and fulfillment operations with a growing footprint in the region.",
    logo: "/images/partner-amazon.png",
    website: "https://www.aboutamazon.com/",
  },
  {
    id: "partner-bulloch-development-authority",
    name: "Development Authority of Bulloch County",
    description: "Supported development of GTCIO's $27 million training facility.",
    logo: "/images/partner-development-authority-of-bulloch-county.svg",
    website: "https://advantagebulloch.com/",
  },
  {
    id: "partner-georgia-power",
    name: "Georgia Power",
    description: "Utility provider for energy infrastructure and maintenance.",
    logo: "/images/partner-georgia-power.svg",
    website: "https://www.georgiapower.com/",
  },
  {
    id: "partner-koyo-bearings",
    name: "Koyo Bearings",
    description: "Manufacturer of precision bearings for heavy industrial machinery.",
    logo: "/images/partner-koyo-bearings.jpg",
    website: "https://jtekt-na.com/products/koyobearings/",
  },
];
