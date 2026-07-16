"use client";

import { useState } from "react";

/**
 * Newsletter sign-up form for the landing page.
 *
 * This is intentionally NOT wired to a mailing provider yet. GTCIO expects to use
 * Constant Contact — when that's ready, either:
 *   1. Point the <form> `action` at the Constant Contact hosted sign-up URL and
 *      set `method="post"` (simplest, no JS), or
 *   2. Replace the handleSubmit stub below with a POST to an API route that calls
 *      the Constant Contact API.
 * Until then, the form validates the email client-side and shows a confirmation,
 * so it looks and feels finished without silently dropping addresses on a real
 * backend that doesn't exist. No address is sent anywhere.
 */
type Props = {
  eyebrow?: string;
  title?: string;
  body?: string;
  buttonLabel?: string;
  confirmation?: string;
};

export default function NewsletterSignup({
  eyebrow = "Stay in the loop",
  title = "News from the GTCIO",
  body = "Program updates, facility milestones, partnership news, and enrollment dates, sent straight to your inbox. No spam.",
  buttonLabel = "SIGN UP",
  confirmation = "Thanks for signing up. We'll be in touch with news from the GTCIO.",
}: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // TODO: send `value` to Constant Contact (see file header).
    setSubmitted(true);
  }

  return (
    <section className="bg-brand-black px-6 py-16 text-brand-white sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          {eyebrow && <p className="font-display text-sm text-brand-gold">{eyebrow}</p>}
          <h2 className="font-heading mt-2 text-3xl font-bold">{title}</h2>
          {body && <p className="mt-3 text-brand-silver">{body}</p>}
        </div>

        {submitted ? (
          <div className="w-full max-w-md rounded border border-brand-gold/60 bg-brand-white/5 p-6">
            <p className="font-heading text-lg font-bold text-brand-gold">You&apos;re on the list.</p>
            <p className="mt-1 text-sm text-brand-silver">{confirmation}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full border border-brand-silver/50 bg-brand-white px-4 py-3 text-brand-black placeholder:text-brand-silver focus:border-brand-gold focus:outline-none"
              />
              <button
                type="submit"
                className="font-ui shrink-0 bg-brand-red px-6 py-3 text-xs font-bold tracking-widest text-brand-white transition-colors hover:bg-brand-white hover:text-brand-black"
              >
                {buttonLabel}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-brand-gold">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
