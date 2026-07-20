import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "heroOutline" | "dark";
  className?: string;
  /** Set to "_blank" for links off this site; pair with rel="noopener noreferrer". */
  target?: string;
  rel?: string;
  /** Set to prompt a file download instead of navigating (e.g. a PDF in /public). */
  download?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-brand-red text-brand-white hover:bg-black",
  outline: "border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-white",
  // For dark backgrounds (hero bands). `outline` is black-on-black there and
  // effectively invisible. Secondary to the red primary, not competing with it.
  heroOutline:
    "border-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-black",
  dark: "bg-brand-black text-brand-white hover:bg-brand-red",
};

export default function Button({ href, children, variant = "primary", className = "", target, rel, download }: ButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      download={download}
      className={`font-ui inline-block px-7 py-3 text-sm transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
