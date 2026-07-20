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
src/components/           Header, Footer, PageHero, InquiryForm
  Button.tsx              the raw styled link (variant, target/rel)
  CtaButton.tsx           renders a CMS-configured button via links.ts (§4)
  NewsletterSignup.tsx    home page, UI-only — see §8
sanity/
  env.ts                  projectId / dataset / apiVersion
  lib/client.ts           read client
  lib/writeClient.ts      write client — server-only, form submissions
  lib/live.ts             sanityFetch + SanityLive (draft/preview)
  lib/queries.ts          all GROQ
  lib/image.ts            urlForImage + resolveHeroImage (hotspot → focal point)
  lib/links.ts            DESTINATIONS: ctaButton destination keys → real hrefs
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
- **Objects:** `faq`, `statCard`, `pathwayCard`, `timelineEvent`, `infoCard`,
  `courseArea`, `ctaButton`, plus per-page inline types (`curriculumStage`,
  `programOption`, `jobDuty`, `payRange`).
- **`ctaButton` — how links stay unbreakable.** Editors pick a `destination` from
  a dropdown of real pages, never a raw href; `sanity/lib/links.ts` maps those
  keys to actual URLs and `<CtaButton>` renders them (adding `target="_blank"`
  automatically for external ones). **If a route ever moves, change
  `DESTINATIONS` in `links.ts` and every CMS button follows** — no editor action.
  Adding a destination means editing BOTH the options list in
  `objects/ctaButton.ts` and `DESTINATIONS`. A half-filled button (no label, or
  `external` with no URL) renders nothing rather than a dead link.
- **Convention: Studio order mirrors page order.** A document's `groups` must be
  listed top-to-bottom in the order those sections appear on the page, fields
  within a group likewise, and `structure.ts`'s page list must match the site nav.
  An editor should be able to read the tabs like they're scrolling the page. This
  is why `applyHeading` got its own "Apply band" group (it had been filed under
  FAQ, though the Apply band renders *after* the FAQ) and why `introText` moved out
  of "Ways to partner" into its own "Intro & button" group. Keep the code `DEFAULTS`
  objects in page order too — same reason.
- **Convention: every page's copy is CMS-first, with the code `DEFAULTS` as a
  fallback.** As of 2026-07-16 the only things NOT editable are the top nav, the
  footer links, the logo, and the home hero video (all deliberate — see §8).
  Everything else is: the Home hero buttons / red partner band / newsletter; the
  Training stats, employer copy, catalog band, credentials, services and course
  areas; the Facility focus areas and tour-notice banner; the Partners intro button;
  the IOT Apply band + button; the About mission statement and project timeline.
  The CMS is **seeded** with all of that copy so editors see real text, not empty
  boxes falling back to code. If you add a section, add fields AND seed them —
  don't leave content code-only.
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

**⚠️ Patching a published doc leaves any DRAFT of it stale — and the draft wins
later.** A `patch` on `homePage` does *not* touch `drafts.homePage`. If a draft
exists (an editor opened the page in the Studio at some point, even without
saving anything meaningful), then: the public site still shows your published
change, but the **Studio preview shows the stale draft**, and the moment anyone
presses **Publish** the draft silently **reverts your change**. This actually
happened — a 2026-07-14 `drafts.homePage` sat on the old hero copy *and* the old
"optional SACA" wording for two days after both were changed, primed to undo them.
**After patching a published doc, always check for a draft and patch it to match:**

```bash
# list every draft in the dataset (perspective=raw is required to see them)
*[_id in path("drafts.**")]{_id,_updatedAt,_type}
# then diff drafts.<id> against <id> and patch the draft with the same values
```

Prefer patching the draft over deleting it. Note `sanity.previewUrlSecret` drafts
are system docs for the Presentation tool — leave those alone.

Related: if someone reports the live site showing old copy that you know you
changed, suspect **draft mode** before cache. Clicking through the Studio's "Edit
on page" sets a draft-mode cookie, so *their browser* renders drafts on the real
site. `https://gtcio-site.vercel.app/api/draft-mode/disable` clears it.

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

