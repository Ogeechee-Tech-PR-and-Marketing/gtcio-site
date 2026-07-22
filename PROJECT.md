# GTCIO website — project brief

Everything a developer or AI agent needs to pick this project up cold. Last
updated 2026-07-22. Check claims against the code before trusting them.

---

## 1. What this is

The website for **GTCIO** (Georgia Training Center for Industrial Operations), a
division of **Ogeechee Technical College** (OTC) in Statesboro, GA. GTCIO trains
people for industrial maintenance / automation / controls work, and launches an
Industrial Operations Technology (IOT) diploma program in **August 2026**.

- **Live:** https://gtcio-site.vercel.app
- **Repo:** https://github.com/Ogeechee-Tech-PR-and-Marketing/gtcio-site (private,
  transferred 2026-07-22 from Jake's personal `revjake1` account — see §12)
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
| Email | Microsoft Graph / Azure AD app (see §5) |
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
      curriculum/         /iot-diploma-program/curriculum      ← not in the nav
    credentials/          /credentials                          ← nav item
    facility/             /facility
    partners/             /partners
    news/                 /news
    contact/              /contact
  studio/[[...tool]]/     /studio      ← Sanity Studio, embedded
  api/
    draft-mode/           enable + disable, for the Studio's live preview
    inquiry/              POST target for all three forms (§5)
    newsletter/            POST target for the footer sign-up form (§11)
    constant-contact/
      oauth/start/         human-run once, kicks off the CTCT OAuth grant (§11)
      oauth/callback/      stores the resulting refresh token (§11)
src/lib/
  site.ts                 SITE_URL — the canonical origin (§6)
  constantContact.ts      token refresh + list lookup/create + the actual
                          sign-up call. Server-only (§11)
  iot-curriculum.ts       the IS32 course table + SACA credential glossary.
                          A deliberate exception to CMS-first copy — read
                          its header comment before touching it (§4).
  credentials.ts          SACA's tier ladder + the five accreditations OTC holds.
                          Same code-not-CMS reasoning (§4). The accreditations
                          are the shared fallback for /credentials AND /training.
src/components/           Header, Footer, PageHero, InquiryForm
  Button.tsx              the raw styled link (variant, target/rel)
  CtaButton.tsx           renders a CMS-configured button via links.ts (§4)
  NewsletterSignup.tsx    rendered inside Footer, sitewide, UI-only — see §8
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
  `trainingPage`, `iotDiplomaProgramPage`, `credentialsPage`, `partnersPage`,
  `newsPage`, `contactPage`. Each has a fixed `_id` equal to its type name. They can't be
  created, duplicated, or deleted from the Studio (see `document.actions` in
  `sanity.config.ts`). Any new singleton must be added to `singletonTypes` in
  `sanity/schemaTypes/index.ts` AND to `structure.ts` + `presentation.ts`.
- **`siteSettings`** — top banner text, address, phone, program + media contacts,
  and the footer newsletter signup copy (moved here from `homePage` 2026-07-21 —
  the signup itself now renders inside `Footer.tsx` on every page, not just
  Home, so its copy lives on the sitewide settings doc rather than a single
  page). Used by Header, Footer, and the Contact page.
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
  fallback.** As of 2026-07-21 the only things NOT editable are the top nav, the
  footer's link columns, and the logo (all deliberate — see §8). Everything
  else is: the Home hero buttons / red partner band; the footer's newsletter
  signup (on `siteSettings`, not `homePage` — see §8); the
  Training stats, employer copy, catalog band, credentials, services and course
  areas; the Facility focus areas; the Partners intro button; the IOT Apply band
  + button; the About mission statement and project timeline. (The Facility
  tour-notice banner was CMS-editable too, until Book a Tour was pulled off the
  site entirely 2026-07-20 — see §8.)
  The CMS is **seeded** with all of that copy so editors see real text, not empty
  boxes falling back to code. If you add a section, add fields AND seed them —
  don't leave content code-only.
- **The one deliberate exception: `src/lib/iot-curriculum.ts`** (added
  2026-07-20). The IS32 course table (12 program courses + 3 required general
  education courses, 53 credit hours total — see §8) and the SACA
  credential glossary (22 entries) that drive `/iot-diploma-program/curriculum`
  and `/credentials` are **code, not CMS content**. They
  are a faithful transcription of an *accredited* course catalog — codes, credit
  hours, and credential mappings are matters of record, not marketing copy, and
  a wrong edit misstates the program to prospective students. A ~200-bullet
  editing surface would also be hostile to the non-technical editors the CMS
  exists for. When the curriculum changes it arrives as a new brochure and a
  developer updates the file. The *framing* around it (headings, intro copy, the
  buttons on the IOT page) IS CMS-editable, and is seeded. `public/SITEMAP.html`
  labels these pages "…data code-managed" so the stakeholder view matches.
  `src/lib/credentials.ts` (the SACA tier ladder and OTC's accreditations, both
  on `/credentials`) is code for the same reason. **One cross-page wrinkle:** the
  five accreditations shown on `/credentials` are *authored on the Training
  page's document* (`trainingPage.affiliations`) — `CREDENTIALS_PAGE_QUERY`
  reads that field with a sub-query, so an editor updates them once and both
  pages follow. There is deliberately no `affiliations` field on
  `credentialsPage`. If Training's field is ever removed, add the fallback path.
- **Dropdown sources:** `contactPage.contactReasons` (array of strings) feeds the
  Contact form's dropdown. The Become a Partner dropdown has no field of its own —
  it is derived from `partnersPage.pathways` (§5).
- Interior page heroes share `heroFields()` in `sanity/schemaTypes/heroFields.ts`,
  which wraps `heroMediaFields()` — the photo (+ optional video) part, reused
  directly by `homePage` since its headline fields don't match the interior-page
  shape (see next point). Every hero's Background photo overrides any video —
  home and About are the only two with a hero video, uploading a photo replaces
  it. Absent a photo, an uploaded Background video (`heroVideo`, a `file` field
  with `accept: "video/*"`) replaces the default footage; `heroVideoPoster`
  supplies its loading frame. A `file` asset's URL isn't self-contained the way
  an image asset's is — `HOME_PAGE_QUERY`/`ABOUT_PAGE_QUERY` dereference it with
  `heroVideo{..., asset->}`, and `resolveHeroVideo()` in `sanity/lib/image.ts`
  picks between it and the fallback the same way `resolveHeroImage()` does for
  photos.

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
are unaffected). ⚠️ **`rm -rf .next/cache` alone was NOT enough** when verifying
the news items on 2026-07-20: a dev server started with the cache cleared still
served a one-item page for several restarts, and only `rm -rf .next` (the whole
directory) picked up all six. If local output disagrees with what the API
returns, wipe all of `.next` before you start debugging the query. Also confirm
you killed every dev server first — `pkill -f "next dev"` missed a live
`next-server` process that kept answering on port 3000 with its own stale cache,
which looks exactly like a caching bug in the code. `lsof -ti:3000` to be sure.

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

Two forms are currently live — **Become a Partner** (Partners) and **Contact** —
rendering through `src/components/InquiryForm.tsx` and POSTing JSON to
**`src/app/api/inquiry/route.ts`**. A third, **Book a Tour** (Facility), is
temporarily removed site-wide (Jake, 2026-07-20) — see the §8 note — but the
route and `InquiryForm` still support a `formType: "tour"` value so restoring it
in October is just re-adding UI, no backend change. That route, in order:

1. **Rejects oversized payloads** (>20 KB) and **drops bots** via a `botcheck`
   honeypot field, returning a fake success so they don't retry.
2. Validates the form type and email address, **caps every field's length**
   (200 chars for short fields, 5 000 for the message), and strips control
   characters from the fields that end up in the email subject line, so a
   submission can never smuggle CR/LF toward anything that builds email headers.
3. **Saves the inquiry to Sanity first** as a `formSubmission` document. This
   happens *before* any email is attempted, so a bounced or spam-filtered
   notification never means a lost lead. **Do not flip this order.**
