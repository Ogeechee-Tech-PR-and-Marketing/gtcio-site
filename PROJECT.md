# GTCIO website — project brief

Everything a developer or AI agent needs to pick this project up cold. Last
updated 2026-07-16. Check claims against the code before trusting them.

---

## 1. What this is

The website for **GTCIO** (Georgia Training Center for Industrial Operations), a
division of **Ogeechee Technical College** (OTC) in Statesboro, GA. GTCIO trains
people for industrial maintenance / automation / controls work, and launches an
Industrial Operations Technology (IOT) diploma program in **August 2026**.

- **Live:** https://gtcio-site.vercel.app
- **Repo:** https://github.com/revjake1/gtcio-site (private, GitHub user `revjake1`)
- **Editing UI (Sanity Studio):** https://gtcio-site.vercel.app/studio
- **Local source:** `/Users/jhallman/Documents/GTCIO site/gtcio-site`

**Stakeholder:** Jan Moore, VP for Economic Development at OTC. She drives
requirements. She asked for the site to look and feel like
[gacybercenter.org](https://www.gacybercenter.org/) — thin dark utility banner,
full-width photo hero, Partners page as a logo directory + "Become a Partner"
CTA. That structure is already implemented; don't redesign it without being asked.

**History worth knowing:** this started as a Wix build. The Wix AI builder
repeatedly failed to apply brand corrections, so it was abandoned for a
hand-coded Next.js site. **Do not go back to Wix** unless explicitly asked. A few
stray/abandoned Wix sites may still exist in the `jhallman32` Wix account.

---

## 2. Stack

| | |
| --- | --- |
| Framework | Next.js **16.2.10**, App Router, Turbopack |
| UI | React 19.2, Tailwind **v4** (CSS-first config, no `tailwind.config.js`) |
| Language | TypeScript, strict |
| CMS | Sanity v6 (`next-sanity` v13) |
| Email | Web3Forms (see §5) |
| Fonts | Adobe Fonts / Typekit — Trade Gothic Next (see §7) |
| Hosting | Vercel — project `jake-hallmans-projects/gtcio-site` |
| Deploys | **Auto-deploy on push to `main`.** No manual deploy step. |

> ⚠️ **Next.js 16 is not the Next.js in your training data.** APIs and
> conventions differ. `AGENTS.md` says this too, and it's right: read the bundled
> docs in `node_modules/next/dist/docs/` before writing framework code. `params`
> and `draftMode()` are async, etc.

---

## 3. Layout of the code

```
src/app/
  layout.tsx              root: <html>/<body> only, no chrome
  (site)/                 ← every public page. Route group.
    layout.tsx            Header + Footer + SanityLive + VisualEditing
    page.tsx              /            (home)
    about/                /about
    training/             /training    ("IOT Training Programs" in the nav)
    iot-diploma-program/  /iot-diploma-program
    facility/             /facility
    partners/             /partners
    news/                 /news
    contact/              /contact
  studio/[[...tool]]/     /studio      ← Sanity Studio, embedded
  api/
    draft-mode/           enable + disable, for the Studio's live preview
    inquiry/              POST target for all three forms (§5)
src/components/           Header, Footer, PageHero, Button, InquiryForm,
                          NewsletterSignup (home page, UI-only — see §8)
sanity/
  env.ts                  projectId / dataset / apiVersion
  lib/client.ts           read client
  lib/writeClient.ts      write client — server-only, form submissions
  lib/live.ts             sanityFetch + SanityLive (draft/preview)
  lib/queries.ts          all GROQ
  lib/image.ts            urlForImage + resolveHeroImage (hotspot → focal point)
  schemaTypes/            documents/ + objects/ + heroFields.ts
  structure.ts            the Studio's left-hand menu
  presentation.ts         maps documents ↔ page URLs for "Edit on page"
sanity.config.ts          Studio config (root)
sanity.cli.ts             CLI config (root)
```

**Why the `(site)` route group exists:** so `/studio` does *not* inherit the
site's Header/Footer. If you move pages out of `(site)`, the Studio will render
with a GTCIO nav bar stapled to it. This was a real bug once. Leave it alone.

---

## 4. The CMS — read this before touching content

Sanity project **`kjz4q8d4`**, dataset **`production`**. The Studio is embedded at
`/studio` (not separately hosted). It is configured to land on the **"Edit on
page"** (Presentation) tool, so an editor sees the live site and clicks what they
want to change.

The whole point of the CMS is that **non-technical marketing staff operate it.**
Every decision below exists to protect that. Weigh it accordingly.

### Content model

- **Singletons, one per page:** `homePage`, `aboutPage`, `facilityPage`,
  `trainingPage`, `iotDiplomaProgramPage`, `partnersPage`, `newsPage`,
  `contactPage`. Each has a fixed `_id` equal to its type name. They can't be
  created, duplicated, or deleted from the Studio (see `document.actions` in
  `sanity.config.ts`). Any new singleton must be added to `singletonTypes` in
  `sanity/schemaTypes/index.ts` AND to `structure.ts` + `presentation.ts`.
- **`siteSettings`** — top banner text, address, phone, program + media contacts.
  Used by Header, Footer, and the Contact page.
- **`partner`** — one document per partner company (`logo`, `order`,
  `showOnWebsite`, plus an optional `website` URL — when set, the partner's block
  on the Partners page links out to it).
- **`newsItem`** — one document per press release / media mention (`category`
  = `press` | `media`, `title`, `date`, `source`, `url`, `excerpt`,
  `showOnWebsite`). Queried directly like `partner` (see trap 1), split into two
  groups on `/news` by `category`.
- **`formSubmission`** — a saved copy of every form inquiry (§5). Read-only;
  written only by the server, never created by hand in the Studio.
- **Objects:** `faq`, `statCard`, `pathwayCard`, plus per-page inline types
  (`curriculumStage`, `programOption`, `jobDuty`, `payRange`).
- **Dropdown sources:** `contactPage.contactReasons` (array of strings) feeds the
  Contact form's dropdown. The Become a Partner dropdown has no field of its own —
  it is derived from `partnersPage.pathways` (§5).
- Interior page heroes share `heroFields()` in `sanity/schemaTypes/heroFields.ts`.

### 🔴 Six traps that will bite you

**1. Partners are queried directly. Never reintroduce a reference list.**
The first version had `partnersPage.directory` as an array of references to
partner docs. That meant creating a partner did *nothing* until you also added it
to that list — a silent no-op that reads as "the CMS is broken" to a
non-technical editor. Now `PARTNERS_PAGE_QUERY` does:

```groq
"partners": *[_type == "partner" && showOnWebsite != false] | order(order asc, name asc)
```

Creating a partner is sufficient to publish them. `order` (number) sets position,
`showOnWebsite` (boolean) hides without deleting. **Keep it this way.**

**2. Array items must carry a `_type`.** If you seed or migrate content, every
object inside an array needs `_type` matching the schema (`{_key, _type: "faq",
...}`). Without it the *website renders fine* but the Studio shows the item as a
broken "unknown type" row an editor can't fix. This actually happened. It's
invisible from the frontend — which is exactly why it survived a browser check.

**3. Partner logos: request width only.** `urlForImage(logo).width(480).fit("max")`.
Passing **both** width and height makes Sanity crop to that aspect ratio, which
clipped the Amazon wordmark. CSS `object-contain` does the fitting. The logo field
deliberately has **no hotspot** so an editor cannot crop a company's trademark.

**4. Hero focal point comes from the Sanity hotspot.** `resolveHeroImage()` in
`sanity/lib/image.ts` converts the hotspot's image-relative x/y into an
`object-position` percentage. Use the subject's true position in the image — never
a crop offset eyeballed at one screen width, because the hero crops differently on
every viewport. Each hero falls back to a hardcoded image + hand-tuned focal point
when no CMS image is set.

**5. `writeClient` is server-only.** `sanity/lib/writeClient.ts` carries a
read+write token and imports `server-only` to guarantee it can't be pulled into a
client bundle. Never import it from a `"use client"` component, and never pass the
token to the browser.

**6. Sanity content overrides code `DEFAULTS`.** Every page component defines a
`DEFAULTS` object and renders `{...DEFAULTS, ...(cmsData)}`. Once a field exists on
the Sanity document, the CMS value wins and the code default is *never shown*. So
editing only the code default (address, hero copy, a heading, a nav-adjacent
label like the Training hero eyebrow, an FAQ answer) leaves the live site
unchanged. **When changing existing copy, change both the code default and patch
the Sanity doc.** Patch published docs with the write token from `.env.local` via
`POST /v<ver>/data/mutate/<dataset>` — `{mutations:[{patch:{id, set:{…}}}]}`;
array items patch by key, e.g. `set:{"faqs[_key==\"f3\"].answer": "…"}`. Brand-new
fields (ones no doc has ever had) are safe to change in code alone — the default
applies until an editor fills them. Local gotcha: Next's `.next/cache` fetch cache
can serve a *stale* Sanity value across `npm run build`s — `rm -rf .next/cache`
before rebuilding to verify a CMS change locally (Vercel builds fresh, so deploys
are unaffected).

### Verifying CMS work

You cannot log into the Studio (it needs Jake's password), so **do not "verify"
CMS changes by looking at the rendered website** — a correct page can hide a
broken editor (see trap 2). Use:

```bash
npx sanity schema validate                                 # schema is well-formed
npx sanity documents validate --dataset production --yes   # every doc matches the schema
```

Both should report 0 errors. The second is what catches trap 2.

---

## 5. How the forms work

Three forms — **Book a Tour** (Facility), **Become a Partner** (Partners), and
**Contact** — all render through `src/components/InquiryForm.tsx` and POST JSON to
**`src/app/api/inquiry/route.ts`**. That route, in order:

1. **Drops bots** via a `botcheck` honeypot field, returning a fake success so
   they don't retry.
2. Validates the form type and email address.
3. **Saves the inquiry to Sanity first** as a `formSubmission` document. This
   happens *before* any email is attempted, so a bounced or spam-filtered
   notification never means a lost lead. **Do not flip this order.**
4. **Then emails staff** via Web3Forms (`https://api.web3forms.com/submit`) with
   `subject` built from the dropdown choice and `replyto` set to the submitter, so
   staff can just hit Reply.
5. **Flags `emailDelivered`** on the saved document. `false` means the email did
   not go out — the Studio preview renders those as "⚠️ NOT EMAILED" so someone
   can follow up by hand.

Marketing reads these in the Studio under **"Form submissions (inbox)"**.

### Dropdowns

- **Become a Partner** — options are generated from `partnersPage.pathways`, i.e.
  the same Partnership Pathway cards displayed above the form, plus a hardcoded
  "Something else / not sure yet". This is deliberate: rename a pathway card and
  the dropdown follows, so the form can never drift out of sync with the page.
  There is no separate list to maintain — **don't add one.**
- **Contact** — options come from `contactPage.contactReasons`, editable in the
  Studio.

Whichever option the visitor picks becomes the **email subject line**.

### ⚠️ Web3Forms: the recipient is baked into the access key

Web3Forms sends to whatever address the key was **created with**. There is *no*
per-request "to" field (`ccemail` is a paid feature). Consequences:

- To change who receives inquiries, you must generate a **new key** using that
  address and update `WEB3FORMS_ACCESS_KEY`. You cannot do it in code.
- Intended recipient: **`jmoore@ogeecheetech.edu`**.

**If `WEB3FORMS_ACCESS_KEY` is unset, the site still works and still saves every
submission — it just doesn't email.** That's deliberate graceful degradation, not
a bug. See §8 for the current status.

---

## 6. Environment & config

`.env.local` (gitignored) and Vercel env vars (all three environments):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=kjz4q8d4
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-06-01
SANITY_API_READ_TOKEN=<viewer-role token, secret>
SANITY_API_WRITE_TOKEN=<editor-role token, secret — writes form submissions>
WEB3FORMS_ACCESS_KEY=<see §5; unset = no email, submissions still saved>
```

The read token is **viewer role**, used server-side for draft/preview reads only.
The write token is **editor role**, used *only* by `/api/inquiry`, via the
server-only `writeClient`. Editors authenticate to the Studio with their own Sanity
login; neither token is involved in that.

**Sanity CORS origins** (`npx sanity cors list`) currently allow
`http://localhost:3000` and `https://gtcio-site.vercel.app`.
⚠️ **If the site moves to a custom domain (e.g. a real ogeecheetech.edu address),
add that origin** or the Studio's "Edit on page" preview will silently fail:
`npx sanity cors add https://newdomain --credentials`.

`next.config.ts` allow-lists `cdn.sanity.io` for `next/image`. Any new remote
image host must be added there or images 500.

---

## 7. Brand

Real OTC brand assets are in use. Don't substitute a generic palette.

| Token | Value |
| --- | --- |
| `brand-red` | `#C4122F` (primary) |
| `brand-black` | `#000000` |
| `brand-white` | `#FFFFFF` |
| `brand-silver` | `#898B8E` |
| `brand-teal` | `#007586` (accent) |
| `brand-gold` | `#F5BD16` (accent) |

Defined in `src/app/globals.css` (Tailwind v4 `@theme inline`).
Logo: `public/images/gtcio-logo.png`.

### Type — real Trade Gothic Next, via Adobe Fonts

The brand guide's actual faces are loaded from Adobe Fonts under OTC's Creative
Cloud licence (kit `fgt0fkg`, linked in `src/app/layout.tsx`). Arial Narrow — the
guide's own approved substitute — remains the fallback.

| Class | Face | Used for |
| --- | --- | --- |
| `.font-display` | Trade Gothic Next **Heavy Compressed** (800) | Big headlines, gold eyebrow labels |
| `.font-ui` | Trade Gothic Next **Condensed Bold** (700) | Nav links, buttons, top banner |
| `.font-heading` | Condensed Bold, sentence case | Section subheads |
| body | Trade Gothic Next **Condensed** (400) | Everything else |

⚠️ **Two traps, both of which cost real time:**

1. **Never wrap the Adobe `<link>` in a manual `<head>` element** in the root
   layout — Next silently drops it. The page then renders in the Arial Narrow
   fallback and *looks completely fine*, and `document.fonts.check()` still returns
   `true` (it reports "available" for any family that falls back to a system font).
   React 19 hoists the `<link>` on its own. Verify by grepping the **served HTML**
   for `typekit`, or by measuring rendered glyph widths — never by screenshot.
2. **`font-display` is set per font family in the Adobe web project, not per
   project.** A family left on `auto` renders its text *invisible* for up to ~3s
   on slow connections. Both families are currently on **Swap** (verified
   2026-07-14) — but the setting lives in Adobe's dashboard, not in this repo, so
   it can be changed out from under the code and won't show in a diff. If text
   ever flashes invisible, check this first:
   `curl -s https://use.typekit.net/fgt0fkg.css | grep -o 'font-display:[a-z]*' | sort | uniq -c`
   (all faces should read `swap`).

Nav and buttons deliberately use Condensed Bold rather than Heavy Compressed: the
guide reserves Compressed for 20pt headers, and it becomes illegible at 12–14px.

Adobe's files **cannot be self-hosted**, so `next/font` optimisation isn't
available here. If the site ever moves to a new domain, **add that domain to the
Adobe Fonts web project** or the fonts will stop loading there.

**Partner logos are third-party trademarks.** Jake confirmed all five current
partnerships are real and authorized. Before adding any *new* company's logo,
confirm authorization first, and visually verify any sourced image is actually
that company's logo.

---

## 8. Open work

**🔴 No inquiry emails are being sent yet.** `WEB3FORMS_ACCESS_KEY` is not set, so
form submissions are being saved to the Studio inbox but **nobody is being
notified**. To finish: create a key at [web3forms.com](https://web3forms.com)
*using the address that should receive the mail* (see §5 — the recipient is tied to
the key), then set `WEB3FORMS_ACCESS_KEY` in Vercel and redeploy. Then submit the
Contact form once and confirm the email actually arrives — **email delivery has
never been tested end to end**, because it can't be without a real key.

**Sanity role:** the shared marketing account (below) was invited as
**Administrator**, which can delete the dataset and revoke the tokens the live site
depends on. It should be **Editor**. Flagged 2026-07-14 — **verify the current role
in sanity.io/manage before assuming it was fixed.** Editor may require the paid
Growth plan (~$15/seat/mo).

**Who edits the site:** a *shared* departmental mailbox,
`prmarketing@ogeecheetech.edu`, so anyone in OTC marketing can make changes — not a
single named person. Consequences: (a) all edits are attributed to that one
account, so Sanity's per-user history can't tell you *which person* changed
something; (b) the credential must be rotated when someone leaves. Dataset revision
history is 90 days, so content mistakes are recoverable.

**🟡 Newsletter signup is UI-only.** `src/components/NewsletterSignup.tsx` on the
home page validates an email and shows a confirmation but **sends nothing** — no
address is stored or transmitted. GTCIO expects to use **Constant Contact**. To
finish, either point the form's `<form action>` at a Constant Contact hosted
sign-up URL, or replace the `handleSubmit` stub with a POST to a new API route
that calls the Constant Contact API. The file header documents both paths.

Smaller items:

- **Content still pending from GTCIO:** final tuition figure, final program length,
  formal mission-statement sign-off, fuller partnership-history timeline. These
  render as visible "Placeholder…" text on the site today.
- **Advisory Board section (About page)** ships with placeholder copy
  (`advisoryBody` / `advisoryNote`). Real description + members to come; editable
  under About Page → Advisory Board.
- **Partner website links:** the Partners blocks link out only once each partner's
  `website` URL is set in the Studio. All five current partners currently have no
  URL, so their blocks render as non-clickable cards.
- **News page is empty.** `/news` shows a "coming soon" state until `newsItem`
  documents are added (press releases + media mentions). Load the OTC IOT press
  release as the first entry when ready.
- **Tour booking opens 2026-10-26.** The Facility "Book a Tour" form stays live but
  carries a gold notice banner (`facilityPage.tourNotice`) saying dates can't be
  confirmed until then. Clear that field in the Studio on the 26th to drop the
  banner. The header/hero still link to the tour form; the home hero buttons no
  longer include "Book a Tour".
- **Facility photo gallery** shows grey PHOTO PLACEHOLDER boxes until real photos
  are uploaded (the gallery *is* CMS-editable — Facility Page → Photo gallery).
- **"What is Industrial Operations Technology?" video** (~3 min) is a placeholder
  box on the IOT page. Not produced, not scoped.
- **Homepage hero video** (`public/videos/hero-construction.mp4`) is code-only, not
  CMS-editable.
- **Nav and footer links** are code-only (`Header.tsx`, `Footer.tsx`).
- **No rate limiting** on `/api/inquiry` beyond the honeypot. If spam becomes a
  problem, add it.

---

## 9. Commands

```bash
npm run dev                # dev server (localhost:3000; /studio for the CMS)
npm run build              # production build
npx tsc --noEmit           # typecheck
npx eslint .               # lint

npx sanity schema validate                                 # see §4
npx sanity documents validate --dataset production --yes   # see §4
npx sanity cors list                                       # allowed Studio origins

# Exercise the form endpoint without a browser:
curl -s -X POST http://localhost:3000/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"formType":"contact","reason":"Media inquiry","firstName":"A","lastName":"B","email":"a@b.com","message":"hi"}'
# → {"ok":true}, and a formSubmission doc appears in Sanity.
# Clean up test docs by ID afterwards — don't leave them in the client's inbox.
```

Push to `main` → Vercel deploys automatically. `npx vercel ls gtcio-site --yes`
shows deploy status.

---

## 10. Working notes

- **Site nav order** (as of 2026-07-15): About (Mission / History / Advisory Board
  / Development Authority of Bulloch County / FAQ) · IOT Training Programs · IOT
  Diploma Program · Facility · Partners · News · Contact. "Training" is labelled
  **IOT Training Programs** in the nav and sits *before* IOT Diploma Program. The
  home hero buttons are IOT Training Programs · IOT Diploma Program · Become a
  Partner (a red "Become a GTCIO Partner" band + a newsletter signup sit lower on
  the home page). Nav/footer links are code-only (`Header.tsx`, `Footer.tsx`).
- **Partners page is the priority page.** Jan called it out as needing to work
  "even before the website."
- **IOT Training Programs page is employer-facing.** The old "For Students" box
  was removed 2026-07-16 (students are served by the IOT Diploma Program page), and
  `trainingPage.studentsBody` was dropped from the schema and unset in the dataset.
  Only the opening paragraph and the FAQ are CMS-editable; the stats, credentials,
  services, and course lists are code constants in the page (they're standing facts
  from the brochure, not routine copy). The section directly under any PageHero
  should stay **light** — a dark band there makes the hero photo read as fading to
  black early and opens a large empty gap. That was a real complaint.
- **Footer** carries an "Equal Opportunity Institution" link to
  <https://www.ogeecheetech.edu/about/equal-opportunity>, matching OTC's own
  footer convention. Keep it — it's an institutional compliance link.
- The five current partners: Development Authority of Bulloch County, Koyo
  Bearings, Georgia Power, Ajin Georgia, Amazon.
- Useful confirmed facts (from OTC's 2026-07-09 press release): $27M / 40,000 sq
  ft facility, ~460,000 instructional hours/year capacity, August 2026 launch.
  Media contact: Sean Payne, spayne@ogeecheetech.edu. Applications:
  www.ogeecheetech.edu/IOT. **Every diploma graduate is credentialed through SACA**
  (Smart Automation Certification Alliance) — the site states this explicitly; it
  is not framed as an optional add-on (changed 2026-07-15 per Jan).
- **Employer-training facts** come from "OTC Industrial Systems Training
  Program.pdf" (in the parent folder; also published as a flipbook at
  <https://online.fliphtml5.com/exygb/kvbr/#p=1>, which the IOT Training Programs
  page links to as "VIEW THE CATALOG"). Read the PDF with
  `/usr/bin/python3 -m pip install --user pypdf` → `pypdf.PdfReader(...)`;
  poppler is not installed and builds from source too slowly to bother.
  Facts used on the page: the only authorized FANUC satellite training site in
  Georgia; SACA Gold Certification Site + Regional Instructor Training Center
  (first in Georgia); Amatrol Certified Instructor Training Site; Mitsubishi
  Electric Automation Training Provider; Advanced Manufacturing Academy Training
  Center; training team has 120+ yrs combined in-field and 80 yrs training
  experience; entry-level Fast Track 256 hrs / 16 weeks / $4,750; apprenticeships
  384 hrs / $7,750 + 4,000 OJT hrs; short courses $450–$950, FANUC robotics/CNC
  $750–$1,936; approved SACA testing site (Silver and Gold).
  - ⚠️ **The brochure contradicts itself on apprenticeship length** — p16 says a
    12-month span (one 8-hr day/week, which matches the 384 hrs in the pricing
    table), p17 says "18-month program: 576 training hours", p18 says 11 months.
    The site deliberately states only the self-consistent figures (384 hrs, ~one
    8-hr day/week, 4,000 OJT) and avoids naming a total duration. **Confirm with
    GTCIO before publishing a month count.**
  - ⚠️ The brochure's "AT A GLANCE" also names a *Georgia Industrial Systems and
    Robotics Training Center, Coming FALL 2026* — a different name from GTCIO.
    Unclear whether it's the same facility rebranded. Don't conflate them.
  - Credentials require passing the SACA exam; completing a course alone does not
    award one (brochure p18). The site says so explicitly.
  - **Hal McCool no longer works there — do not re-add him** (he was the
    brochure's contact; removed 2026-07-16). Training enquiries point to Jan Moore.
  - The **242,000 hours in 2024** figure (OTC-delivered) was replaced on the page
    2026-07-16 with GTCIO's own **~460,000 hrs/yr instructional capacity**, per Jan.
- **Office address is 66 AJ Riggs Road, Statesboro, GA 30458** (updated
  2026-07-15, in `siteSettings.address` + code fallbacks in Footer/Contact). The
  old "1 Joe Kennedy Blvd." is stale.
- `EDITING.md` in this repo is the **plain-English guide written for marketing
  staff**, not for developers. If you change how editing works, update it — it is
  the thing a non-technical person actually reads.
