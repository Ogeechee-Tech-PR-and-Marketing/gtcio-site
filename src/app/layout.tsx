import type { Metadata } from "next";
import { ORG, SITE_URL } from "@/lib/site";
import "./globals.css";

const DESCRIPTION =
  "GTCIO trains Georgia's workforce for careers in Industrial Operations Technology: maintenance, automation, and controls. A division of Ogeechee Technical College.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages set a bare title ("About") and the template adds the suffix.
  title: {
    default: "GTCIO | Georgia Training Center for Industrial Operations",
    template: "%s | GTCIO",
  },
  description: DESCRIPTION,
  // Link previews (LinkedIn, Facebook, iMessage, Slack…). Title and
  // description are left out so each page's own resolve into og:title /
  // og:description; the image is the one thing every page shares.
  openGraph: {
    type: "website",
    siteName: "GTCIO",
    locale: "en_US",
    images: [
      {
        url: "/images/facility-rendering.jpg",
        width: 2400,
        height: 1350,
        alt: "Architectural rendering of the GTCIO facility on AJ Riggs Road, Statesboro, Georgia",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

// Structured data for search engines: who runs the site, where it is, and
// its parent institution — the same facts the footer prints (src/lib/site.ts).
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: ORG.name,
  alternateName: ORG.shortName,
  url: SITE_URL,
  logo: `${SITE_URL}/images/gtcio-logo.png`,
  description: DESCRIPTION,
  telephone: ORG.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: ORG.postal.street,
    addressLocality: ORG.postal.city,
    addressRegion: ORG.postal.state,
    postalCode: ORG.postal.zip,
    addressCountry: "US",
  },
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: ORG.parent.name,
    url: ORG.parent.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      {/* Trade Gothic Next, per the OTC brand guide. Served from Adobe Fonts under
          OTC's Creative Cloud licence — the files can't be self-hosted, so warm the
          connection early to shorten the swap-in. React 19 hoists these into <head>;
          wrapping them in a manual <head> element silently drops them. */}
      <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
      <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://use.typekit.net/jok5hww.css"
        precedence="default"
      />
      <body className="flex min-h-full flex-col">
        {/* JSON.stringify doesn't escape "<"; the replace keeps a "</script>" in
            any future value from closing the tag (Next's JSON-LD guide). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
