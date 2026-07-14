import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
