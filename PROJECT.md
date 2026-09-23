# GTCIO website — project brief

What a developer needs to pick this project up cold. Last updated 2026-09-17.
Check claims against the code before trusting them.

> The long-form history behind this file (dated decisions, resolved defects,
> fact-check provenance) lives outside the repo with the site's owner. If a
> "why is it this way" question isn't answered here, ask before changing
> things — much of this site's content was individually fact-checked and
> deliberate-looking oddities usually are deliberate.

---

## 1. What this is

The website for **GTCIO** (Georgia Training Center for Industrial Operations),
a division of **Ogeechee Technical College** (OTC) in Statesboro, GA. GTCIO
trains people for industrial maintenance / automation / controls work, and
launches an Industrial Operations Technology (IOT) diploma program in
**August 2026**.

- **Live:** https://gtcio.ogeecheetech.edu (canonical, `SITE_URL` in
  `src/lib/site.ts`) — DNS is OTC's own Azure DNS zone → Vercel, a CNAME on
  the `gtcio` subdomain, added 2026-09-15. `www.gtcio.org`/`gtcio.org`
  (GoDaddy DNS) and `gtcio-site.vercel.app` all still resolve and 308 to the
  canonical host (`src/proxy.ts`). Flipped canonical from www.gtcio.org to
  gtcio.ogeecheetech.edu on 2026-09-21 for branding — OTC wanted the
  address bar to read their own `.edu` domain.
- **Repo:** https://github.com/Ogeechee-Tech-PR-and-Marketing/gtcio-site (**public** — see §12; Vercel Hobby cannot auto-deploy a private org-owned repo)
- **Editing UI:** none. Content lives in code (§4). The site is being handed
  off to **Third Wave Digital**, who will connect their own CMS and are
  expected to take over hosting.

