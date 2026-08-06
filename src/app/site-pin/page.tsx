import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enter access code | GTCIO",
  robots: { index: false, follow: false },
};

function safeNext(next: string | undefined): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
}

export default async function SitePinPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const hasError = params.error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4">
      <div className="w-full max-w-sm bg-brand-white p-8">
        <p className="font-ui text-xs uppercase tracking-wide text-brand-red">
          GTCIO
        </p>
        <h1 className="mt-1 font-display text-2xl text-brand-black">
          This site is under wraps
        </h1>
        <p className="mt-2 text-sm text-brand-silver">
          Enter the access code to continue.
        </p>
        <form method="POST" action="/api/site-pin" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <input
            type="password"
            name="pin"
            autoFocus
            required
            placeholder="Access code"
            className="w-full border border-brand-silver bg-brand-white px-3 py-2 text-brand-black focus:border-brand-red focus:outline-none"
          />
          {hasError && (
            <p className="font-ui text-sm text-brand-red">
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
    </div>
  );
}