**🔴 Publishing in the Studio does not update the live site.** There are **no
Sanity webhooks** configured (`npx sanity hook list` → empty, verified
2026-07-16), and every page is statically prerendered at build time. `SanityLive`
is supposed to cover this, but it revalidates via a **client-side** server action
(`revalidateTag(tag, 'max')` in `next-sanity/dist/live/server-actions`) that only
fires *if someone has the affected page open in a browser at the moment of
publish*. If marketing publishes and nobody is on the site, the static page keeps
serving stale content until the next deploy. **This defeats the point of the CMS**
— fix before handing the site to Jan's team. Two manual steps (neither can be
scripted: Vercel deploy-hook creation needs a dashboard token, and
`sanity hooks create` is interactive-only):

1. Vercel → project **gtcio-site** → Settings → Git → **Deploy Hooks** → create
   one named `sanity-publish` on branch `main`; copy the URL.
2. <https://www.sanity.io/manage/project/kjz4q8d4> → API → **Webhooks** → create
   one pointing at that URL: dataset `production`, trigger on
   Create/Update/Delete, filter `_type != "formSubmission"` (form submissions are
   written by the site itself — without this filter every inquiry triggers a
   rebuild).

A `revalidatePath` API route was considered instead (faster, no rebuild) but
rejected: `cacheComponents` is off, so pages use the fetch cache, and
`revalidatePath` would re-render the page while `sanityFetch` could still return
its own cached response — the same staleness `rm -rf .next/cache` fixes locally.
A full rebuild is the guaranteed-correct option and publishes are infrequent.

**⚠️ A build can bake in stale Sanity data, and you cannot config your way out.**
`defineLive` **forces** `useCdn: true` on your client —
`_client.withConfig({allowReconfigure: false, useCdn: true, perspective: 'published'})`
— so the `useCdn` in `sanity/lib/live.ts` is ignored. Worse, per fetch it does
`cacheMode = useCdn !== false && !isBuildPhase ? 'noStale' : undefined`: at runtime
it asks the CDN for fresh data, but **during `next build` it deliberately does
not**, so a build started seconds after a publish can prerender pre-publish
content. Observed 2026-07-16: a CMS array edit was verified present via both
`apicdn` and `api`, yet `.next/server/app/<page>.html` was generated without it;
rebuilding a minute later fixed it. Practical impact on the webhook flow is small
(Vercel spends ~60–90s installing/compiling before it prerenders, by which point
the CDN has purged — it purges in seconds), **but if a page looks stale right
after a publish, redeploy before debugging anything else.** When verifying a CMS
change locally, `rm -rf .next/cache` is not enough — give the CDN a few seconds.

**🟡 Newsletter signup is UI-only.** `src/components/NewsletterSignup.tsx` on the
home page validates an email and shows a confirmation but **sends nothing** — no
address is stored or transmitted. GTCIO expects to use **Constant Contact**. To
finish, either point the form's `<form action>` at a Constant Contact hosted
sign-up URL, or replace the `handleSubmit` stub with a POST to a new API route
that calls the Constant Contact API. The file header documents both paths.

Smaller items:

- **Content still pending from GTCIO:** final tuition figure and final program
  length. They appear in **four** places on the IOT Diploma Program page — the
  "Time to complete" and "Approximate cost" boxes (`timeToComplete`,
  `approximateCost`) and the matching FAQ answers (`faqs[_key=="f5"]` and
  `[_key=="f4"]`) — so replace all four together. They no longer say the word
  "Placeholder": that was an internal note rendering to prospective students, and
  now reads "Still being confirmed ahead of the August 2026 launch." The Studio
  field descriptions still flag them as needing replacement. The mission statement
  and the partnership timeline were both outstanding here and are now done.