4. **If the Contact form's "Sign me up for GTCIO's newsletter" checkbox is
   checked, adds the submitter to Constant Contact** (added 2026-07-22) —
   reuses `addNewsletterSignup()` from `src/lib/constantContact.ts`, the same
   function the footer's newsletter form calls (see §11). Best-effort and
   independent of the rest of the handler: a failure here is caught and
   logged (`console.error`), never turned into an error response — the
   visitor's inquiry still succeeds either way. No `formSubmission` field
   records the opt-in choice; Constant Contact's own list is the record of
   truth, same reasoning as the footer form. This is the only form-level
   opt-in — Partner and Tour submissions never touch Constant Contact.
5. **Then emails staff** via Microsoft Graph's `sendMail` API (an Azure AD app
   registration, client-credentials grant — see the Microsoft Graph subsection
   below) with `subject` built from the dropdown choice and `replyTo` set to
   the submitter, so staff can just hit Reply.
6. **Flags `emailDelivered`** on the saved document. `false` means the email did
   not go out — the Studio preview renders those as "⚠️ NOT EMAILED" so someone
   can follow up by hand.

Marketing reads these in the Studio under **"Form submissions (inbox)"**.

### 🔴 Submissions are saved as DRAFTS on purpose — privacy depends on it

The `production` dataset is **publicly readable** (that's how the website reads
content without a token, and how `cdn.sanity.io` serves images). A regular
published `formSubmission` document would therefore expose the visitor's name,
email, phone, and message to anyone on the internet via a one-line GROQ query.
Draft documents (`_id` under `drafts.`) are the exception: they require
authentication to read. So `/api/inquiry` writes every submission with
`_id: "drafts.<uuid>"` (verified 2026-07-20: unauthenticated queries — including
`perspective=raw` — return nothing; the Studio inbox lists them normally, just
with an "unpublished" dot). Two guardrails keep it that way:

- `sanity.config.ts` strips every document action except **Delete** for
  `formSubmission`, so an editor can't Publish one (which would make it public).
- **Never "fix" the inbox by publishing submissions**, and if the dataset is ever
  made private or submissions move elsewhere, revisit this whole section.

### Dropdowns

- **Become a Partner** — options are generated from `partnersPage.pathways`, i.e.
  the same Partnership Pathway cards displayed above the form, plus a hardcoded
  "Something else / not sure yet". This is deliberate: rename a pathway card and
  the dropdown follows, so the form can never drift out of sync with the page.
  There is no separate list to maintain — **don't add one.** **Checkboxes, not a
  dropdown** (changed 2026-07-20) — a prospective partner can be interested in
  more than one pathway at once.
- **Contact** — options come from `contactPage.contactReasons`, editable in the
  Studio. **Single-select dropdown** — a visitor picks exactly one reason (tried
  as checkboxes on 2026-07-20, reverted the same day: Contact stays one-at-a-time,
  only Become a Partner allows multiple).

Whichever option(s) the visitor picks become the **email subject line**.

### Microsoft Graph: one shared credential, two fixed recipients

Email notifications went through Web3Forms until 2026-07-22, when Jake asked
to drop the third-party dependency in favor of OTC's own Microsoft 365
tenant. `src/lib/graphMail.ts` sends via Microsoft Graph's `sendMail` API,
authenticating with an Azure AD app registration's **client-credentials
grant** (see "One-time setup" below for the Azure steps a tenant admin has to
run).

Unlike Web3Forms — where the recipient address was baked into the access key
itself, forcing a separate key per recipient — Graph's `sendMail` takes an
arbitrary `to` address on every call, so **one shared credential** can notify
either person. `/api/inquiry` still sends up to two separate notifications
per submission (see `MEDIA_REASON` and the `recipients` array in
`src/app/api/inquiry/route.ts`), but the recipient addresses themselves are
now fixed constants in that file (`NOTIFY_EMAIL` / `NOTIFY_EMAIL_MEDIA`), not
environment variables — there's no reason to indirect through env vars when
Graph doesn't tie an address to a credential the way Web3Forms did. The route
still accepts `reason` as either a single string or an array so it works for
both forms' field types without special-casing which form submitted:

- **`jmoore@ogeecheetech.edu`** — every submission except a Contact-form one
  where *only* "Media inquiry" is checked.
- **`spayne@ogeecheetech.edu`** — fires whenever "Media inquiry" is checked.
  Since Contact is single-select this is currently either/or in practice, but
  the code doesn't assume that — if a Contact-reason array ever *did* include
  "Media inquiry" alongside another reason, **both** addresses would be
  notified (two separate `sendMail` calls), since each reason serves a
  different audience.
- Renaming the "Media inquiry" checkbox label in the Studio breaks this
  matching silently — `MEDIA_REASON` in the route file has to change with it.
- Changing who receives notifications (e.g. Jan or Sean changes roles) means
  editing `NOTIFY_EMAIL`/`NOTIFY_EMAIL_MEDIA` in the route and redeploying —
  there's no Studio field for it, same tradeoff the code already accepts for
  `MEDIA_REASON`.

**If Microsoft Graph isn't configured (any of the four `MS_GRAPH_*` env vars
missing), the site still works and still saves every submission — it just
doesn't email anyone.** `emailDelivered` on the saved `formSubmission` is only
`true` when *every* recipient that submission needed was successfully
notified, so a partial send (e.g. one address rejects the message) still shows
the Studio's "⚠️ NOT EMAILED" flag as a prompt to follow up by hand. That's
deliberate graceful degradation, not a bug. See §8 for the current status.

⚠️ **The Azure app registration must be scoped narrowly.** `Mail.Send` as an
*application* permission (not delegated) lets the app send as **any** mailbox
in the tenant by default — an Exchange **application access policy** should
restrict it to only `MS_GRAPH_SENDER_EMAIL`. Skipping that step leaves the
credential able to send mail as anyone at OTC, far more blast radius than this
integration needs.

#### One-time setup — needs an OTC Microsoft 365 tenant admin

Unlike Web3Forms (a public signup any site owner could do alone), this needs
someone with Azure AD admin rights in OTC's Microsoft 365 tenant. Jake cannot
do this step himself without that access.

1. **Pick a sending mailbox.** A shared mailbox (e.g.
   `gtcio-website@ogeecheetech.edu`) is a better fit than a named person's —
   it survives staff turnover and makes "this is an automated notification"
   obvious from the address. This becomes `MS_GRAPH_SENDER_EMAIL`.
2. **Register an app** in the Azure portal (Azure Active Directory →
   App registrations → New registration). Any name is fine (e.g.
   "GTCIO Website Mailer"); no redirect URI is needed since this is a
   client-credentials (server-to-server) grant, not an interactive login.
3. **Note the Directory (tenant) ID and Application (client) ID** shown on
   the app's Overview page — these become `MS_GRAPH_TENANT_ID` and
   `MS_GRAPH_CLIENT_ID`.
4. **Create a client secret**: Certificates & secrets → New client secret.
   Copy the secret's **value** immediately — like a Sanity token, it's shown
   once. This becomes `MS_GRAPH_CLIENT_SECRET`.
5. **Grant the Graph API permission**: API permissions → Add a permission →
   Microsoft Graph → **Application permissions** (not Delegated, since
   nobody logs in interactively) → search for and add `Mail.Send`. Then
   click **Grant admin consent** — this step requires the tenant admin and
   is what actually activates the permission; without it, every `sendMail`
   call fails with an authorization error.
6. **Scope the app to the one mailbox** (strongly recommended — see the
   warning above): in Exchange Online PowerShell,
   `New-ApplicationAccessPolicy -AppId <client-id> -PolicyScopeGroupId <sending-mailbox> -AccessRight RestrictAccess -Description "GTCIO website mailer"`,
   then verify with `Test-ApplicationAccessPolicy -AppId <client-id> -Identity <sending-mailbox>`.
   Without this, the app can send as *any* mailbox in the tenant, not just
   the one intended.
