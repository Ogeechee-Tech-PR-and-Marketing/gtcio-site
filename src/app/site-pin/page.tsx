import type { Metadata } from "next";
import { safeNextPath } from "@/lib/site-pin";

export const metadata: Metadata = {
  title: "Enter access code | GTCIO",
  robots: { index: false, follow: false },
};

export default async function SitePinPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black px-4">
      <div className="w-full max-w-sm bg-brand-white p-8">
        <p className="font-ui text-xs uppercase tracking-wide text-brand-red">
          GTCIO
        </p>
        <h1 className="mt-1 font-display text-2xl text-brand-black">
          This site is under wraps
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Enter the access code to continue.
        </p>
        <form method="POST" action="/api/site-pin" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="site-pin" className="sr-only">
            Access code
          </label>
          <input
            id="site-pin"
            type="password"
            name="pin"
            autoFocus
            required
            autoComplete="off"
            placeholder="Access code"
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? "site-pin-error" : undefined}
            className="w-full border border-brand-silver bg-brand-white px-3 py-2 text-brand-black focus-visible:border-brand-red"
          />
          {hasError && (
            <p id="site-pin-error" role="alert" className="font-ui text-sm text-brand-red">
              That code didn&apos;t match. Try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-brand-red px-3 py-2 font-ui text-sm uppercase tracking-wide text-brand-white"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
