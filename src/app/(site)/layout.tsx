import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as {
    bannerOrgText?: string;
    bannerParentText?: string;
    footerTagline?: string;
    address?: string;
    phone?: string;
  } | null;
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <>
      <Header
        bannerOrgText={settings?.bannerOrgText}
        bannerParentText={settings?.bannerParentText}
      />
      <main className="flex-1">{children}</main>
      <Footer
        tagline={settings?.footerTagline}
        address={settings?.address}
        phone={settings?.phone}
      />
      <SanityLive />
      {isDraftMode && <VisualEditing />}
    </>
  );
}
