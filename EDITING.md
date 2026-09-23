# How to edit the GTCIO website

There is no CMS or editing screen. The site is being handed off to Third Wave
Digital, who will connect their own CMS.

**Until that CMS is wired up, every word, photo, partner logo, and news item on
the site lives directly in the source code.** Changes require a developer:

- Page copy: each page's `DEFAULTS` object in its `src/app/(site)/<page>/page.tsx`
  file.
- Partner logos and info: `src/lib/partners.ts` (images in `public/images/`).
- News items: `src/lib/news.ts` (images in `public/images/news/`).
- Address, phone, and the two staff contacts (name, title, email, phone):
  `src/lib/site.ts` — used by the footer, the Contact page, the News page and
  the form-notification emails.
- Banner text and newsletter copy: constants at the top of
  `src/components/Header.tsx` and `src/components/NewsletterSignup.tsx`.
- The page list in the header, footer and `sitemap.xml`: `src/lib/nav.ts`.

A change goes live the same way any code change does: edit the file, commit,
push to `main` — Vercel auto-deploys. See `PROJECT.md` for the full layout of
the code and what's editable where.

If you're reading this after Third Wave Digital's CMS is connected, this file
is stale — replace it with whatever guide describes their editing UI.
