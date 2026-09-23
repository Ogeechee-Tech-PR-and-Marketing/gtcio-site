/**
 * Canonical public origin of the site — used for metadataBase, robots.txt, and
 * sitemap.xml. If the site ever moves domains, change it HERE.
 */
export const SITE_URL = "https://gtcio.ogeecheetech.edu";

/**
 * The organisation as the footer, Contact page and the root layout's JSON-LD
 * state it. The address is a confirmed fact (PROJECT.md §11) — the About FAQ
 * repeats it in prose, so a change here needs that sentence updated too.
 */
const STREET = "66 AJ Riggs Road";
const CITY = "Statesboro";
const STATE = "GA";
const ZIP = "30458";

export const ORG = {
  name: "Georgia Training Center for Industrial Operations",
  shortName: "GTCIO",
  tagline: "A Division of Ogeechee Technical College",
  address: `${STREET}, ${CITY}, ${STATE} ${ZIP}`,
  postal: { street: STREET, city: CITY, state: STATE, zip: ZIP },
  phone: "(800) 646-1316",
  parent: { name: "Ogeechee Technical College", url: "https://www.ogeecheetech.edu" },
};

/**
 * The two staff the site names. Contact and News print them; the inquiry
 * route emails them — "Media inquiry" submissions go to `media`, everything
 * else to `general` (PROJECT.md §5). Changing an address here changes both
 * what visitors see and where the forms deliver.
 */
export const CONTACTS = {
  general: {
    name: "Jan Moore",
    title: "Vice President for Economic Development",
    email: "jmoore@ogeecheetech.edu",
    phone: "912-688-6026",
  },
  media: {
    name: "Sean Payne",
    title: "Executive Director for Public Relations & Marketing",
    email: "spayne@ogeecheetech.edu",
    phone: "912-871-8559",
  },
};