7. **Set all four `MS_GRAPH_*` vars in Vercel** (Project → Settings →
   Environment Variables, Production at minimum) and **redeploy**.
8. **Submit the Contact form twice for real** — once with only "Media
   inquiry" checked, once with anything else — and confirm the right person
   (Sean / Jan) receives each one, with Reply-To set to the address you
   submitted with.

**Troubleshooting:** a `401`/`403` from Graph almost always means either the
`Mail.Send` permission was added but never admin-consented (step 5), or the
application access policy (step 6) doesn't include the sender mailbox. A
`404` on the `sendMail` call usually means `MS_GRAPH_SENDER_EMAIL` doesn't
match a real mailbox in the tenant.

---

## 6. Environment & config

`.env.local` (gitignored) and Vercel env vars (all three environments):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=kjz4q8d4
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-06-01
SANITY_API_READ_TOKEN=<viewer-role token, secret>
SANITY_API_WRITE_TOKEN=<editor-role token, secret — writes form submissions>
MS_GRAPH_TENANT_ID=<see §5; unset = no email, submissions still saved>
MS_GRAPH_CLIENT_ID=<see §5; from the Azure AD app registration>
MS_GRAPH_CLIENT_SECRET=<see §5; from the same app registration, secret>
MS_GRAPH_SENDER_EMAIL=<see §5; the mailbox notification emails send AS>
CONSTANT_CONTACT_CLIENT_ID=<see §11; from the Constant Contact developer app>
CONSTANT_CONTACT_CLIENT_SECRET=<see §11; from the same app, secret>
CONSTANT_CONTACT_SETUP_SECRET=<see §11; any random string you pick — gates the one-time OAuth URL>
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

