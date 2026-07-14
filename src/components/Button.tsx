import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "dark";
  className?: string;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-brand-red text-brand-white hover:bg-black",
  outline: "border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-white",
  dark: "bg-brand-black text-brand-white hover:bg-brand-red",
};

export default function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`font-ui inline-block px-7 py-3 text-sm transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
