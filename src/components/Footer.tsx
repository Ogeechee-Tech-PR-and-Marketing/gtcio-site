import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "IOT Diploma Program", href: "/iot-diploma-program" },
      { label: "Facility", href: "/facility" },
      { label: "Training", href: "/training" },
      { label: "Partners", href: "/partners" },
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

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        <div>
          <Image
            src="/images/gtcio-logo.png"
            alt="GTCIO — Georgia Training Center for Industrial Operations"
            width={200}
            height={80}
            className="h-12 w-auto brightness-0 invert"
          />
          <p className="mt-4 text-sm text-brand-silver">A Division of Ogeechee Technical College</p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="font-heading text-sm font-bold tracking-widest text-brand-gold">{col.heading}</p>
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
          <p className="font-heading text-sm font-bold tracking-widest text-brand-gold">Contact</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-silver">
            <li>1189 Deloach Rd, Statesboro, GA 30458 (placeholder)</li>
            <li>Phone: (912) 871-XXXX (placeholder)</li>
            <li>Email: gtcio@ogeecheetech.edu (placeholder)</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-brand-silver sm:px-10">
        © {new Date().getFullYear()} Georgia Training Center for Industrial Operations. All rights reserved.
      </div>
    </footer>
  );
}
