import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
