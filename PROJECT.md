# GTCIO website — project brief

What a developer needs to pick this project up cold. Last updated 2026-08-27.
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

- **Live:** https://gtcio-site.vercel.app
- **Repo:** https://github.com/Ogeechee-Tech-PR-and-Marketing/gtcio-site (private)
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
| Framework | Next.js **16.2.10**, App Router, Turbopack |
| UI | React 19.2, Tailwind **v4** (CSS-first config, no `tailwind.config.js`) |
| Language | TypeScript, strict |
| Email | Microsoft Graph / Azure AD app (§5) |
| Fonts | Adobe Fonts — Trade Gothic Next (§7) |
| Hosting | Vercel — project `jake-hallmans-projects/gtcio-site` |
| Deploys | **Auto-deploy on push to `main`.** No manual step, no other trigger. |

> ⚠️ Next.js 16 post-dates most AI training data. `AGENTS.md` says it too:
> read the bundled docs in `node_modules/next/dist/docs/` before writing
> framework code. `params` and `draftMode()` are async, etc.

## 3. Layout of the code

```
src/middleware.ts         site-wide PIN gate (§6)
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
  site.ts                 SITE_URL — the canonical origin
  site-pin.ts             cookie name shared by middleware + api/site-pin
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
  graphMail.ts            Microsoft Graph sendMail client (§5)
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

Shared content lives in `src/lib/`: `partners.ts`, `news.ts`, `links.ts`
(see §3). Site-wide strings (banner, address, footer, newsletter copy) are
constants in `Header.tsx`, `Footer.tsx`, and `NewsletterSignup.tsx`.

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

1. Rejects oversized payloads (>20 KB) and drops bots via a `botcheck`
   honeypot (returns fake success so they don't retry).
2. Validates form type + email, caps field lengths, strips control characters
   from anything that reaches an email header.
3. If Contact's newsletter checkbox is checked, adds the submitter to
   Constant Contact (best-effort; a failure is logged, never surfaced).
4. Emails staff via Microsoft Graph `sendMail`, subject built from the chosen
   reason(s), Reply-To set to the submitter.

**🔴 The email is the only record of a submission.** If Graph delivery fails
(or isn't configured — see §9), the route returns 500 and the inquiry is
gone. There is no inbox, queue, or database behind it.

Recipients are fixed constants in the route file: `NOTIFY_EMAIL`
(jmoore@ogeecheetech.edu — everything) and `NOTIFY_EMAIL_MEDIA`
(spayne@ogeecheetech.edu — fires when "Media inquiry" is checked).
⚠️ `MEDIA_REASON` in the route must match the Contact form's "Media inquiry"
label exactly — renaming one without the other silently breaks the routing.

**Form options:** Partner form checkboxes are generated from
`DEFAULTS.pathways` in `partners/page.tsx`, **deliberately not 1:1** —
`FORM_LABEL_OVERRIDES` / `EXTRA_FORM_OPTIONS` let form choices diverge from
the pathway cards on purpose. Don't "fix" the mismatch. Contact's dropdown is
`DEFAULTS.contactReasons` in `contact/page.tsx`, single-select by choice.

A third form type, `tour`, is fully supported by the route and `InquiryForm`
but has no UI — see Book a Tour in §10.

### Microsoft Graph one-time setup (still not done — see §9)

Needs an OTC Microsoft 365 tenant admin:

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
6. Set all four `MS_GRAPH_*` vars in Vercel (Production) and redeploy.
7. Test for real: submit Contact twice — once with only "Media inquiry"
   checked, once with anything else — confirm Sean/Jan each get the right
   one, with Reply-To set.

Troubleshooting: 401/403 = missing admin consent (step 4) or access policy
excludes the sender (step 5). 404 on sendMail = `MS_GRAPH_SENDER_EMAIL`
isn't a real mailbox.

## 6. Environment & config

`.env.local` (gitignored) and Vercel env vars — `.env.example` documents all
of them:

```
MS_GRAPH_TENANT_ID / _CLIENT_ID / _CLIENT_SECRET / _SENDER_EMAIL   (§5)
CONSTANT_CONTACT_CLIENT_ID / _CLIENT_SECRET / _SETUP_SECRET        (§8)
KV_REST_API_URL / KV_REST_API_TOKEN     auto-injected by Vercel KV (§8, §9)
SITE_ACCESS_PIN                          optional site gate; unset = off
```

**Site-wide PIN gate** (`src/middleware.ts`): if `SITE_ACCESS_PIN` is set,
visitors without the cookie are redirected to `/site-pin`; a correct entry
sets a 30-day httpOnly cookie. A shared-PIN deterrent, **not** auth — no rate
limiting, PIN stored plaintext in the holder's own cookie. **Unset = fails
open** (site fully public), deliberately, so a missing env var can't lock
everyone out. Bypassed: `/site-pin`, its API, the Constant Contact OAuth
callback, and all static assets.

**`next.config.ts`:**

- Security headers on every route: `X-Frame-Options: DENY`,
  `frame-ancestors 'none'`, `nosniff`, Referrer-Policy, Permissions-Policy,
  a baseline CSP (`object-src 'none'; base-uri 'self'` — deliberately not a
  full `default-src`, which Adobe Fonts would make fragile), HSTS.
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
`metadataBase`, `robots.ts`, `sitemap.ts`. On a domain move change it there,
plus the Adobe Fonts project (§7).

## 7. Brand

Real OTC brand assets. Don't substitute a generic palette.

| Token | Value |
| --- | --- |
| `brand-red` | `#C4122F` (primary) |
| `brand-black` / `brand-white` | `#000000` / `#FFFFFF` |
| `brand-silver` | `#898B8E` |
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