- **🟡 Financial aid is not mentioned anywhere on the site, deliberately.** It is
  probably the biggest unanswered question for a prospective student, because the
  **HOPE Career Grant covers ALL tuition** for eligible programs. OTC's own list
  (<https://www.ogeecheetech.edu/financial-aid/hope-career-grant>) includes
  *"Electrical & Industrial Systems Technology"* but **not** Industrial Operations
  Technology — IS32 is brand new, and the eligible-program list is set annually by
  the Governor and General Assembly, effective each Fall. **Do not claim IOT is
  HOPE Career Grant eligible without confirming it with GTCIO** — a student could
  choose the program believing tuition is free. Jake didn't know as of 2026-07-16;
  confirm, then add an FAQ. For reference, OTC tuition is ~$107/credit hour
  in-state, but IS32's credit-hour count isn't published anywhere findable, so the
  total can't be derived.
- **Advisory Board section (About page)** ships with placeholder copy
  (`advisoryBody` / `advisoryNote`). Real description + members to come; editable
  under About Page → Advisory Board.
- **Partner website links:** each partner block shows a red **LEARN MORE** button
  only when that partner's `website` URL is set. All five are set and were each
  verified against the live site (2026-07-16): Development Authority of Bulloch
  County → advantagebulloch.com, Ajin Georgia → ajingeorgia.com, Georgia Power →
  georgiapower.com, Koyo Bearings → jtekt-na.com/products/koyobearings/ (JTEKT
  rebranded the Koyo bearings brand to JTEKT in 2022; Jake chose JTEKT North
  America), Amazon → aboutamazon.com (corporate, Jake's choice over retail).
  Verify any new partner URL against the real site before setting it.
- **News page is empty.** `/news` shows a "coming soon" state until `newsItem`
  documents are added (press releases + media mentions). Load the OTC IOT press
  release as the first entry when ready.
- **Tour booking opens 2026-10-26.** The Facility "Book a Tour" form stays live but
  carries a gold notice banner saying dates can't be confirmed until then. It's two
  fields — `facilityPage.tourNoticeHeading` (which carries the date) and
  `facilityPage.tourNotice` — and the banner disappears only when **both** are
  cleared (Facility Page → Book a Tour form). The header still links to the tour
  form; the home hero buttons no longer include "Book a Tour".
- **Facility photo gallery** shows grey PHOTO PLACEHOLDER boxes until real photos
  are uploaded (the gallery *is* CMS-editable — Facility Page → Photo gallery).
- **"What is Industrial Operations Technology?" video** (~3 min) is a placeholder
  box on the IOT page. Not produced, not scoped.
- **Homepage hero video** (`public/videos/hero-construction.mp4`) is code-only, not
  CMS-editable.
- **Nav and footer links** are code-only (`Header.tsx`, `Footer.tsx`) — deliberate,
  since a typo'd href there breaks navigation site-wide. Everything else on the
  page is CMS-editable; see the `ctaButton` note in §4 for how in-page buttons stay
  safe. The logo and the home hero video are also code-only.
- **Home hero headline is sized to fit one line** (Jan, 2026-07-16). The sizes in
  `(site)/page.tsx` are measured, not guessed: the headline renders ~21.7px wide
  per 1px of font-size in Trade Gothic Next Heavy Compressed, so 52px ≈ 1128px and
  56px ≈ 1215px inside a 1200–1280px container from `xl` up. It is deliberately
  **not** `whitespace-nowrap` — the hero is `overflow-hidden`, so a longer headline
  (or the wider Arial Narrow fallback if Adobe Fonts fails) would be *clipped*
  rather than wrapped. A longer headline just wraps to two lines. Re-measure if
  the headline changes materially.
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
- **The IOT Diploma Program FAQ is ordered as a student funnel** (rewritten
  2026-07-16): when it starts → do I need experience → how do I apply → where →
  online? → how long → how much → what credential → diploma vs certificates →
  what I'll earn. Keep new questions in that flow rather than appending. Two facts
  worth not re-breaking: the "what will I earn" answer says the pay ranges are
  **above** it (Jobs & pay is section 5, the FAQ is section 6 — it used to say
  "below", which sent students the wrong way), and the apply answer names **Jan
  Moore** as the program contact because OTC's own IOT page does. Ogeechee Tech's
  published admission requirements couldn't be found, so the apply answer routes
  to Admissions rather than inventing prerequisites.
- **The mission statement is signed off** (Jan, 2026-07-16): **"Building a
  workforce ready for industry transformation."** It is deliberately the same
  sentence as the Home hero headline — the hero states the mission verbatim, so
  **if one changes, change both** (`aboutPage.missionStatement` and
  `homePage.heroTitle`, plus the code `DEFAULTS` for each). The old "(Formal
  mission-statement wording pending final sign-off…)" note is gone; don't
  reintroduce it.
- **Partners page is the priority page.** Jan called it out as needing to work
  "even before the website."
- **IOT Training Programs page is employer-facing.** The old "For Students" box
  was removed 2026-07-16 (students are served by the IOT Diploma Program page), and
  `trainingPage.studentsBody` was dropped from the schema and unset in the dataset.
  The whole page — stats, employer copy, catalog band, credentials, services,
  course areas, FAQ — is CMS-editable; the code constants are fallbacks only.
- **The section directly under any PageHero must stay light.** A dark band there
  makes the hero photo read as fading to black early and opens a large empty gap
  between the hero copy and the next section. That was a real complaint from Jan
  about the Training page, fixed by turning the stat band white (it now matches the
  Facility page's hero → white-stats pattern).
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
- **🔴 The project-planning PDFs are from 2022 and their specs are SUPERSEDED.**
  In the parent folder: *OGE FY24-844-1 Project Profile.pdf* (the TCSG capital
  outlay project profile, 8/19/22 — the richest source), *GISIRTC 1-pager.pdf*,
  *Georgia Industrial Systems and Industrial Robotics Campus v2.pdf*, and *Capital
  Outlay FY24 Approved Projects 220901.pdf* (State Board approved list, 9/1/22 —
  corroborates the 9/22 "initial funding approved" milestone). They call the
  project **GISIRTC** and quote **37,307 GSF / $22.8–23.5M / 400–480k hours**.
  **Do not put those numbers on the site** — the 2026 press release figures
  already there (**40,000 sq ft / $27M / ~460,000 hrs**) are current. Use these
  PDFs for the *why*, not the specs. (The docs also disagree with each other on
  FY22 hours: 94,500 in the profile vs 104,000 in the 1-pager.)
  - Good, usable context from them (now on the site): the college sits **32 miles
    from the Bryan County mega site**, where the **Hyundai EV plant was projected
    to bring ~8,100 jobs** and nearby **suppliers ~3,000 more**; demand for
    industrial systems/robotics technicians already exceeded supply in Georgia;
    the center was designed to **triple** OTC's training capacity, **anchor the
    region** (Bulloch/Evans/Screven DAs + the Savannah Harbor–I-16 Corridor JDA:
    Bryan, Bulloch, Chatham, Effingham), serve as a **training ground for
    instructors statewide and a replicable TCSG model**, and pair with a
    **partnership with Southeastern Technical College** so facilities aren't
    duplicated regionally. Also: ~1,950 students served; DABC owned the parcel.
  - The **four focus areas** the center was planned around (now the "What the
    center is built around" section on Facility): Industrial Systems Maintenance ·
    Industrial Robotics Programming & Fault Diagnostics · IoT Infrastructure &
    Troubleshooting · CNC within Advanced Manufacturing.
- **Don't reintroduce the "tours don't interrupt training" framing.** It used to
  open the Facility hero and sat in About → History and the design milestone. Jan
  called it a minor facet (2026-07-16); it was removed everywhere and replaced with
  the demand/Hyundai/regional-anchor story above. Booking a tour is still a real
  feature — it just isn't the building's reason for existing.
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
  - **The brochure names no partner companies — it is not a source for the Partners
    page.** None of the five partners appear in it. The only organizations it names
    are the p2 "AFFILIATIONS" — FANUC, SACA, Amatrol, Mitsubishi Electric, Advanced
    Manufacturing Academy — which are equipment vendors and certification bodies OTC
    is accredited *by*, not employers who hire graduates or sponsor equipment. Jake
    decided 2026-07-16 to **leave them off the Partners page**: they already render
    as text credentials on the IOT Training Programs page (`CREDENTIALS` in
    `(site)/training/page.tsx`), and listing them as partners would both misstate the
    relationship and publish five trademarks nobody has cleared. Don't "fix" this.
- **Office address is 66 AJ Riggs Road, Statesboro, GA 30458** (updated
  2026-07-15). The old "1 Joe Kennedy Blvd." is stale — that's OTC's *main
  campus*, not GTCIO. ⚠️ **The address is duplicated in five places; change all of
  them together:** `siteSettings.address` (drives Footer + Contact), the code
  fallbacks in `Footer.tsx` and `(site)/contact/page.tsx`, and the "Where is GTCIO
  located?" answer in **both** `aboutPage.faqs[_key=="a4"].answer` and the
  `DEFAULTS.faqs` copy of it in `(site)/about/page.tsx`. The FAQ hardcodes it
  rather than reading `siteSettings` because the FAQ is plain editor-authored text
  — a `{address}` placeholder would just confuse whoever edits it.
- **Project timeline** (from Jan, 2026-07-16; rendered as the vertical timeline in
  About → History, editable at About Page → History → Project timeline): 7/22 push
  for funding begins incl. land acquisition from DABC · 9/22 initial funding
  approved · 7/23 design team selected, **PRAXIS3** (Atlanta architecture/design
  firm, praxis3.com — verified) · 8/23 construction team selected, **ICB
  Construction Group** (Macon general contractor, icbconstructiongroup.com —
  verified; a directory lists the legal name "International City Builders" but
  their own site doesn't, so the site doesn't claim it) · 9/23 design starts ·
  6/25 construction starts · 9/26 construction targeted for completion ·
  **ribbon cutting 10/15/26**.
  - **Why Aug 2026 classes precede the Oct 2026 opening (resolved by Jan,
    2026-07-16):** classes begin in the **Industrial Technology Building on OTC's
    main campus** — the college's existing robotics facility (16 Joe Kennedy Blvd;
    houses the robotics and industrial maintenance labs, Electrical Systems
    Technology and Logistics; built 2018) — and move into the new GTCIO building on
    AJ Riggs Road once it opens. OTC's own release notes the industrial systems
    program was projected to hit capacity in that building, which is *why* the new
    center exists. This is on the site as an About timeline milestone and an IOT
    Diploma Program FAQ ("Where will classes be held?"). Tour booking opening 10/26
    is consistent with the 10/15 ribbon cutting.
  - Jan's source note said "9/26 HOPEFULLY finished" — the site says "targeted for
    completion"/"scheduled" instead. Don't publish the hedge verbatim.
- `EDITING.md` in this repo is the **plain-English guide written for marketing
  staff**, not for developers. If you change how editing works, update it — it is
  the thing a non-technical person actually reads.
- **`SITEMAP.html` is the stakeholder-facing sitemap** — a single self-contained
  page (no external assets, opens offline in any browser) that Jake sends to Jan
  for sign-off. It lists every route, each page's sections, the linkable `#anchors`,
  which pages carry forms, and a teal/gold status dot per section marking *built &
  populated* vs *built, awaiting content*. **Keep it in sync — it is a deliverable
  that goes to the VP, so a stale one misrepresents the project.** Update it
  whenever you: add/remove/rename a route or nav item, add or remove a section
  anchor, change what a page is for, or **close out an item in §8 Open work**
  (flip that section's dot from gold to teal). The status dots and the §8 list are
  two views of the same facts — when they disagree, §8 is right. Also refresh the
  date in `.colophon` on any edit.
  ⚠️ **Not to be confused with `src/app/sitemap.ts`**, which generates the
  machine-readable `sitemap.xml` for search engines. Different audience, same
  route list — a new or renamed route has to be added to **both**, plus
  `Header.tsx` and `sanity/lib/links.ts`. Regenerate the tallies (pages / nav items /
  forms / deep links) if the counts move. The page's palette and condensed type
  are deliberate §7 brand choices; the display font stack degrades to Arial
  Narrow (the guide's own approved substitute) on machines without Adobe Fonts,
  which is expected, not a bug.
