import Button from "@/components/Button";
import { resolveHref, isExternal, type CtaButton as CtaButtonData } from "@/sanity/lib/links";

type Props = {
  button?: CtaButtonData | null;
  variant?: "primary" | "outline" | "dark";
  className?: string;
};

/**
 * Renders a button configured in the Studio. Returns null if the editor hasn't
 * finished setting it up (no label, or "Somewhere else" with no address yet), so
 * a half-filled field never ships a dead button to the live site.
 */
export default function CtaButton({ button, variant = "primary", className }: Props) {
  const href = resolveHref(button);
  if (!href || !button?.label) return null;

  const external = isExternal(href);
  return (
    <Button
      href={href}
      variant={variant}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {button.label}
    </Button>
  );
}
