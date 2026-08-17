// News items — exported from Sanity's `newsItem` documents 2026-08-11 when
// the Sanity CMS was removed from this site ahead of the Third Wave Digital
// handoff. This replaces what used to be a live NEWS_PAGE_QUERY fetch; there
// is no CMS fallback anymore, so this array IS the content. Thumbnails live
// in public/images/news/<slug>.<ext>, downloaded byte-for-byte from Sanity's
// CDN at the same time. `imagePosition` is the CSS object-position string
// derived from each item's Sanity image hotspot, same focal-point convention
// PROJECT.md §4 documents for hero images.
export type NewsItem = {
  id: string;
  category: "press" | "media";
  title: string;
  date: string;
  source: string;
  url?: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "newsItem-otc-iot-program-launch-2026-07",
    category: "press",
    title:
      "Ogeechee Technical College Launches Industrial Operations Technology Program to Meet Growing Workforce Demands",
    date: "2026-07-08",
    source: "Ogeechee Technical College",
    excerpt:
      "OTC announces the Industrial Operations Technology diploma program, launching this August in the Georgia Training Center for Industrial Operations. Students build a foundation in mechanical, electrical, hydraulic, and pneumatic systems before advancing into robotics, PLCs, and smart automation, and graduate with SACA credentials alongside the diploma.",
  },
  {
    id: "newsItem-statesboro-magazine-2026-07",
    category: "media",
    title: "Building a Workforce Ready for Industry Transformation",
    date: "2026-07-01",
    source: "Statesboro Magazine",
    url: "https://issuu.com/statesboromagazine/docs/statesboro_magazine_-_july_august_2026/39",
    excerpt:
      "Statesboro Magazine's July/August education issue features the Georgia Training Center for Industrial Operations ahead of its fall opening, with OTC VP for Economic Development Jan Moore and Development Authority of Bulloch County CEO Benjy Thompson on what the 39,700-square-foot center means for the region.",
  },
  {
    id: "newsItem-wsav-new-training-center-2026-03",
    category: "media",
    title: "New training center coming to Ogeechee Tech",
    date: "2026-03-24",
    source: "WSAV-TV",
    url: "https://www.wsav.com/news/education/new-training-center-coming-to-ogeechee-tech/",
    excerpt:
      "WSAV reports from the construction site on the Georgia Training Center for Industrial Operations, with OTC VP for Economic Development Jan Moore on the training the center will deliver, the Development Authority of Bulloch County's donation of the land, and a projected annual economic impact for the region.",
  },
  {
    id: "newsItem-statesboro-herald-beam-signing-2025-12",
    category: "media",
    title: "Beam signing marks milestone for OTC robotics training center",
    date: "2025-12-17",
    source: "Statesboro Herald",
    url: "https://www.statesboroherald.com/local/beam-signing-marks-milestone-for-otc-robotics-training-center/",
    excerpt:
      "The Herald covers the beam signing at the A.J. Riggs Road site, where TCSG Commissioner Greg Dozier joined OTC President Lori Durden, college staff, and community members to mark a key construction milestone.",
  },
  {
    id: "newsItem-grice-connect-beam-signing-2025-12",
    category: "media",
    title: "OTC's beam signing ceremony marks progress for new robotics building",
    date: "2025-12-10",
    source: "Grice Connect",
    url: "https://www.griceconnect.com/local-news/otcs-beam-signing-ceremony-marks-progress-for-new-robotics-building-11624815",
    excerpt:
      "Grice Connect covers the beam signing at the Georgia Training Center for Industrial Operations, held during OTC's annual Fall Professional Development Day.",
  },
  {
    id: "newsItem-otc-beam-signing-2025-12",
    category: "press",
    title: "Intimate Beam Signing Ceremony Marks Progress for New Robotics Building",
    date: "2025-12-10",
    source: "Ogeechee Technical College",
    url: "https://www.ogeecheetech.edu/about/news/post/intimate-beam-signing-ceremony-marks-progress-for-new-robotics-building",
    excerpt:
      "OTC faculty and staff signed one of the last beams to be installed in the Georgia Training Center for Industrial Operations during the college's Fall Professional Development Day, marking a milestone toward the building's completion.",
    image: "/images/news/beam-signing.jpg",
    imageAlt:
      "Faculty, staff, and community members gather around a signed steel beam during the December 2025 beam signing ceremony for the new robotics building.",
    imagePosition: "50.0% 55.0%",
  },
  {
    id: "newsItem-otc-ace-electric-gift-2025-10",
    category: "press",
    title:
      "ACE Electric Makes Generous Gift to Ogeechee Technical College to Advance Electrical & Industrial Systems Technology Program",
    date: "2025-10-08",
    source: "Ogeechee Technical College",
    url: "https://www.ogeecheetech.edu/about/news/post/ace-electric-makes-generous-gift-to-ogeechee-technical-college-to-advance-electrical-industrial-systems-technology-program",
    excerpt:
      "ACE Electric donates to OTC's Electrical & Industrial Systems Technology program, with roughly half directed to lab equipment including an Amatrol trainer and transformer and the remainder supporting the Industrial Technology Building.",
    image: "/images/news/ace-electric-gift.jpg",
    imageAlt:
      "OTC staff and ACE Electric representatives stand beside a donated Amatrol electrical wiring training system.",
    imagePosition: "50.0% 50.0%",
  },
  {
    id: "newsItem-otc-breaks-ground-2024-11",
    category: "press",
    title: "OTC Breaks Ground on 37,000 Sq ft Industrial Systems & Robotics Facility",
    date: "2024-11-14",
    source: "Ogeechee Technical College",
    url: "https://www.ogeecheetech.edu/about/news/post/otc-breaks-ground-on-37-000-sq-ft-industrial-systems-robotics-facility",
    excerpt:
      "OTC breaks ground on the training center at A.J. Riggs Road and Highway 301 South, a project built in partnership with Bulloch County and the Development Authority of Bulloch County to meet regional demand for industrial systems and robotics technicians.",
    image: "/images/news/groundbreaking.jpg",
    imageAlt:
      "OTC leaders and officials break ground with ceremonial shovels at the site of the new Industrial Systems & Robotics facility.",
    imagePosition: "50.0% 62.0%",
  },
  {
    id: "newsItem-grice-announces-training-center-2023-06",
    category: "media",
    title: "OTC announces state-of-the-art Industrial Systems & Industrial Robotics Training Center",
    date: "2023-06-05",
    source: "Grice Connect",
    url: "https://www.griceconnect.com/education/otc-announces-state-of-the-art-industrial-systems-industrial-robotics-training-center-7098710",
    excerpt:
      "Grice Connect reports on the approved state funding for OTC's industrial systems and robotics training center and what the project is expected to mean for the region's workforce.",
  },
  {
    id: "newsItem-otc-announces-training-center-2023-06",
    category: "press",
    title:
      "Ogeechee Technical College Announces Development of State-of-the-Art Industrial Systems & Industrial Robotics Training Center",
    date: "2023-06-05",
    source: "Ogeechee Technical College",
    url: "https://www.ogeecheetech.edu/about/news/post/ogeechee-technical-college-announces-development-of-state-of-the-art-industrial-systems-industrial-robotics-training-center",
    excerpt:
      "State funding for the training center is approved in the amended budget, clearing the way for construction near OTC's main campus and a projected tripling of the college's annual training capacity.",
    image: "/images/news/training-center-rendering.jpg",
    imageAlt: "Architectural rendering of the planned Industrial Systems & Industrial Robotics Training Center exterior.",
    imagePosition: "50.0% 22.0%",
  },
  {
    id: "newsItem-grice-amatrol-training-center-2023-04",
    category: "media",
    title: "Ogeechee Tech now an Amatrol Training Center",
    date: "2023-04-27",
    source: "Grice Connect",
    url: "https://www.griceconnect.com/education/ogeechee-tech-now-an-amatrol-training-center-6931776",
    excerpt:
      "Ogeechee Tech becomes an Amatrol Regional Training Center, hosting instructor training courses for college, industry, and university educators — the first time Amatrol delivered these courses outside its Indiana headquarters.",
  },
  {
    id: "newsItem-otc-goodman-diamond-award-2023-02",
    category: "press",
    title: "Goodman Receives OTC's Diamond Award",
    date: "2023-02-16",
    source: "Ogeechee Technical College",
    url: "https://www.ogeecheetech.edu/about/news/post/goodman-receives-otc-s-diamond-award",
    excerpt:
      "Justin Goodman, Industrial Systems Instructor and Program Coordinator for Economic Development, receives OTC's Diamond Award, which recognizes employees who go the extra mile in service, innovation, and teamwork.",
    image: "/images/news/goodman-diamond-award.png",
    imageAlt: "Justin Goodman holds Ogeechee Technical College's 2023 Diamond Award.",
    imagePosition: "47.0% 32.0%",
  },
  {
    id: "newsItem-otc-commissioners-training-facility-2021-09",
    category: "press",
    title: "Commissioners, OTC to build new training facility",
    date: "2021-09-29",
    source: "Ogeechee Technical College",
    url: "https://www.ogeecheetech.edu/about/news/post/commissioners-otc-to-build-new-training-facility",
    excerpt:
      "Bulloch County commissioners approve funding for an industrial systems and robotics training facility, the earliest public step toward what became the GTCIO. The plan called for tripling OTC's training capacity in industrial systems maintenance and robotics.",
  },
  {
    id: "newsItem-otc-amazon-mra-2021-05",
    category: "media",
    title: "OTC offers robotics training & apprenticeships in Amazon's MRA program",
    date: "2021-05-24",
    source: "Grice Connect",
    url: "https://www.griceconnect.com/featured/otc-offers-robotics-training-apprenticeships-in-amazons-mra-program-6503227",
    excerpt:
      "OTC is selected as one of five colleges nationally to train apprentices in Amazon's Mechatronics and Robotics Apprenticeship program, a US Department of Labor registered apprenticeship combining twelve weeks of instruction with a year of on-the-job learning.",
  },
];
