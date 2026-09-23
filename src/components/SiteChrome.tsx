import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Skip link, header, <main> and footer around a page. Used by the (site)
 * route group's layout and by the root not-found page, which renders outside
 * that group but should look like the rest of the site.
 */
export default function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Keyboard/screen-reader users get one Tab to jump past the sticky
          header and its nine-item nav. Visually hidden until focused. */}
      <a
        href="#main-content"
        className="font-ui sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand-red focus:px-4 focus:py-3 focus:text-sm focus:text-brand-white"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
