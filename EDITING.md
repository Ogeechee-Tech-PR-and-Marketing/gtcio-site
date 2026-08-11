# How to edit the GTCIO website

The Studio-based editing described in earlier versions of this file no longer
applies — the Sanity CMS was removed from this site 2026-08-11 ahead of its
handoff to Third Wave Digital, who will connect their own CMS.

**Until that CMS is wired up, every word, photo, partner logo, and news item on
the site lives directly in the source code**, not in an editing screen. Changes
require a developer:

- Page copy: each page's `DEFAULTS` object in its `src/app/(site)/<page>/page.tsx`
  file.
- Partner logos and info: `src/lib/partners.ts` (images in `public/images/`).
- News items: `src/lib/news.ts` (images in `public/images/news/`).
- Site-wide banner/footer text, address, phone, contacts: constants at the top
  of `src/components/Header.tsx`, `src/components/Footer.tsx`,
  `src/components/NewsletterSignup.tsx`, and `src/app/(site)/contact/page.tsx`.

A change goes live the same way any code change does: edit the file, commit,
push to `main` — Vercel auto-deploys. See `PROJECT.md` for the full layout of
the code and what's editable where.

If you're reading this after Third Wave Digital's CMS is connected, this file
is stale — replace it with whatever guide describes their editing UI.
