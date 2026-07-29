"use client";

import { useState } from "react";

/**
 * Newsletter sign-up form, rendered inside the Footer on every page. POSTs to
 * /api/newsletter, which adds the address to Constant Contact — see
 * src/lib/constantContact.ts and PROJECT.md for how that's wired up.
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
  body = "Program updates, partnership news, and training news and calendars sent straight to your inbox. No spam.",
  buttonLabel = "SIGN UP",
  confirmation = "Thanks for signing up. We'll be in touch with news from the GTCIO.",
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const botcheck = formData.get("botcheck");

    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: value,
          botcheck,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result?.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            <input
              type="text"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="newsletter-first-name" className="sr-only">
                  First name
                </label>
                <input
                  id="newsletter-first-name"
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={100}
                  placeholder="First name"
                  autoComplete="given-name"
                  className="w-full border border-brand-silver/50 bg-brand-white px-4 py-3 text-brand-black placeholder:text-brand-silver focus:border-brand-gold focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="newsletter-last-name" className="sr-only">
                  Last name
                </label>
                <input
                  id="newsletter-last-name"
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={100}
                  placeholder="Last name"
                  autoComplete="family-name"
                  className="w-full border border-brand-silver/50 bg-brand-white px-4 py-3 text-brand-black placeholder:text-brand-silver focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full border border-brand-silver/50 bg-brand-white px-4 py-3 text-brand-black placeholder:text-brand-silver focus:border-brand-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="font-ui shrink-0 bg-brand-red px-6 py-3 text-xs font-bold tracking-widest text-brand-white transition-colors hover:bg-black disabled:opacity-60"
              >
                {submitting ? "SIGNING UP…" : buttonLabel}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-brand-gold">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
