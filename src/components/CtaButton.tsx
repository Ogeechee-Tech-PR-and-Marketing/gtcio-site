import Button from "@/components/Button";
import {
  resolveHref,
  isExternal,
  DOWNLOAD_DESTINATIONS,
  type CtaButton as CtaButtonData,
} from "@/lib/links";

type Props = {
  button?: CtaButtonData | null;
  variant?: "primary" | "dark";
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
  // A file destination saves rather than navigates, so it is never "external"
  // in the new-tab sense — the two branches are mutually exclusive.
  const isDownload = !!button.destination && DOWNLOAD_DESTINATIONS.has(button.destination);
  return (
    <Button
      href={href}
      variant={variant}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={isDownload || undefined}
    >
      {button.label}
    </Button>
  );
}