Adobe's files cannot be self-hosted (no `next/font`). **On a domain move, add
the new domain to the Adobe Fonts web project** or fonts stop loading.

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

**Setup/reconnect** (the app-side config exists; the token store is empty
until §9's KV item is done): set the three `CONSTANT_CONTACT_*` vars in
Vercel, redeploy, then visit
`https://gtcio-site.vercel.app/api/constant-contact/oauth/start?secret=<CONSTANT_CONTACT_SETUP_SECRET>`
while logged into the Constant Contact account that should own the list, and
approve. "Constant Contact is connected." = tokens saved. The callback
overwrites cleanly, so re-running is always safe. If the form errors with
"not connected yet" in the function logs, this step hasn't run since the
store was last empty; any other CC error usually means the app was
disconnected on Constant Contact's side (Account → Integrations) — re-run
the same URL.

## 9. Open work

- **🔴 Microsoft Graph is not configured — form submissions are currently
  LOST.** None of the four `MS_GRAPH_*` vars are set in Vercel, and there is
  no fallback record (§5). Every Partner/Contact submission disappears until
  an OTC tenant admin completes §5's setup. Urgent, and email delivery has
  never been tested end-to-end.
- **🔴 Vercel KV is not provisioned — the newsletter is dead.** Vercel →
  gtcio-site → Storage → Create Database auto-injects the two KV vars; then
  §8's OAuth step must be re-run once to populate the new store. Until then
  every signup fails. (KV is explicitly an interim home — Third Wave may
  relocate this integration along with the forms.)
- **🟡 Flipbook lags the print brochure.** Print brochure sync is otherwise
  **done** (2026-08-27): the `V03` export landed as
  `industrial-operations-program-4.pdf` and its credential matrix now agrees
  with `iot-curriculum.ts` row for row, so the PDF no longer lags the site.
  What's left is `DESTINATIONS.iotProgramFlipbook` — the fliphtml5 flipbook
  is hosted outside this repo and must be refreshed on fliphtml5's side, or
  "VIEW IOT PROGRAM" keeps serving the superseded brochure while "DOWNLOAD
  IOT PROGRAM" serves the current one.
- **🟡 Possible unstated selling point:** mapping the program's credentials
  against SACA's published Specialist requirements suggests graduates may
  complete a full **Electrical Systems Specialist** certification, not just
  micro-credentials. The site deliberately doesn't claim this — the mapping
  came from a third-party mirror and GTCIO has never claimed it. If GTCIO
  confirms, it's a strong recruiting line (see `SACA_TIERS` comment).
- **Facility photo gallery** shows placeholders until real photos exist
  (gallery array in `facility/page.tsx`).
- **No rate limiting** on `/api/inquiry` or `/api/newsletter` — honeypots and
  payload caps only. If spam appears, add a Vercel WAF rate-limit rule
  (available on Hobby) before reaching for CAPTCHAs.
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
  don't harvest it. The address lives in `Footer.tsx`, `contact/page.tsx`,
  and the About FAQ — change all together.
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
  `src/app/sitemap.ts` (the machine `sitemap.xml`) — a new route updates
  both, plus `Header.tsx` and `links.ts`.
- **`EDITING.md`** is the plain-English "where does this copy live" guide —
  update it if the content layout changes.

## 12. Commands

```bash
npm run dev                # dev server (localhost:3000)
npm run build              # production build
npx tsc --noEmit           # typecheck
npx eslint .               # lint

# Exercise the form endpoint without a browser:
curl -s -X POST http://localhost:3000/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"formType":"contact","reason":"Media inquiry","firstName":"A","lastName":"B","email":"a@b.com","message":"hi"}'
# 500 with Graph unconfigured is expected (§5), not a bug.
```

Push to `main` → Vercel deploys automatically.

## 13. Accounts & handoff

| Service | Identifier | Owner | Used for |
| --- | --- | --- | --- |
| GitHub | `Ogeechee-Tech-PR-and-Marketing/gtcio-site` (private) | OTC PR & Marketing org (Jake Hallman: admin) | Source of truth; push to `main` deploys |
| Vercel | `jake-hallmans-projects/gtcio-site` | Jake Hallman — expected to move with the Third Wave Digital handoff | Hosting, env vars, function logs |
| Vercel KV | not yet provisioned (§9) | Jake | Constant Contact token store |
| Adobe Fonts | web project kit `jok5hww` | OTC Creative Cloud licence | Trade Gothic Next (§7 — settings live in Adobe's dashboard) |
| Microsoft Graph | Azure AD app — not yet registered (§5, §9) | OTC Microsoft 365 tenant | Form notification email |
| Constant Contact | Custom App at developer.constantcontact.com | OTC/GTCIO Constant Contact account | Newsletter list (§8) |

(A dormant Sanity project, `kjz4q8d4`, holds the pre-removal CMS content as a
historical record. Nothing in this repo uses it.)

**New developer setup:** get invited to the GitHub repo and Vercel project;
`npm install`; copy `.env.example` → `.env.local`. The site renders fully
with no env vars — they only gate the forms (§5) and newsletter (§8). Read
§4 before touching content.

**Adding a page:** create `src/app/(site)/<slug>/page.tsx` (inside `(site)`
or it loses the chrome) with a `DEFAULTS` object; add it to `NAV_ITEMS` in
`Header.tsx` (⚠️ re-measure the nav) and the Footer's Explore column; add a
`DESTINATIONS` key in `links.ts` if buttons should target it; update **both**
sitemaps (§11).
