import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "dark";
  className?: string;
  /** Set to "_blank" for links off this site; pair with rel="noopener noreferrer". */
  target?: string;
  rel?: string;
  /** Set to prompt a file download instead of navigating (e.g. a PDF in /public). */
  download?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-brand-red text-brand-white hover:bg-black",
  dark: "bg-brand-black text-brand-white hover:bg-brand-red",
};

export default function Button({ href, children, variant = "primary", className = "", target, rel, download }: ButtonProps) {
  const classes = `font-ui inline-block px-7 py-3 text-sm transition-colors ${variants[variant]} ${className}`;
  const newTab = target === "_blank";
  const label = (
    <>
      {children}
      {newTab && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  // Files and off-site URLs get a plain <a>. next/link treats any relative
  // href as a route and prefetches it when the link scrolls into view — for
  // the two brochure PDFs that meant silently downloading 4–8 MB per page
  // view. Nothing here needs client-side navigation.
  if (download || /^(https?:|mailto:|tel:)/i.test(href)) {
    return (
      <a href={href} target={target} rel={rel} download={download || undefined} className={classes}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} target={target} rel={rel} className={classes}>
      {label}
    </Link>
  );
}
