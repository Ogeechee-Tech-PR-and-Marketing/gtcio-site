import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GTCIO | Georgia Training Center for Industrial Operations",
  description:
    "GTCIO trains Georgia's workforce for careers in Industrial Operations Technology: maintenance, automation, and controls. A division of Ogeechee Technical College.",
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