**Stakeholder:** Jan Moore, VP for Economic Development at OTC. She drives
requirements. The site's structure (thin dark utility banner, full-width photo
hero, Partners page as logo directory + "Become a Partner" CTA) is modeled on
[gacybercenter.org](https://www.gacybercenter.org/) at her request — don't
redesign it without being asked.

## 2. Stack

| | |
| --- | --- |
| Framework | Next.js **16.3.5**, App Router, Turbopack |
| UI | React 19.2, Tailwind **v4** (CSS-first config, no `tailwind.config.js`) |
| Language | TypeScript, strict |
| Email | Resend (Vercel Marketplace) — **interim**; Microsoft Graph wired up as the alternate provider (§5) |
| Fonts | Adobe Fonts — Trade Gothic Next (§7) |
| Hosting | Vercel — project `jake-hallmans-projects/gtcio-site` |
| Deploys | **Auto-deploy on push to `main`** — requires the repo stay **public** on the Hobby plan (§12). |

> ⚠️ Next.js 16 post-dates most AI training data. `AGENTS.md` says it too:
> read the bundled docs in `node_modules/next/dist/docs/` before writing
> framework code. `params` and `draftMode()` are async, etc.

## 3. Layout of the code

```
src/proxy.ts              canonical-host redirect + site-wide PIN gate (§6)
src/app/
  layout.tsx              root: <html>/<body> only, no chrome
  site-pin/               /site-pin — PIN entry screen (outside (site): no Header/Footer)
  (site)/                 every public page; route group adds Header + Footer
    page.tsx              /            (home)
    about/                /about
    training/             /training    ("IOT Training Programs" in the nav)
    iot-diploma-program/  /iot-diploma-program
      curriculum/         /iot-diploma-program/curriculum   ← not in the nav (deliberate)
    credentials/          /credentials
    facility/             /facility
    partners/             /partners
    news/                 /news
    contact/              /contact
  api/
    site-pin/             POST target for the PIN gate (§6)
    inquiry/              POST target for both live forms (§5)
    newsletter/           POST target for the footer sign-up (§8)
    constant-contact/oauth/{start,callback}/   one-time OAuth grant (§8)
src/lib/
  site.ts                 SITE_URL (canonical origin), ORG (name, tagline,
                          address, phone) and CONTACTS (Jan / Sean) — the
                          facts the footer, Contact, News and the inquiry
                          route all read
  nav.ts                  NAV_ITEMS — the page list behind the header nav,
                          footer Explore column and sitemap.xml
  site-pin.ts             cookie name + safeNextPath() shared by proxy, api/site-pin, site-pin page
  rateLimit.ts            per-IP fixed-window limiter on the POST routes, KV-backed, fails open (§5)
  inquiryStore.ts         KV list of form submissions the email couldn't carry (§5)
  links.ts                DESTINATIONS: button destination keys → hrefs, plus
                          safeHref/resolveHref/isExternal. If a route moves,
                          change it here and every button follows.
  partners.ts             the 5 partner companies (logos in public/images/)
  news.ts                 all news items (press + media)
  iot-curriculum.ts       IS32 course table + SACA credential glossary — read
                          its header before touching it (§4)
  credentials.ts          SACA tier ladder + OTC accreditations; feeds both
                          /credentials and /training via a showOn tag (§4)
  constantContact.ts      newsletter API client, server-only (§8)
  constantContactStore.ts Vercel KV wrapper for the OAuth tokens (§8)
  mail.ts                 picks the email provider: Resend, then Graph, else none (§5)
  resendMail.ts           Resend REST client — sends as website@gtcio.org, the live provider for now (§5)
  graphMail.ts            Microsoft Graph sendMail client — alternate provider (§5)
src/components/           Header, Footer, PageHero, HeroCard, InquiryForm,
                          NewsletterSignup, Button/CtaButton, AboutTimeline, …
```

**Why the `(site)` route group exists:** so chrome-free routes (`/site-pin`)
don't inherit Header/Footer. New routes that shouldn't carry the nav belong
outside `(site)` too.

## 4. Content model — everything is code

Every page defines a `DEFAULTS` object in its `page.tsx` and renders it
directly. `DEFAULTS` **is** the content. Page components are plain synchronous
functions — no fetches. A copy change = edit the file, push to `main`,
auto-deploy. `EDITING.md` maps common edits to files.

Shared content lives in `src/lib/`: `partners.ts`, `news.ts`, `links.ts`,
`site.ts` (address, phone, staff contacts — see §3). Banner and newsletter
copy are constants in `Header.tsx` and `NewsletterSignup.tsx`.

**`iot-curriculum.ts` and `credentials.ts` are matters of record, not
marketing copy.** Course codes, credit hours, and SACA credential mappings
are transcribed from OTC's accredited course catalog
(ogeecheetech.smartcatalogiq.com) and a wrong edit misstates the program to
prospective students. Both files carry header comments explaining their
sourcing and the few deliberate deviations — read them first. When the
curriculum changes, a developer updates these files deliberately; **do not**
make them free-form CMS fields.

- One cross-page wrinkle: the accreditations on `/credentials` and
  `/training` are the same array (`AFFILIATIONS` in `credentials.ts`)
  filtered by a `showOn` tag — one source, two pages, not two lists.

## 5. How the forms work

Two live forms — **Become a Partner** (Partners) and **Contact** — render
through `InquiryForm.tsx` and POST JSON to `src/app/api/inquiry/route.ts`,
which:

1. Rejects oversized payloads (>20 KB), rate-limits to 5 submissions per IP
   per 10 minutes (`rateLimit.ts` — KV-backed, fails open if KV is down),
   and drops bots via a `botcheck` honeypot (returns fake success so they
   don't retry).
2. Validates form type + email, caps field lengths, strips control characters
   from anything that reaches an email header.
3. If Contact's newsletter checkbox is checked, adds the submitter to
   Constant Contact (best-effort; a failure is logged, never surfaced).
4. Emails staff through `src/lib/mail.ts`, which uses the first configured
   provider — **Resend** (`RESEND_API_KEY`) or Microsoft Graph (`MS_GRAPH_*`).
   Subject is built from the chosen reason(s); Reply-To is the submitter, so
   staff just hit Reply. A Contact submission with "Media inquiry" goes to
   Sean; everything else goes to Jan.

**The email is the primary record of a submission.** If delivery fails
(or no provider is configured), the route parks the full inquiry on a capped
Redis list in the KV store (`inquiryStore.ts`, key `inquiries:undelivered`)
and still shows the visitor a success message. **Someone must collect those:**
`npx vercel env pull .env.local && npm run inquiries` prints them, newest
first. Delivered inquiries are not stored. Only if KV is also unavailable
does the visitor see a 500 with Jan's address to email directly.

Recipients come from `CONTACTS` in `src/lib/site.ts` — the same two people
the Contact page prints — bound in the route as `NOTIFY_EMAIL`
(jmoore@ogeecheetech.edu — everything) and `NOTIFY_EMAIL_MEDIA`
(spayne@ogeecheetech.edu — fires when "Media inquiry" is checked). Changing
an address there changes both what visitors see and where forms deliver.
⚠️ `MEDIA_REASON` in the route must match the Contact form's "Media inquiry"
label exactly — renaming one without the other silently breaks the routing.

**Form options:** Partner form checkboxes are generated from
`DEFAULTS.pathways` in `partners/page.tsx`, **deliberately not 1:1** —
`FORM_LABEL_OVERRIDES` / `EXTRA_FORM_OPTIONS` let form choices diverge from
the pathway cards on purpose. Don't "fix" the mismatch. Contact's reason is a
single-select dropdown from `DEFAULTS.contactReasons` in `contact/page.tsx`,
by choice.

A third form type, `tour`, is fully supported by the route and `InquiryForm`
but has no UI — see Book a Tour in §10.

### Resend (the live provider — interim)

**Live since 2026-09-15.** Resend is a stopgap, not the settled answer: it
got the forms delivering at launch without waiting on an OTC Microsoft 365
admin. Whether it stays, moves to Graph (below), or is replaced by whatever
Third Wave Digital brings is undecided. Because `mail.ts` picks the provider,
switching is an env-var change, not a code change.

- Sends as `GTCIO Website <website@gtcio.org>` (override with `MAIL_FROM`;
  must stay on the verified domain). Free tier: 3,000/month, 100/day.
- Vercel → gtcio-site → Integrations → **Resend** (Marketplace) injects
  `RESEND_API_KEY` into **Production and Preview only** — not Development, so
  `npm run dev` has no provider. It also injects `RESEND_EMAIL_DOMAIN`, which
  the code doesn't read.
- `gtcio.org` is verified in the Resend dashboard (DKIM TXT + the bounce
  subdomain's MX/TXT, at GoDaddy). If those records are removed every send
  403s and submissions silently fall back to KV.
- Verified 2026-09-15 on a preview deployment: both forms, both recipient
  routes, Reply-To, and DKIM/SPF/DMARC all pass. Jan's first real message may
  land in Junk at ogeecheetech.edu until Microsoft 365 has seen the sender.

**Testing email without emailing Jan or Sean.** `RESEND_API_KEY` is a
*sensitive* Vercel var — `vercel env pull` gives a blank placeholder, so
real sends can't be tested locally. Deploy a preview with the test hook
instead:

```bash
npx vercel deploy -e NOTIFY_EMAIL_OVERRIDE=you@example.com
```

Every notification then goes to that address, subject prefixed
`[TEST → <intended recipient>]`. Preview URLs sit behind Vercel
Authentication, so submit from a browser signed in to Vercel. **Never set
`NOTIFY_EMAIL_OVERRIDE` on Production** — real inquiries would stop reaching
staff.

Rotate/reconnect: Resend dashboard → API Keys. The Vercel integration owns
the key; removing the integration removes the var and the route falls back
to KV silently — check `npm run inquiries` after any change here.

### Microsoft Graph one-time setup (alternate provider — not done)

Code is written and dormant (`graphMail.ts`); only used if `RESEND_API_KEY`
is absent, so switching means setting these vars **and removing the Resend
integration**. Needs an OTC Microsoft 365 tenant admin:

1. Pick a sending mailbox (a shared one like gtcio-website@ogeecheetech.edu
   survives staff turnover) → `MS_GRAPH_SENDER_EMAIL`.
2. Azure portal → App registrations → New registration (no redirect URI —
   this is a client-credentials grant). Note tenant + client IDs.
3. Create a client secret; copy its value immediately (shown once).
4. API permissions → Microsoft Graph → **Application** permissions →
   `Mail.Send` → **Grant admin consent** (required; without it every call 401s).
5. **Scope the app to the one mailbox** — `Mail.Send` as an application
   permission can otherwise send as *any* mailbox in the tenant:
   `New-ApplicationAccessPolicy -AppId <client-id> -PolicyScopeGroupId <mailbox> -AccessRight RestrictAccess`
   in Exchange Online PowerShell, then `Test-ApplicationAccessPolicy`.
6. Set all four `MS_GRAPH_*` vars in Vercel (Production + Preview), remove
   the Resend integration, and redeploy.
7. Test for real: submit Contact twice — once with "Media inquiry" selected,
   once with anything else — confirm Sean/Jan each get the right
   one, with Reply-To set.

Troubleshooting: 401/403 = missing admin consent (step 4) or access policy
excludes the sender (step 5). 404 on sendMail = `MS_GRAPH_SENDER_EMAIL`
isn't a real mailbox.

## 6. Environment & config

`.env.local` (gitignored) and Vercel env vars — `.env.example` documents all
of them:

```
RESEND_API_KEY / MAIL_FROM (optional)    injected by the Resend integration (§5)
NOTIFY_EMAIL_OVERRIDE                    preview-only test hook — never Production (§5)
MS_GRAPH_TENANT_ID / _CLIENT_ID / _CLIENT_SECRET / _SENDER_EMAIL   (§5, alternate)
CONSTANT_CONTACT_CLIENT_ID / _CLIENT_SECRET / _SETUP_SECRET        (§8)
KV_REST_API_URL / KV_REST_API_TOKEN     auto-injected by the Upstash store (§8)
SITE_ACCESS_PIN                          optional site gate; unset = off (unset since launch)
```

**Canonical host** (`src/proxy.ts`): when `VERCEL_ENV=production`, any request
whose `Host` isn't `gtcio.ogeecheetech.edu` (i.e. `www.gtcio.org`, `gtcio.org`,
`gtcio-site.vercel.app`) is 308'd to the canonical URL (`SITE_URL` in
`src/lib/site.ts`). Preview deployments are unaffected. Every page also emits
a `<link rel="canonical">` and per-page description/Open Graph tags.

**Site-wide PIN gate** (same file): if `SITE_ACCESS_PIN` is set,
visitors without the cookie are redirected to `/site-pin`; a correct entry
sets a 30-day httpOnly cookie. A shared-PIN deterrent, **not** auth — no rate
limiting, PIN stored plaintext in the holder's own cookie. **Unset = fails
open** (site fully public), deliberately, so a missing env var can't lock
everyone out. Bypassed: `/site-pin`, its API, the Constant Contact OAuth
callback, and all static assets. The post-PIN `next` path goes through
`safeNextPath()`, which rejects `//host` and `/\host` forms (both resolve to
a foreign origin under WHATWG URL parsing) — keep using it.

**Removed at launch (2026-09-15)** — the site is public. The gate code stays
in case a future pre-release needs it: set `SITE_ACCESS_PIN` in Vercel and
redeploy; `npx vercel env rm SITE_ACCESS_PIN production` + redeploy turns it
off again.

**`next.config.ts`:**

- Security headers on every route: `X-Frame-Options: DENY`, `nosniff`,
  Referrer-Policy, Permissions-Policy, HSTS, and a full CSP
  (`default-src 'self'` plus the two Adobe Fonts hosts; `'unsafe-inline'` on
  script/style is required by Next's hydration payload and React inline
  styles — nonces would force every page dynamic). Adding any new third
  party (analytics, embeds, a YouTube iframe) means adding its origin to the
  CSP in `next.config.ts` or it is silently blocked. Dev gets
  `'unsafe-eval'`; preview deployments get `vercel.live` for the toolbar.
- ⚠️ **`public/videos|images|documents` are served immutable, cached one
  year. Never change one of those files in place** — rename it (bump a
  version suffix) and update references, or prior visitors see the stale
  version for up to a year. Originals of re-encoded media live outside the
  repo in `../media-originals/`; if re-encoding, start from an original
  there, never from an already-compressed pass.
- No `images.remotePatterns` — every image is local. A future remote-image
  integration must add that config back or its images 500.
- `/iot-diploma-program/certifications` 308-redirects to `/credentials`
  (an old published URL).

**The canonical origin is `SITE_URL` in `src/lib/site.ts`** — feeds
`metadataBase`, `robots.ts`, `sitemap.ts`. On a domain move change it there.

## 7. Brand

Real OTC brand assets. Don't substitute a generic palette.

| Token | Value |
| --- | --- |
| `brand-red` | `#C4122F` (primary) |
| `brand-black` / `brand-white` | `#000000` / `#FFFFFF` |
| `brand-silver` | `#898B8E` |
| `brand-gray` | `#6B6D70` — **text on light backgrounds only.** Brand silver is 3.4:1 on white, under WCAG AA's 4.5:1; this darker tint of it reads 5.2:1 on white and 4.7:1 on the lightest tinted cards. Silver stays for rules, borders, and text on black (6:1). Gold is never used as text on a light background (1.7:1). |
| `brand-teal` | `#007586` (accent) |
| `brand-gold` | `#F5BD16` (accent) |

Defined in `src/app/globals.css` (Tailwind v4 `@theme inline`).

**Logo:** `public/images/gtcio-logo.png` (red/black, header) and
`gtcio-logo-white.png` (footer) — **two separate source files, never one file
plus a CSS filter.** The OTC diamond in the mark is color-on-color, so
`brightness-0 invert` destroys it; the white file is a dedicated export with
a real transparency cutout. Swap both from the same source if the mark
changes (OTC Design Hub on the PR_Marketing share).

**Type — Trade Gothic Next via Adobe Fonts**, kit `jok5hww` on OTC's Creative
Cloud licence, linked in `src/app/layout.tsx`. Arial Narrow (the brand
guide's approved substitute) is the fallback. Faces: `.font-display` = Heavy
Compressed 800 (big headlines only — illegible at nav sizes), `.font-ui` /
`.font-heading` = Condensed Bold 700, body = Condensed 400.

Two traps that cost real time:

1. **Never wrap the Adobe `<link>` in a manual `<head>`** in the root layout
   — Next silently drops it, the Arial Narrow fallback looks fine, and
   `document.fonts.check()` still returns true. React hoists the link on its
   own. Verify by grepping the served HTML for `typekit`, never by
   screenshot.
2. **`font-display` is set per family in Adobe's dashboard**, not in this
   repo, and a family left on `auto` renders invisible text for up to ~3s.
   All faces should read `swap`:
   `curl -s https://use.typekit.net/jok5hww.css | grep -o 'font-display:[a-z]*' | sort | uniq -c`

Adobe's files cannot be self-hosted (no `next/font`). Web projects have no
domain allowlist — the kit works on any domain (confirmed on www.gtcio.org).

**Partner logos are third-party trademarks.** All five current partners are
confirmed authorized. Before adding a new company's logo, confirm
authorization and visually verify the file is actually their logo.

## 8. Newsletter — Constant Contact

The footer form (every page, `NewsletterSignup.tsx`) POSTs to
`/api/newsletter`, which adds the address to the **"GTCIO Website Sign-ups"**
list via Constant Contact's v3 API. The Contact form's opt-in checkbox reuses
the same call.

- **Auth is OAuth2 authorization-code** — a human authorizes once, then
  refresh is automatic. **Constant Contact rotates the refresh token on every
  use**, so tokens must live in a runtime-writable store: **Vercel KV**
  (`constantContactStore.ts`), keyed `constantContactAuth`. A build-time env
  var cannot work here.
- The list is found-or-created lazily on first signup; its id is then cached.
- Signups upsert via `/contacts/sign_up_form` (purpose-built for opt-in
  forms). Name fields are optional and omitted when blank so a bare-email
  re-signup never blanks an existing contact's name.
- Constant Contact's list is the only record — by design.

**Setup/reconnect** (connected — last run 2026-09-14, see §9): set the three `CONSTANT_CONTACT_*` vars in
Vercel, redeploy, then visit
`https://gtcio.ogeecheetech.edu/api/constant-contact/oauth/start?secret=<CONSTANT_CONTACT_SETUP_SECRET>`
while logged into the Constant Contact account that should own the list, and
approve. "Constant Contact is connected." = tokens saved. The callback
overwrites cleanly, so re-running is always safe. If the form errors with
"not connected yet" in the function logs, this step hasn't run since the
store was last empty; any other CC error usually means the app was
disconnected on Constant Contact's side (Account → Integrations) — re-run
the same URL.

## 9. Open work

- **Confirm form email reaches staff on production.** Resend is deployed to
  Production and verified on a preview (§5), and the rest of the launch
  checklist is done (PIN removed, vercel.app 308s to www, CSP live — all
  2026-09-15). Remaining: submit each live form once for real, confirm Jan
  (and Sean, for a media inquiry) receive it, have them mark it Not Junk if
  needed, and check `npm run inquiries` is empty. Then delete this item.
- **Decide Resend's long-term status.** It's interim (§5). Options: keep it
  (move the Resend account/integration to OTC or Third Wave with the Vercel
  project), have OTC register the Graph app, or adopt Third Wave's provider.
- **Constant Contact token store restored 2026-09-14.** The first Upstash
  store (`upstash-kv-citrine-lamp`) was uninstalled but its `KV_*` vars stayed
  in Vercel pointing at a dead host, so signups failed silently. Replaced by
  `upstash-kv-coffee-yacht`; §8's OAuth step re-run on www.gtcio.org. If the
  store is ever removed, delete the stale `KV_*`/`REDIS_URL` vars before
  connecting a new one. (Still an interim home — Third Wave may relocate it.)
- **Print/flipbook sync is done** (2026-08-27). Both brochures and both
  flipbooks now carry the same content as the site: the diploma PDF is
  `industrial-operations-program-5.pdf` and the catalog is
  `otc-industrial-systems-training-program-5.pdf`, and both fliphtml5 books
  (`exygb/xhzf` and `exygb/kvbr`) were refreshed by hand on fliphtml5's side —
  verified by loading them, not just by the URLs still resolving. **Their URLs
  survived the refresh**, so `DESTINATIONS.iotProgramFlipbook` and the Training
  page's `CATALOG_URL` did not change; a future re-upload that creates a new
  book ID would require editing both. Nothing in this repo drives fliphtml5, so
  a PDF swap always needs that manual step or the "VIEW …" buttons silently
  serve a stale brochure.
- **🟡 Possible unstated selling point:** mapping the program's credentials
  against SACA's published Specialist requirements suggests graduates may
  complete a full **Electrical Systems Specialist** certification, not just
  micro-credentials. The site deliberately doesn't claim this — the mapping
  came from a third-party mirror and GTCIO has never claimed it. If GTCIO
  confirms, it's a strong recruiting line (see `SACA_TIERS` comment).
- **Facility photo gallery** shows placeholders until real photos exist
  (gallery array in `facility/page.tsx`).
- **Rate limiting** on `/api/inquiry` and `/api/newsletter` is 5/IP/10 min
  via KV (`rateLimit.ts`); it fails open if KV is down. If spam still
  appears, add a Vercel WAF rule before reaching for CAPTCHAs.
- If Vercel's Git connection is ever disconnected/reconnected, re-check the
  project's `deployHooks` afterward — reconnecting has silently dropped them
  before.

## 10. Hidden-but-restorable sections

- **Book a Tour is off the site until 2026-10-26** (tours begin after the
  10/15 grand opening). The backend still supports `formType: "tour"`;
  restoring means writing the section copy fresh in `facility/page.tsx`
  (`<section id="book-a-tour">`), re-adding the Header/Footer links, and a
  `tour` destination in `links.ts`. Keep `SITEMAP.html` in sync.
- **The Partners page's "Our Partners" directory (logo collage + five
  partner cards) is hidden** — `SHOW_PARTNER_DIRECTORY = false` in
  `partners/page.tsx`. Flip to `true` to restore; all data is still in
  `partners.ts`. No return date set.
- **The Facility page's Equipment Gallery is hidden** (2026-09-15) —
  `SHOW_EQUIPMENT_GALLERY = false` in `facility/page.tsx`. It only ever
  showed four "PHOTO PLACEHOLDER" tiles. Flip to `true` once the labels are
  replaced with real `<Image>`s.

## 11. Standing content rules

Editorial rules that outlive any one edit. Most were set by the stakeholders
directly; don't relitigate them in new copy.

- **Terminology: "credentials", never generic "certification(s)".**
  Proper nouns keep their names (SACA = Smart Automation *Certification*
  Alliance, "Gold Certification Site", "FANUC Certified Robot Operator",
  ISO 17024 "personnel certification"), and code identifiers
  (`DESTINATIONS.certifications`, the redirect) deliberately keep their old
  names — renaming them breaks seeded references.
- **"Manufacturing facility", never "factory"** — stakeholder direction,
  applies to all future copy.
- **Facility facts (current, confirmed):** 39,700 sq ft · $27M ·
  ~460,000 instructional hrs/yr capacity · 12 industrial labs. Older
  published figures (37–40k sq ft, $22.8–26M, GISIRTC as a name) are
  **superseded — don't harvest them** from old PDFs or news headlines, which
  deliberately remain as published on the News page.
- **Program facts (current, confirmed):** four semesters · ~$9,500 before
  aid (HOPE Grant, HOPE Career Grant, Pell apply) · 53 credit hours across
  15 courses (12 program + 3 gen-ed).
- **Dates:** construction completes 9/26 · grand opening **10/15/26** ·
  tours from 10/26 · first classes 8/17/26 (on OTC's main campus, moving to
  the new building when it opens — that's deliberate and explained on the
  site). Never publish "opening September 2026" (an old brochure's claim).
- **Address: 66 AJ Riggs Road, Statesboro, GA 30458.** "1 Joe Kennedy Blvd"
  is OTC's main campus, not GTCIO — it appears in old source documents;
  don't harvest it. The address is `ORG.address` in `src/lib/site.ts`
  (footer + Contact) and repeated in prose in the About FAQ — change both.
- **The mission statement and the Home hero headline are the same sentence
  on purpose** ("Building a workforce ready for industry transformation.") —
  if one changes, change both (`about/page.tsx` + `(site)/page.tsx`), and
  note the hero headline is sized to hold one line (see its comment).
- **Every diploma graduate is credentialed through SACA** — stated as fact,
  not an optional add-on.
- **Names from old brochures are unreliable.** Several formerly-listed
  contacts are deliberately removed from the site; verify any person is
  still in their role before (re)publishing a name. The Advisory Board
  roster was individually fact-checked — apparent errors there (e.g. Stuart
  Gregory's organization) have already been checked with the owner and are
  correct as published.
- **The News page's old headlines carry superseded specs deliberately** —
  outlets' headlines aren't annotated or corrected; the visible dates supply
  context. Excerpts avoid restating stale numbers.
- **Credentials require passing the SACA exam** — completing a course alone
  does not award one, and the site says so explicitly. Don't soften that.
- **Accessibility floor is WCAG 2.1 AA** (OTC is a public college; ADA Title
  II applies). Body text on white uses `text-brand-gray`, not
  `text-brand-silver`; no gold text on light backgrounds; every hero video has
  the pause control `HeroVideo.tsx` provides; keep the skip link, `aria-current`
  nav, and `role="alert"` on form errors. Check new pages with axe before
  shipping.
- **The section directly under any PageHero must stay light.** A dark band
  there makes the hero photo read as fading to black early — a real
  stakeholder complaint, fixed once already. Follow the hero → white-section
  pattern.
- **The IOT Diploma FAQ is ordered as a student funnel** (when → experience →
  apply → where → online → how long → cost → credential → earnings). Insert
  new questions into that flow, don't append.
- **The desktop nav is 9 items and just fits at the `xl` breakpoint.** A
  tenth item or longer labels need re-measuring — there's no overflow
  handling.
- **`public/SITEMAP.html` is a stakeholder deliverable** (goes to the VP for
  sign-off, served publicly, noindex). Keep it in sync when routes,
  sections, or §9/§10 status change. Not to be confused with
  `src/app/sitemap.ts` (the machine `sitemap.xml`, derived from `nav.ts`) —
  a new route updates `SITEMAP.html` by hand, plus `nav.ts` and `links.ts`.
- **`EDITING.md`** is the plain-English "where does this copy live" guide —
  update it if the content layout changes.

## 12. Commands

```bash
npm run dev                # dev server (localhost:3000)
npm run build              # production build
npx tsc --noEmit           # typecheck
npx eslint .               # lint
npm run inquiries          # print form submissions parked in KV (§5)

# Exercise the form endpoint without a browser:
curl -s -X POST http://localhost:3000/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"formType":"contact","reason":"Media inquiry","firstName":"A","lastName":"B","email":"a@b.com","message":"hi"}'
# With no provider configured locally this returns 500 and the visitor-facing
# error (§5); on Vercel it sends via Resend, or parks in KV if that fails.
```

Push to `main` → Vercel deploys automatically. (The repo is public as of
2026-08-27 — Vercel’s Hobby plan cannot auto-deploy a **private** org-owned
repo, which is what silently broke this before. Keep it public, or move the
project to a Pro team, or push-to-deploy stops working again.)

## 13. Accounts & handoff

| Service | Identifier | Owner | Used for |
| --- | --- | --- | --- |
| GitHub | `Ogeechee-Tech-PR-and-Marketing/gtcio-site` (**public**, §12) | OTC PR & Marketing org (Jake Hallman: admin) | Source of truth; push to `main` deploys |
| Vercel | `jake-hallmans-projects/gtcio-site` | Jake Hallman — expected to move with the Third Wave Digital handoff | Hosting, env vars, function logs |
| Upstash for Redis (Vercel Marketplace) | `upstash-kv-coffee-yacht` | Jake | Constant Contact token store (§8) |
| Adobe Fonts | web project kit `jok5hww` | OTC Creative Cloud licence | Trade Gothic Next (§7 — settings live in Adobe's dashboard) |
| Resend (Vercel Marketplace) | domain `gtcio.org` | Jake — moves with the Vercel project | Form notification email (§5) |
| Microsoft Graph | Azure AD app — not registered (§5) | OTC Microsoft 365 tenant | Alternate email provider, unused |
| Constant Contact | Custom App at developer.constantcontact.com | OTC/GTCIO Constant Contact account | Newsletter list (§8) |

(A dormant Sanity project, `kjz4q8d4`, holds the pre-removal CMS content as a
historical record. Nothing in this repo uses it.)

**New developer setup:** get invited to the GitHub repo and Vercel project;
`npm install`; copy `.env.example` → `.env.local`. The site renders fully
with no env vars — they only gate the forms (§5) and newsletter (§8). Read
§4 before touching content.

**Adding a page:** create `src/app/(site)/<slug>/page.tsx` (inside `(site)`
or it loses the chrome) with a `DEFAULTS` object; add it to `NAV_ITEMS` in
`src/lib/nav.ts` (⚠️ re-measure the nav — the header, the Footer's Explore
column and `sitemap.xml` all follow); add a `DESTINATIONS` key in `links.ts`
if buttons should target it; update `public/SITEMAP.html` (§11).
