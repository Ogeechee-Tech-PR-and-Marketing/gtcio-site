import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "IOT Training Programs", href: "/training" },
      { label: "IOT Diploma Program", href: "/iot-diploma-program" },
      { label: "Facility", href: "/facility" },
      { label: "Partners", href: "/partners" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Book a Tour", href: "/facility#book-a-tour" },
      { label: "Become a Partner", href: "/partners#become-a-partner" },
      { label: "Apply to the Program", href: "/iot-diploma-program#apply" },
    ],
  },
];

type FooterProps = {
  tagline?: string;
  address?: string;
  phone?: string;
};

export default function Footer({
  tagline = "A Division of Ogeechee Technical College",
  address = "66 AJ Riggs Road, Statesboro, GA 30458",
  phone = "(800) 646-1316",
}: FooterProps) {
  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        <div>
          <Image
            src="/images/gtcio-logo.png"
            alt="GTCIO — Georgia Training Center for Industrial Operations"
            width={320}
            height={128}
            className="h-20 w-auto brightness-0 invert sm:h-24"
          />
          <p className="mt-4 text-sm text-brand-silver">{tagline}</p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="font-display text-sm text-brand-gold">{col.heading}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-brand-silver hover:text-brand-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-display text-sm text-brand-gold">Contact</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-silver">
            <li>{address}</li>
            <li>Phone: {phone}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-xs text-brand-silver sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} Georgia Training Center for Industrial Operations. All rights reserved.
          </p>
          <a
            href="https://www.ogeecheetech.edu/about/equal-opportunity"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-white"
          >
            Equal Opportunity Institution
          </a>
        </div>
      </div>
    </footer>
  );
}