`next.config.ts` also sets security headers on every route (added 2026-07-20):
`X-Frame-Options: SAMEORIGIN` (deliberately not DENY — the Studio's "Edit on
page" tool iframes the site from `/studio` on the same origin),
`X-Content-Type-Options: nosniff`, `Referrer-Policy`, a restrictive
`Permissions-Policy`, and (added 2026-07-21) a baseline
`Content-Security-Policy` (`frame-ancestors 'self'; object-src 'none';
base-uri 'self'` — deliberately not a full `default-src` policy, which the
embedded Studio, Adobe Fonts, and Sanity's live APIs would make fragile).
HSTS is left to Vercel's edge (it sets it on `*.vercel.app`); add a
`Strict-Transport-Security` header here if the site moves to a custom domain.

`next.config.ts` also serves `public/videos|images|documents` with
`Cache-Control: public, max-age=31536000, immutable` (added 2026-07-21 — they
previously revalidated on every visit). ⚠️ Consequence: **never change one of
those files in place** — prior visitors would see the stale version for up to a
year. Rename the file (`hero-construction-2.mp4`) and update its references
instead. Originals of the re-encoded media live outside the repo in
`../media-originals/`.

**Hero video encode settings** (re-encoded 2026-07-21, requantized 2026-07-22
after the first pass looked visibly blocky in the (then-current) construction
video's dark night sky — banding is the classic failure mode of a fast CRF
encode on a dark scene). Approach: two-pass `libx264`, `preset veryslow`,
`tune film`, scaled to 1600px wide, audio stripped (never used). Two-pass with
an explicit `-b:v`/`-maxrate`/`-bufsize` target — not a bare CRF value — is what
makes `veryslow` pay off predictably: CRF alone at a quality-driven setting can
land almost anywhere in file size (a CRF 20 test came out *larger* than the
21MB source it was re-encoding). `hero-about-2.mp4` targets ~1.1 Mbps (84s →
11.5MB, up from the source's own already-lean 1.39 Mbps — there was little
headroom to cut there). If it's swapped again, re-encode from the untouched
original in `../media-originals/` (not from a prior compressed pass —
compounding lossy re-encodes compounds artifacts), and sanity-check the
darkest scene in the clip specifically: brighten/contrast-boost a crop of it
and look for blockiness before shipping.

**`hero-construction-3.mp4`** (swapped in 2026-07-22, replacing the night
drone shot `hero-construction-2.mp4` above with a daytime drone pass showing
the actual building) is **not** part of that pipeline — Jake supplied it
already compressed (18MB, 1920×1080, h264, ~3 Mbps, no audio), and it's used
byte-for-byte as delivered. **Do not re-encode it** if it's swapped again;
same reasoning applies to whatever replaces it unless told otherwise.
`hero-construction-poster-2.jpg` is a plain `ffmpeg -ss 2 ... -vf scale=1600:-2`
frame grab from it (no original to preserve — regenerate the same way from
whatever video replaces this one).

**The canonical site origin lives in `src/lib/site.ts`** (`SITE_URL`). It feeds
`metadataBase` (root layout), `src/app/robots.ts` (which disallows `/studio` and
`/api/`), and `src/app/sitemap.ts`. On a domain move, change it there — plus the
Sanity CORS origin (§6 above) and the Adobe Fonts project (§7).

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

**🔴 Vercel's push-to-deploy is very likely broken as of the 2026-07-22 GitHub
transfer.** The repo moved from `revjake1/gtcio-site` to the
`Ogeechee-Tech-PR-and-Marketing` org (see §12), but Vercel's stored project
link still shows `org: revjake1` (checked via `GET
https://api.vercel.com/v9/projects/gtcio-site`), and the Vercel GitHub App has
**zero installations** on the new org (`GET
/orgs/Ogeechee-Tech-PR-and-Marketing/installations` → `total_count: 0`,
checked with an org-admin token, so this isn't a permissions gap in the check
itself). A GitHub App installation is scoped to the account it's installed
on — moving the repo to an org that never had the app installed means GitHub
push events no longer reach Vercel. **The CMS→rebuild path is unaffected**
(the Sanity webhook hits a Vercel Deploy Hook URL directly, independent of
the GitHub App), so publishing in the Studio should still work; it's
specifically `git push` → auto-deploy that's suspect. To fix: Vercel →
`gtcio-site` → Settings → Git → reconnect the repository, which will prompt
to install the Vercel GitHub App on `Ogeechee-Tech-PR-and-Marketing` (Jake
has admin rights on the org, confirmed via the API, so he can approve this).
**Verify with a real test** — push a trivial commit and confirm a new
Vercel deployment appears — before assuming this is fixed, and re-check that
the `sanity-publish` deploy hook (id `8r7ONDtCoE`) still exists afterward,
since a full Git-repo disconnect/reconnect in Vercel's UI has in the past
been known to drop deploy hooks tied to the old connection.

**🔴 No inquiry emails are being sent yet.** None of the four `MS_GRAPH_*` env
vars are set, so form submissions are being saved to the Studio inbox but
**nobody is being notified**. To finish (see §5's Microsoft Graph subsection
for the full detail): an OTC Microsoft 365 tenant admin registers an Azure AD
app, grants it `Mail.Send`
(application permission, admin-consented), scopes it via an Exchange
application access policy to a single sending mailbox, sets
`MS_GRAPH_TENANT_ID`/`MS_GRAPH_CLIENT_ID`/`MS_GRAPH_CLIENT_SECRET`/
`MS_GRAPH_SENDER_EMAIL` in Vercel, and redeploys. Then submit the Contact form
twice — once with only "Media inquiry" checked, once with anything else — and
confirm each lands with the right person (Jan Moore / Sean Payne — both fixed
in `src/app/api/inquiry/route.ts`, not env-configurable). **Email delivery has
never been tested end to end**, because it can't be without a working Azure
app registration. (This replaced a Web3Forms-based design 2026-07-22 — Jake
chose to drop the third-party dependency in favor of the business's own
Microsoft 365 tenant; see §5 for how the new integration differs.)

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

**✅ Publishing in the Studio now redeploys the site** (set up and verified
2026-07-20). Every page is statically prerendered at build time, and `SanityLive`
does *not* cover this on its own: it revalidates via a **client-side** server
action (`revalidateTag(tag, 'max')` in `next-sanity/dist/live/server-actions`)
that only fires *if someone has the affected page open in a browser at the moment
of publish*. Without a webhook, a publish with nobody on the site left the static
page stale until the next deploy. The chain now in place:

1. **Vercel deploy hook** `sanity-publish` on branch `main` (id `8r7ONDtCoE`).
   Vercel → **gtcio-site** → Settings → Git → Deploy Hooks.
2. **Sanity webhook** `sanity-publish` (id `cu422aiH3auTR0Au`), dataset
   `production`, on create/update/delete, filter `_type != "formSubmission"`,
   POST, GROQ API v2021-03-25, drafts off, pointed at that deploy hook.

Verified end to end: patching a published doc logged a webhook attempt with
**201** and produced a production deployment; creating *and* deleting a
`formSubmission` produced **no** attempt, so inquiries never trigger rebuilds
(both the filter and `includeDrafts: false` block them — submissions are drafts).

⚠️ **Correcting an earlier note in this file:** the Sanity webhook *is*
API-creatable — the trick is that `on` and `filter` nest under a **`rule`**
object, not at the top level. Top-level `filter` returns `"filter" is not
allowed`, and passing `type: "document"` with a string filter returns `"filter"
must be of type object`, which is what made it look impossible. The endpoint is
`POST https://api.sanity.io/v2025-08-04/hooks/projects/kjz4q8d4` with a
**user** token (`~/.config/sanity/config.json`) — the editor-role
`SANITY_API_WRITE_TOKEN` lacks the `sanity.project.webhooks` grant. Note
`sanity hooks create` itself only opens the manage UI in a browser; it calls no
API. The **Vercel** deploy hook is also API-creatable:
`POST https://api.vercel.com/v1/projects/<projectId>/deploy-hooks?teamId=<orgId>`
with `{"name","ref"}`, using the CLI token in
`~/Library/Application Support/com.vercel.cli/auth.json`.

⚠️ Do **not** recreate these by hand without deleting the old ones first — two
webhooks pointed at the same deploy hook means two rebuilds per publish. List
them with `npx sanity hooks list`.

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

**✅ Newsletter signup is wired to Constant Contact, and the one-time OAuth
setup is done** (2026-07-21) —
`src/components/NewsletterSignup.tsx`, rendered inside `Footer.tsx` on **every
page** (moved out of the home page the same day, per Jake — it used to render
only in `(site)/page.tsx`), POSTs to `/api/newsletter`, which adds the address
via Constant Contact's API. See §11 for the full integration; the connection
was verified live 2026-07-22 (a real test signup landed in the "GTCIO Website
Sign-ups" list). **2026-07-22:** the Contact form also gained a "Sign me up
for GTCIO's newsletter" checkbox that reuses this same integration — see §5.
Its copy
(`newsletterEyebrow`/`Title`/`Body`/`ButtonLabel`/`Confirmation`) lives on the
`siteSettings` singleton, not `homePage` — it moved with the component so one
edit covers every page. `(site)/layout.tsx` passes those fields to `Footer`,
which renders `<NewsletterSignup>` at the top of the `<footer>`.

Smaller items:

- **✅ C-301 is resolved** (researched 2026-07-20). The brochure left it untitled
  and printed an *Ethernet communications* description under it, on the
  Mechanical Systems course. SACA's own registry settles it: **C-301 is
  "Mechanical Power Systems 2"** — the level-2 companion to C-210 Mechanical
  Power Systems 1, which is exactly why the brochure attaches both to ISAT 1110.
  The code and placement were right; only the pasted prose was wrong. Corrected
  in `iot-curriculum.ts` from SACA (the credentialing authority, so this required
  no guess about OTC's curriculum); sources were saca.org's micro-credential
  list, `portal.saca.org` certificate records, and the Tech-Labs mirror. The
  orphaned Ethernet description belongs to a higher-level networking credential
  that isn't part of this program, and was deleted rather than re-homed.
  - Same pass: **C-209, C-210 and C-216 were re-styled to SACA's arabic
    numbering** ("Mechanical Power Systems 1", not "…I"). The brochure uses roman
    numerals for those three; left alone, C-210 would have rendered as
    "Mechanical Power Systems I" directly beside the newly-correct "Mechanical
    Power Systems 2" and read as a bug.
  - Two title variants were **left as the brochure has them**, since each has a
    matching description and neither is visibly inconsistent: C-208
    "Programmable Controller Troubleshooting 1" (some SACA mirrors abbreviate to
    "PLC Troubleshooting 1") and C-255 "Hydraulic Maintenance 1" (one mirror says
    "Hydraulic Systems 1", but the brochure's description is maintenance work —
    replacing seals, hoses, filters — so the brochure looks right). Worth a
    one-line confirmation with GTCIO if anyone is asking them about the above.
- **✅ The Operations Technology I/II numbering is resolved** (2026-07-21). An
  email confirmed two course-number changes — ISAT 3100 → ISAT 2030, ISAT
  3101 → ISAT 2040 — and Ogeechee Tech's own official course sheet for the
  program, *"Industrial Operations Technology Diploma (Start - Fall Semester
  2026)"* (`0317_001.pdf`, in the parent folder), corroborates both new
  numbers and the rest of the 12-course, 45-credit program matrix unchanged
  from the brochure. That same document also revealed a **Required General
  Education** block the brochure never mentioned — `ENGL 1010` (or `ENGL
  1101` — either satisfies it) 3 cr, `MATH 1111` College Algebra 3 cr, `EMPL
  1000` Interpersonal Relations and Professional Development 2 cr, 8 credits
  total — bringing the full program to **15 courses, 53 credit hours**.
  Updated in `src/lib/iot-curriculum.ts` (new `generalEducation` course flag,
  `PROGRAM_COURSES`/`GENERAL_EDUCATION_COURSES`/`PROGRAM_CREDITS`/
  `GENERAL_EDUCATION_CREDITS` exports alongside `COURSES`/`TOTAL_CREDITS`),
  `/iot-diploma-program/curriculum` (split program vs. general-education
  tables, both with their own totals row, matching `0317_001.pdf`'s layout),
  the `courseDetailBody` copy on `/iot-diploma-program` (code default *and*
  the published Sanity doc — patched directly, no draft existed to
  reconcile), `/credentials`' "Built into the diploma across all N program
  courses" line (now correctly scoped to `PROGRAM_COURSES`, since the general
  education courses carry no SACA credentials), and `SITEMAP.html`.
  - The interim safeguard that used to sit under the course table —
    "Course numbers and sequence are being finalised ahead of the August 2026
    launch" — has been **removed**, since two independent sources now agree.
  - **🔴 The rest of the brochure/catalog conflict is still open** — found
    2026-07-20 while chasing the objectives defect, and `0317_001.pdf` didn't
    touch it (it only lists 1102/1103/1104/1105/1130 the same way the
    brochure already has them). Per the **2025-2026** catalog
    (`ogeecheetech.smartcatalogiq.com`, prefix "ISAT — Industrial Operations
    Technology"):

    | Catalog | Brochure |
    | --- | --- |
    | ISAT **1103** Programmable Logic Control I | ISAT 1104 |
    | ISAT **1104** Programmable Logic Control II | ISAT 1105 |
    | ISAT **1105** Motor Control Systems & Troubleshooting | ISAT 1103 |
    | ISAT 1130 Sensors in Industrial **Smart** Automation | drops "Smart" |
    | ISAT 1102 → C-201 + **C-206** | → C-201 + C-205 |
    | ISAT 1130 → **C-205** + C-213 | → C-206 + C-203 + C-213 |

    That last pair **explains the misplaced objective bullets**: the brochure
    prints *electrical panel installation* objectives (C-206 work) under 1130
    "Sensors", and *sensor connect-and-test* objectives (C-205 work) under its
    1103 "Motor Controls" — the two blocks are swapped relative to the catalog.
  - **The site deliberately still publishes the brochure's version of these
    three numbers.** The catalog is the 2025-2026 edition; this program
    starts August 2026, in a **2026-2027 catalog that doesn't exist yet**, and
    the brochure may reflect an approved revision that lands in it. Nothing
    GTCIO has handed over resolves this half of the conflict. **Don't
    renumber these three off the catalog alone.**
  - `objectives` stays omitted for the Motor Controls course — its bullets are
    wrong under *either* reading. Its two credential descriptions carry the
    detail, so the page reads complete. Restore once GTCIO confirms.
  - **Ask Jan specifically:** whether C-205/C-206 sit on 1102 or 1130, and
    whether the 1103/1104/1105 sequence follows the catalog or the brochure.
- **🟡 Possible unstated selling point: graduates may earn a full SACA Specialist
  certification, not just micro-credentials** (noticed 2026-07-20 while building
  `/credentials`). Mapping the program's 22 credentials against SACA's published
  Specialist core requirements (techedproducts.com/saca-specialist-certs),
  **Electrical Systems Specialist** looks fully covered — its core set is C-101,
  C-201, C-202, C-204, C-206, all in the program — and several other Specialist
  tracks sit one credential short (often C-211, which the program doesn't
  include). The `/credentials` page ladder says the credentials "stack toward
  several Specialist tracks" but **deliberately does NOT claim a graduate
  finishes one** — the mapping is from a third-party mirror, SACA only grants a
  Specialist once the exams are passed, and GTCIO has never claimed it. If GTCIO
  confirms it, "graduate a certified SACA Specialist" is a strong recruiting
  line worth stating outright (see `SACA_TIERS` comment in
  `src/lib/credentials.ts`).
  - Not defects, just noted: the brochure's matrix runs 1105 → 1130 → 1110 (the
    college's sequence, preserved); OSHA 10 is listed as a mapping, not a SACA
    credential, so it renders unlinked; and p4 carries a stray Amatrol paragraph
    that clearly bled in from another document — **not published**.
- **⚠️ The brochure says "OPENING SEPTEMBER 2026"** (pp2, 14, 15), which
  disagrees with the ribbon-cutting date the site uses. Jake decided 2026-07-20
  to **keep the site's dates** (construction completes 9/26, ribbon cutting
  10/15/26, tours from 10/26) — those came from Jan directly and are more
  specific. Don't publish "opening September 2026" anywhere.
- **The brochure's back cover gives 1 Joe Kennedy Blvd** — that is OTC's main
  campus, the stale address (§10). GTCIO is 66 AJ Riggs Road. Don't harvest it.
- **Content still pending from GTCIO:** final tuition figure and final program
  length. **Credit hours are now known and published: 53, across 15 courses**
  (12 program courses + 3 general education courses, per `0317_001.pdf`,
  2026-07-21 — supersedes the earlier 45-across-12 figure from the brochure
  alone) — but that is deliberately *not* used to derive either figure. 53
  hours doesn't tell a student how many semesters, and a tuition estimate
  (~$5,670 at OTC's ~$107/credit-hour in-state rate) would exclude fees,
  books, and lab costs GTCIO hasn't supplied. Jake's call 2026-07-20: publish
  the credit hours, leave both boxes reading "still being confirmed." They appear in **four** places on the IOT Diploma Program page — the
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
- **News page is populated** (2026-07-20) with 14 `newsItem` docs — 7 press
  (OTC's own posts) and 7 media, spanning 2021 to 2026. All 13 outbound URLs were
  checked and return 200; the 2026-07-08 IOT program launch release has **no
  URL** — it is a Word doc in the parent folder and is not on OTC's news site, so
  its headline renders unlinked (handled by the component).
  - ⚠️ **Four dates are inferred, not read off the page.** Grice Connect sits
    behind a Cloudflare bot challenge. Its article IDs do **not** track dates
    (ID 6504521 is a Spring 2022 story — the site backfilled content), so IDs are
    useless for dating. Each Grice item is dated to match the OTC original it
    mirrors: beam signing 2025-12-10, funding announcement 2023-06-05, Amatrol
    2023-04-27, Amazon MRA 2021-05-24. Correct any that surface.
  - ⚠️ **Several headlines carry superseded specs** — "37,000 Sq ft", "36,000
    square-foot", the old GISIRTC name, and WSAV's 38,000 sq ft / $26M / 400,000
    hrs. Jake decided 2026-07-20 to **leave these as published** rather than
    annotate other outlets' headlines; the visible dates supply the context. The
    excerpts still deliberately avoid restating those numbers. **Do not harvest
    figures out of these pieces** — current is 40,000 sq ft / $27M / ~460,000 hrs
    (see the PDF note in §10, same trap).
  - ⚠️ **Four items are not about GTCIO** and were included deliberately (Jake,
    2026-07-20): ACE Electric's gift (2025-10-08) does not mention GTCIO at all,
    Goodman's Diamond Award (2023-02-16) is a staff award, and the Amatrol
    (2023-04-27) and Amazon MRA (2021-05-24) items are OTC training capability.
    If the page later needs to read as strictly GTCIO, these are the four to cut.
  - The funding announcement is listed **twice** — OTC's own post under press and
    Grice's coverage of it under media — by choice, to show outside pickup.
  - OTC also has first-party versions of the Amatrol and Amazon MRA stories
    (`/about/news/post/ogeechee-tech-now-an-amatrol-regional-training-center`,
    `/about/news/post/ogeechee-technical-college-now-a-training-provider-for-amazon-s-mra-program`)
    if the Grice versions should ever be swapped for dated first-party sources.
  - The Statesboro Magazine piece carries no byline and closes with OTC's own
    name, phone, and URL, so it may be a sponsored placement rather than
    independent reporting; it is filed as media because it ran in an outside
    outlet.
- **🔴 Book a Tour is off the site entirely until 2026-10-26** (Jake, 2026-07-20
  — reversed the earlier plan of keeping the form live with a gold "not open
  yet" notice banner). Removed: the red header button (desktop nav and mobile
  menu), the Footer's "Book a Tour" link, and the whole `#book-a-tour` section
  on the Facility page (heading, notice banner, and the request form itself).
  Also pulled from the Studio for now so editors don't see dead fields for a
  form that isn't on the site: the `tour` group and its four fields
  (`bookTourTitle`, `bookTourIntro`, `tourNoticeHeading`, `tourNotice`) are
  commented out of `facilityPage.ts` rather than deleted, and the `tour`
  `ctaButton` destination is commented out in both `ctaButton.ts` and
  `DESTINATIONS` (`sanity/lib/links.ts`) — see the code comments at each
  spot. Existing field *values* in the dataset were left untouched (not
  unset), so restoring is: uncomment those four schema fields + the two
  destination entries, and re-add the `<section id="book-a-tour">` block to
  `facility/page.tsx` (removed 2026-07-20 — check git history for the exact
  JSX) plus the two Header links and the Footer link. The old copy, including
  the October 26 date, will still be sitting in the document once the fields
  are back. `src/app/api/inquiry/route.ts` and `InquiryForm.tsx` were left
  alone — `formType: "tour"` still works, nothing to restore there. Keep
  `public/SITEMAP.html` in sync when it comes back (Facility card, Header/Footer
  "On every page" cards, and the two form/deep-link tallies at the top).
- **Facility photo gallery** shows grey PHOTO PLACEHOLDER boxes until real photos
  are uploaded (the gallery *is* CMS-editable — Facility Page → Photo gallery).
  A new **"What it will look like"** band above it (added 2026-07-20) now carries
  the architect's exterior rendering, extracted from the Industrial Operations
  Program brochure to `public/images/facility-rendering.jpg` (2400×1350, 720 KB).
  It is its own 16:9 band rather than a gallery slot — the gallery crops square
  and a square crop loses the building. The image is code-side; its heading and
  caption are CMS fields (`renderingTitle`, `renderingCaption`). **Keep the word
  "rendering" in the caption** — the building is under construction until autumn
  2026 and an uncaptioned drawing reads as a photo of a finished facility.
  ⚠️ The brochure's other usable image is a **lab photo with identifiable
  students' faces**. Jake declined to publish it 2026-07-20 pending confirmation
  that photo releases exist — don't add it without asking.
- **"What is Industrial Operations Technology?" video** (~3 min) is a placeholder
  box on the IOT page. Not produced, not scoped.
- **Nav and footer link columns** are code-only (`Header.tsx`, `Footer.tsx`) —
  deliberate, since a typo'd href there breaks navigation site-wide. Everything
  else on the page is CMS-editable; see the `ctaButton` note in §4 for how
  in-page buttons stay safe. The logo is also code-only. The footer's newsletter
  signup is the one part of `Footer.tsx` that IS CMS-editable, via
  `siteSettings` (moved off `homePage` 2026-07-21 — see §8). The Home and About
  hero videos are now CMS-editable — see §4's `heroMediaFields()` note (closed
  2026-07-20).
- **Home hero headline is sized to fit one line** (Jan, 2026-07-16). The sizes in
  `(site)/page.tsx` are measured, not guessed: the headline renders ~21.7px wide
  per 1px of font-size in Trade Gothic Next Heavy Compressed, so 52px ≈ 1128px and
  56px ≈ 1215px inside a 1200–1280px container from `xl` up. It is deliberately
  **not** `whitespace-nowrap` — the hero is `overflow-hidden`, so a longer headline
  (or the wider Arial Narrow fallback if Adobe Fonts fails) would be *clipped*
  rather than wrapped. A longer headline just wraps to two lines. Re-measure if
  the headline changes materially.
- **No rate limiting** on `/api/inquiry` or `/api/newsletter`. The honeypots,
  the payload caps (20 KB inquiry / 5 KB newsletter, both routes since
  2026-07-21), and the per-field length caps (§5) blunt casual abuse, but
  nothing stops a determined flood. If spam becomes a problem, the
  no-extra-infrastructure fix is a **Vercel WAF rate-limit rule** (Vercel
  dashboard → gtcio-site → Firewall → New Rule, e.g. 5 requests / 60s per IP on
  `POST /api/inquiry` and `/api/newsletter`) — one rule is available even on
  the Hobby plan. Escalate to Cloudflare Turnstile on the forms only if spam
  persists past that.

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

- **Site nav order** (as of 2026-07-20): About (Mission / History / Advisory Board
  / Development Authority of Bulloch County / FAQ) · IOT Training Programs · IOT
  Diploma Program · **Credentials** · Facility · Partners · News · Contact.
  "Training" is labelled **IOT Training Programs** in the nav and sits *before*
  IOT Diploma Program; Credentials was added between IOT Diploma Program and
  Facility 2026-07-20. The
  home hero buttons are IOT Training Programs · IOT Diploma Program · Become a
  Partner (a red "Become a GTCIO Partner" band sits lower on the home page).
  Nav/footer link columns are code-only (`Header.tsx`, `Footer.tsx`); the
  footer's newsletter signup is CMS-editable via `siteSettings` and renders on
  every page, not just Home (moved 2026-07-21 — see §8).
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
- **The IOT Diploma Program page has a "non-traditional program" note** (added
  2026-07-20), sitting right after the "What is Industrial Operations Technology?"
  intro paragraph — `nonTraditionalHeading` / `nonTraditionalBody` /
  `nonTraditionalResources` on `iotDiplomaProgramPage`, all CMS-editable (What is
  IOT? group). Mirrors OTC's own program page, which flags IOT as non-traditional
  (a program where one gender is under 25% of the field's workforce, currently
  women) and links out to support resources. `nonTraditionalResources` is a plain
  array of `{label, url}` — three seeded: Women in Manufacturing
  (womeninmanufacturing.org/about/who-we-are — OTC's own site mislinks half this
  label to womeninhvacr.org, an unrelated org; don't copy that), Women's
  Manufacturing Network (wmnorg.com), WIM Georgia
  (womeninmanufacturing.org/georgia). All three verified reachable 2026-07-20.
- **The IOT Diploma Program hero now carries three buttons** (2026-07-20): Apply
  Now plus **VIEW IOT PROGRAM** and **DOWNLOAD IOT PROGRAM**. All three render
  as the red `primary` variant — `Button.tsx` has only `primary` and `dark`
  variants (an earlier note here described a white-outline `heroOutline`
  variant that was never built; corrected 2026-07-21). All three are
  CMS-managed `ctaButton` fields. Two new `DESTINATIONS` keys back them:
  `iotProgramFlipbook` (<https://online.fliphtml5.com/exygb/xhzf/#p=1>, verified
  200, same `exygb` account as the employer catalog flipbook) and
  `iotProgramPdf` (`/documents/industrial-operations-program.pdf`). This mirrors
  the Training page's existing `CATALOG_URL` / `CATALOG_PDF_URL` pairing.
  - **File destinations download rather than navigate.** `DOWNLOAD_DESTINATIONS`
    in `sanity/lib/links.ts` lists which keys are files; `CtaButton` adds the
    `download` attribute for those. A file destination is never "external" in the
    new-tab sense, so the two branches are mutually exclusive. **Adding another
    downloadable PDF means adding its key to that set too**, or the button will
    navigate away from the site instead of saving.
- **`/iot-diploma-program/curriculum`** (added 2026-07-20, from the brochure) is
  the course table + per-course detail. **Deliberately not in the top nav**
  (Jake) — students reach it from the "Every course, in detail" band in the
  Curriculum section. It cross-links with `/credentials` by anchor in both
  directions: courses use `#isat-1102`-style ids, credentials use `#c-201`-style
  ids. In `sitemap.ts`, `SITEMAP.html`, and `ctaButton.ts` + `DESTINATIONS`.
  Content comes from `src/lib/iot-curriculum.ts` — see §4 and §8 before editing.
- **`/credentials` is a top-level nav item** (added 2026-07-20, between IOT
  Diploma Program and Facility, at Jake's request). It combines what had been
  the SACA glossary at `/iot-diploma-program/certifications` (which existed for a
  few hours the same day) with the FANUC/OSHA credentials and the five OTC
  accreditations that had only been on the Training page. Sections: what you
  leave with · what SACA is · the Associate/Specialist/Professional ladder · the
  22-credential glossary · why it counts (accreditations) · apply band.
  - **The old certifications URL 308-redirects to `/credentials`**
    (`next.config.ts` `redirects()`), permanent, so the URL already published in
    `sitemap.xml` transfers rather than double-indexes.
  - **The `certifications` key in `DESTINATIONS` was kept and now points at
    `/credentials`** — the entire point of the destination indirection (§4). The
    already-seeded `certificationsButton` on the IOT page followed with no
    dataset patch; its label was changed to "VIEW CREDENTIALS". Renaming the key
    would have orphaned that button. The Studio dropdown label is now
    "Credentials page".
  - Framing copy is the `credentialsPage` singleton (seeded); reference data is
    `src/lib/iot-curriculum.ts` + `src/lib/credentials.ts`.
  - ⚠️ **The nav is now 9 top-level items.** Verified 2026-07-20 to fit without
    overflow at the `xl` (1280px) breakpoint where the desktop nav appears —
    21px clear of the logo, 47px of the right edge. A tenth item, or materially
    longer labels, will need re-checking; the desktop nav has no wrap/overflow
    handling, it just gets tighter.
- **Sitewide terminology: "credentials", not "certifications"** (Jake,
  2026-07-22). Every generic mention was changed in both the code `DEFAULTS`
  and the published Sanity docs (plus the then-extant `drafts.homePage`).
  Exceptions, all deliberate: proper nouns and official titles stay as-is —
  "Smart Automation Certification Alliance (SACA)", "Gold Certification Site",
  "Certified Industry 4.0 Associate", "FANUC Certified Robot Operator",
  "Amatrol Certified Instructor Training Site", and ISO 17024's "personnel
  certification" descriptor — and the code-level identifiers keep their names
  (`DESTINATIONS.certifications`, the `certificationsButton` field, the
  `certifications` ctaButton value, and the `/iot-diploma-program/certifications`
  redirect source), since renaming those would orphan seeded content (§4).
  Don't reintroduce generic "certification(s)" in new copy.
- **The `apply` CTA destination changed 2026-07-20**: `DESTINATIONS.apply` in
  `sanity/lib/links.ts` now points to
  `https://www.ogeecheetech.edu/admissions/next-steps` (was `/IOT`, which no
  longer resolved to an application path). The IOT Diploma Program page also
  gained two more Apply Now buttons — one in the hero, one after "More than one
  way in" — beyond the original bottom Apply band, all sharing the same
  CMS-managed `applyButton` field. The footer's "Apply to the Program" link
  (code-only, `Footer.tsx`) now points straight at `DESTINATIONS.apply` instead of
  the in-page `#apply` anchor, and opens in a new tab like the site's other
  external footer links.
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
- The five current partners, shown alphabetically by `order` (set 2026-07-20):
  Ajin Georgia, Amazon, Development Authority of Bulloch County, Georgia Power,
  Koyo Bearings.
- Useful confirmed facts (from OTC's 2026-07-09 press release): $27M / 40,000 sq
  ft facility, ~460,000 instructional hours/year capacity, August 2026 launch.
  Media contact: Sean Payne, spayne@ogeecheetech.edu. Applications:
  www.ogeecheetech.edu/admissions/next-steps (the `apply` destination in
  `sanity/lib/links.ts` — changed 2026-07-20 from the old `/IOT` URL, which no
  longer resolved to an application path). **Every diploma graduate is credentialed through SACA**
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
  the demand/Hyundai/regional-anchor story above. Booking a tour is a real
  feature (temporarily off the site until 2026-10-26, see §8) — it just isn't
  the building's reason for existing.
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
- **Project timeline** (from Jan, 2026-07-16; editable at About Page → History →
  Project timeline): 7/22 push for funding begins incl. land acquisition from
  DABC · 9/22 initial funding approved · 7/23 design team selected, **PRAXIS3**
  (Atlanta architecture/design firm, praxis3.com — verified) · 8/23 construction
  team selected, **ICB Construction Group** (Macon general contractor,
  icbconstructiongroup.com — verified; a directory lists the legal name
  "International City Builders" but their own site doesn't, so the site doesn't
  claim it) · 9/23 design starts · 6/25 construction starts · 9/26 construction
  targeted for completion · **ribbon cutting 10/15/26**.
  - **Redesigned horizontal 2026-07-21** (Jake liked the "editorial" of three
    mockups pitched). `src/components/AboutTimeline.tsx` is a client component
    (needs the scroll-arrow `onClick` handlers) rendering a CSS
    scroll-snap track — full desktop cards, one-and-a-peek on phones — sized by
    **container queries** (`@container` / `@min-[560px]:`, native to Tailwind
    v4, no plugin), not viewport media queries, so it reflows correctly
    regardless of where it sits on the page. The `← Earlier` / `Later →` arrow
    buttons hide below the 560px container breakpoint; touch users swipe
    instead. The horizontal black rule the dots sit on is a single absolutely-
    positioned element behind the (non-scrolling) wrapper, not part of the
    scrolling track — the dots slide along it as the track scrolls, they don't
    carry it with them. `timelineEvent` objects gained a `highlight` boolean
    (default off) that draws a gold underline under a milestone's headline, for
    calling out the one or two stops that matter most to a visitor. Seeded
    `true` on "First classes begin" and "Ribbon cutting" only, both in the code
    `DEFAULTS` **and** patched directly onto the published `aboutPage` doc
    (`historyTimeline[_key=="t6b"]`/`[_key=="t8"]`) via the write token — a
    brand-new field like this only needs the dataset patch when you want it
    visibly on *already-seeded* content immediately, per the §4 CMS-override
    rule. No draft of `aboutPage` existed at the time, so there was nothing to
    reconcile there (check for one before assuming a future patch is done).
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
- **`public/SITEMAP.html` is the stakeholder-facing sitemap** — a single
  self-contained page (no external assets, opens offline in any browser) that Jake
  distributes for sign-off. It lives in `public/` so it serves at
  <https://gtcio-site.vercel.app/SITEMAP.html> for sharing by link. It carries
  `<meta name="robots" content="noindex, nofollow">`. **Do not also add a
  robots.txt `Disallow` for it** — a Disallow stops crawlers fetching the page,
  so they never see the noindex, and the bare URL can still be indexed. The meta
  tag is the stronger signal on its own. ⚠️ Being in `public/` makes it
  **publicly reachable by anyone with the URL** — it is unlisted, not private, so
  keep anything genuinely sensitive off it. It lists every route, each page's sections, the linkable `#anchors`,
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

---

## 11. Constant Contact newsletter integration

Added 2026-07-21. The footer's newsletter form (§8) POSTs to
`/api/newsletter`, which calls Constant Contact's v3 API to add the address to
a dedicated **"GTCIO Website Sign-ups"** list — created automatically the
first time a real signup happens after setup, not something anyone needs to
create by hand in Constant Contact.

### How it works

- **Auth is OAuth2, authorization-code grant.** Constant Contact's v3 API has
  no API-key-only mode — every call needs a per-account access token obtained
  by a human authorizing the app once. `src/app/api/constant-contact/oauth/start/route.ts`
  redirects to Constant Contact's login/consent screen (`authz.constantcontact.com`);
  approving it hits `.../oauth/callback/route.ts`, which exchanges the returned
  `code` for an access token + refresh token and saves them.
- **After that one-time step, it's fully automatic.** `src/lib/constantContact.ts`'s
  `getAccessToken()` runs before every signup: if the cached access token is
  still valid (with a 5-minute buffer) it's reused, otherwise it's refreshed
  via the stored refresh token — no human involved again unless the connection
  is revoked (see Troubleshooting below).
- **Tokens live in Sanity, not an env var — and this is required, not a
  preference.** Constant Contact **rotates the refresh token on every use**:
  each refresh call returns a *new* refresh token, and the old one stops
  working. A build-time env var can't be rewritten by a running serverless
  function, so it can't hold a value that changes on every use. The tokens
  live on a single document, `sanity/schemaTypes/documents/constantContactAuth.ts`,
  written and read only by `writeClient` (server-only, same as `formSubmission`).
  **This document must never be published** — the `production` dataset is
  publicly readable (§5's `formSubmission` trap, same risk here but worse: a
  leaked refresh token lets someone send email as GTCIO and read the whole
  contact list, not just one visitor's details) — so it only ever exists as
  `drafts.constantContactAuth`, exactly like every `formSubmission`.
  `sanity.config.ts`'s `document.actions` strips **every** Studio action for
  this type (not even Delete), and it's deliberately left out of
  `structure.ts`'s nav — nobody should ever open it by hand. If you need to
  inspect it (e.g. to check the connection is alive), query it directly with
  the write token rather than looking for it in the Studio:
  ```bash
  curl -s "https://$NEXT_PUBLIC_SANITY_PROJECT_ID.api.sanity.io/v$NEXT_PUBLIC_SANITY_API_VERSION/data/query/$NEXT_PUBLIC_SANITY_DATASET?query=*%5B_id==%22drafts.constantContactAuth%22%5D%5B0%5D" \
    -H "Authorization: Bearer $SANITY_API_WRITE_TOKEN"
  ```
- **The list is found-or-created lazily**, on the first real sign-up after
  setup, and its id is then cached on the same document — every later signup
  skips the lookup. The list name is the literal string `"GTCIO Website
  Sign-ups"` (the `LIST_NAME` constant in `constantContact.ts`). To route
  signups into a *different* existing list instead (an option Jake considered
  and could still choose later), either rename that constant to match the
  existing list's exact name before the first signup runs the lookup, or patch
  `drafts.constantContactAuth`'s `listId` field directly with the target
  list's id via the same write-token pattern above.
- **`/contacts/sign_up_form`** (not the more general `/contacts` endpoint) is
  the call `addNewsletterSignup()` makes — it's purpose-built for opt-in web
  forms: it upserts by email address with no separate existence check, and is
  meant only for contacts who explicitly asked to be added, which this form's
  visitors have.
- **First and last name are optional** (added 2026-07-21) — the form collects
  them, but signing up with email only still works. `addNewsletterSignup()`
  omits `first_name`/`last_name` from the request entirely when blank, rather
  than sending empty strings, so a returning contact who already has a name on
  file in Constant Contact never gets it blanked out by a bare-email re-signup.
- **No `formSubmission` record is kept for newsletter signups** — deliberately
  different from the other three forms (§5). A newsletter signup isn't a lead
  needing staff follow-up, so there's no reason to also store the visitor's
  email in Sanity; Constant Contact's own list is the record of truth.
- **Spam protection is a honeypot field only** (`botcheck`, same pattern as
  `InquiryForm.tsx`) — no rate limiting, matching the accepted risk already
  documented for `/api/inquiry` in §8. If this becomes a problem, add real
  rate limiting to both routes together.

### One-time setup — done (completed 2026-07-21)

This has already been run — `drafts.constantContactAuth` holds a live access
token + refresh token as of 2026-07-21, confirmed working 2026-07-22 (a real
test signup via the Contact form's newsletter checkbox, §5, landed in the
"GTCIO Website Sign-ups" list; that test contact needs manual deletion from
Constant Contact's side — flagged, not yet done as of this writing). The
steps below are kept as reference for **reconnecting** if the app is ever
disconnected from Constant Contact's side (see Troubleshooting) — until then,
nobody needs to run them again.

1. **Create a Constant Contact "Custom App."** Log into
   [developer.constantcontact.com](https://developer.constantcontact.com) —
   important: log in with **whichever Constant Contact account should own the
   list** GTCIO signups land in (their real OTC/GTCIO account, not a personal
   one) — and create a new app from "My Applications."
2. **Set its redirect URI to exactly**
   `https://gtcio-site.vercel.app/api/constant-contact/oauth/callback` —
   Constant Contact requires an exact match, no wildcards except at the domain
   root, so a typo here means the authorization step fails.
3. **Copy the app's Client ID and Client Secret.**
4. **Pick any random string** for `CONSTANT_CONTACT_SETUP_SECRET` (e.g.
   `openssl rand -hex 16`) — it just needs to be hard to guess, since it's the
   only thing standing between the public internet and the OAuth start route.
5. **Add all three to Vercel** (`CONSTANT_CONTACT_CLIENT_ID`,
   `CONSTANT_CONTACT_CLIENT_SECRET`, `CONSTANT_CONTACT_SETUP_SECRET`) —
   Project → Settings → Environment Variables, Production at minimum — **and
   redeploy**, since a running serverless function doesn't pick up a new env
   var until the next deploy.
6. **Visit**
   `https://gtcio-site.vercel.app/api/constant-contact/oauth/start?secret=<the secret you picked>`
   while logged into that same Constant Contact account in your browser.
   Approve the consent screen (it will ask for contact-list access and
   offline access).
7. You should land on a plain page reading "Constant Contact is connected." —
   that means the tokens saved successfully.
8. **Submit the footer form once for real** to confirm a contact lands in
   Constant Contact under "GTCIO Website Sign-ups," then delete that test
   contact from Constant Contact's side (there's no way to do this from the
   site).

### Troubleshooting

- **Form shows "Something went wrong on our end."** Check the Vercel function
  logs for `/api/newsletter` — if it says "Constant Contact is not connected
  yet," setup above hasn't been run (or was run before the env vars were
  redeployed). If it says something else (a Constant Contact error response),
  the connection exists but a call failed — could mean the app was
  disconnected from Constant Contact's side (Account → Integrations →
  connected apps), which invalidates the stored refresh token. Re-running step
  6 above reconnects it (the callback route uses `createOrReplace`, so
  re-running setup is always safe).
- **Confirm which account is connected** by checking Constant Contact's own
  Account → Integrations → connected apps list while logged into the account
  you *think* is connected, rather than assuming from this end — the site has
  no way to display which Constant Contact account it's talking to.

---

## 12. Accounts, access & handoff

Everything below was true 2026-07-22. **The GitHub repo moved to an OTC-owned
org this same day** (`Ogeechee-Tech-PR-and-Marketing`, Jake has admin rights
there) — see §8 for a likely knock-on break in Vercel's push-to-deploy that
still needs fixing. **Vercel hosting itself is still Jake Hallman's personal
account**, pending the self-hosting migration described in the separate
migration runbook; that's the next piece of this handoff to close.

### Who owns what

| Service | Identifier | Owner / login | Used for |
| --- | --- | --- | --- |
| GitHub | `Ogeechee-Tech-PR-and-Marketing/gtcio-site` (private) | OTC PR & Marketing org (Jake: admin) | Source of truth; push to `main` deploys |
| Vercel | `jake-hallmans-projects/gtcio-site` | Jake Hallman — **not yet transferred**, see §8 | Hosting, env vars, deploy hooks, function logs |
| Sanity | project `kjz4q8d4`, dataset `production` | Jake (admin) + `prmarketing@ogeecheetech.edu` (shared marketing login — see §8 re: its role) | All site content, form-submission inbox |
| Adobe Fonts | web project kit `fgt0fkg` | OTC's Creative Cloud licence | Trade Gothic Next (see §7 — settings live in Adobe's dashboard) |
| Microsoft Graph | Azure AD app registration | the OTC Microsoft 365 tenant (§5; tenant admin required) | Form notification email (§5; not yet set up) |
| Constant Contact | "Custom App" at developer.constantcontact.com | the OTC/GTCIO Constant Contact account (§11) | Newsletter list (§11; connected and verified working since 2026-07-21) |

### Getting set up as a new developer

1. Get invited to the GitHub repo, the Vercel project, and the Sanity project
   (someone in the table above sends each invite).
2. `git clone`, `npm install`, then copy `.env.example` → `.env.local` and fill
   it in. The Sanity tokens you mint yourself once invited:
   **sanity.io/manage → project `kjz4q8d4` → API → Tokens** — create one
   **Viewer** token (`SANITY_API_READ_TOKEN`) and one **Editor** token
   (`SANITY_API_WRITE_TOKEN`). Each token is displayed exactly once.
   The remaining secrets (Microsoft Graph app credentials, Constant Contact
   app credentials) are in Vercel → Settings → Environment Variables once
   configured.
3. `npm run dev` — the site renders without any tokens (published content is
   public); tokens only gate draft preview and the forms.
4. Read §4's traps before touching content, and §3 before moving files.

### Adding a page — the full checklist

A new page touches more files than you'd guess; missing one is silent. In
order:

1. **Schema:** create `sanity/schemaTypes/documents/<name>Page.ts`, register
   it in `sanity/schemaTypes/index.ts` — including the `singletonTypes` set if
   it's a one-per-site page.
2. **Studio nav:** add it to `sanity/structure.ts` (keep the list in site-nav
   order).
3. **Edit-on-page:** add it to `PAGE_PATHS` in `sanity/presentation.ts`.
4. **Route:** create `src/app/(site)/<slug>/page.tsx` — inside `(site)` or it
   won't get the Header/Footer. Follow the existing pattern: `DEFAULTS`
   object (in page order), `sanityFetch`, `{...DEFAULTS, ...typed}`.
5. **Navigation:** add it to `NAV_ITEMS` in `src/components/Header.tsx`
   (⚠️ re-measure — 9 items barely fit at `xl`) and the Explore column in
   `src/components/Footer.tsx`.
6. **Links plumbing:** if CMS buttons should be able to point at it, add a
   destination key to `sanity/lib/links.ts` AND the options list in
   `sanity/schemaTypes/objects/ctaButton.ts`.
7. **Sitemaps, both of them:** `src/app/sitemap.ts` (search engines) and
   `public/SITEMAP.html` (the stakeholder deliverable — update its tallies and
   the colophon date).
8. **Seed the content** in the dataset (§4 — editors should see real copy, not
   empty boxes), then run both §4 validation commands.
