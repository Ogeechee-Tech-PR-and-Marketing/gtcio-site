import type { Metadata } from "next";
import Button from "@/components/Button";
import SiteChrome from "@/components/SiteChrome";
import { DESTINATIONS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Page not found",
};

// Handles every unmatched URL (Next renders the root not-found for those).
// It lives outside the (site) group, so it wears the chrome itself.
export default function NotFound() {
  return (
    <SiteChrome>
      <section className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-display text-sm text-brand-red">404</p>
          <h1 className="font-display mt-2 text-4xl text-brand-black sm:text-5xl">Page not found</h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-gray">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={DESTINATIONS.home} variant="primary">
              GO TO THE HOME PAGE
            </Button>
            <Button href={DESTINATIONS.contact} variant="dark">
              CONTACT US
            </Button>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
