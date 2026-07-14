# GTCIO website — project brief

Everything a developer or AI agent needs to pick this project up cold. Written
2026-07-14; check it against the code before trusting any specific claim.

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
    iot-diploma-program/  /iot-diploma-program
    facility/             /facility
    training/             /training
    partners/             /partners
    contact/              /contact
  studio/[[...tool]]/     /studio  ← Sanity Studio, embedded
  api/draft-mode/         enable + disable routes for preview
src/components/           Header, Footer, PageHero, Button, InquiryForm
sanity/                   schema, queries, client, structure, presentation config
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

The whole point of the CMS is that **a non-technical admin assistant operates
it.** Every decision below exists to protect that. Weigh it accordingly.

### Content model

- **Singletons, one per page:** `homePage`, `aboutPage`, `facilityPage`,
  `trainingPage`, `iotDiplomaProgramPage`, `partnersPage`, `contactPage`. Each has
  a fixed `_id` equal to its type name. They can't be created, duplicated, or
  deleted from the Studio (see `document.actions` in `sanity.config.ts`).
- **`siteSettings`** — top banner text, address, phone, program + media contacts.
  Used by Header, Footer, and the Contact page.
- **`partner`** — a standalone document per partner company.
- **Objects:** `faq`, `statCard`, `pathwayCard`, plus per-page inline types
  (`curriculumStage`, `programOption`, `jobDuty`, `payRange`).
- Interior page heroes share `heroFields()` in `sanity/schemaTypes/heroFields.ts`.

### 🔴 Four traps that will bite you

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

### Verifying CMS work

You cannot log into the Studio without Jake's password, so **do not "verify" CMS
changes by looking at the rendered website** — a correct page can hide a broken
editor (see trap 2). Use:

```bash
npx sanity schema validate                       # schema is well-formed
npx sanity documents validate --dataset production --yes   # every doc matches the schema
```

Both should report 0 errors. The second one is what catches trap 2.

---

## 5. Environment & config

`.env.local` (gitignored) and Vercel env vars (all three environments):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=kjz4q8d4
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-06-01
SANITY_API_READ_TOKEN=<viewer-role token, secret>
```

The read token is **viewer role**, used server-side for draft/preview reads only.
Editors authenticate to the Studio with their own Sanity login; the token isn't
involved in that.

**Sanity CORS origins** (`npx sanity cors list`) currently allow
`http://localhost:3000` and `https://gtcio-site.vercel.app`.
⚠️ **If the site moves to a custom domain (e.g. a real ogeecheetech.edu address),
add that origin** or the Studio's "Edit on page" preview will silently fail:
`npx sanity cors add https://newdomain --credentials`.

`next.config.ts` allow-lists `cdn.sanity.io` for `next/image`. Any new remote
image host must be added there or images 500.

---

## 6. Brand

Real OTC brand assets are in use. Don't substitute a generic palette.

| Token | Value |
| --- | --- |
| `brand-red` | `#C4122F` (primary) |
| `brand-black` | `#000000` |
| `brand-white` | `#FFFFFF` |
| `brand-silver` | `#898B8E` |
| `brand-teal` | `#007586` (accent) |
| `brand-gold` | `#F5BD16` (accent) |

Defined in `src/app/globals.css` (Tailwind v4 `@theme inline`). Type is condensed
sans (Trade Gothic Condensed in the brand guide → Arial Narrow / Helvetica
Condensed stack in code). `.font-display` = heavy, ALL CAPS (headlines/labels).
`.font-heading` = bold, sentence case. Logo: `public/images/gtcio-logo.png`.

**Partner logos are third-party trademarks.** Jake confirmed all five current
partnerships are real and authorized. Before adding any *new* company's logo,
confirm authorization first, and visually verify any sourced image is actually
that company's logo.

---

## 7. Known gaps / open work

**🔴 The forms don't do anything.** `src/components/InquiryForm.tsx` is a
client-side stub: on submit it flips to a "Message received" message and
**discards the data**. There is no backend, no email, no storage. This affects
**Book a Tour**, **Become a Partner**, and **Contact** — all three. Anyone filling
them out today is shouting into the void. This is probably the single most
important outstanding item; it needs a form backend wired up (Resend, Formspree, a
Sanity mutation, a route handler — undecided).

Other open items:

- **Content still pending from GTCIO:** final tuition figure, final program
  length, formal mission-statement sign-off, fuller partnership-history timeline.
  These render as visible "Placeholder…" text on the site today.
- **Facility photo gallery** shows grey PHOTO PLACEHOLDER boxes until real photos
  are uploaded (the gallery *is* CMS-editable — see Facility Page → Photo gallery).
- **"What is Industrial Operations Technology?" video** (~3 min) is a placeholder
  box on the IOT page. Not produced, not scoped.
- **Homepage hero video** (`public/videos/hero-construction.mp4`) is code-only,
  not CMS-editable.
- **Nav and footer links** are code-only (`Header.tsx`, `Footer.tsx`).
- **Who edits the site:** access is via a *shared* departmental mailbox,
  `prmarketing@ogeecheetech.edu`, so anyone in OTC marketing can make changes —
  not a single named assistant. Consequences: (a) all edits are attributed to
  that one account, so Sanity's per-user history can't tell you *which person*
  changed something; (b) the credential must be rotated when someone leaves the
  department. Dataset revision history is 90 days, so content mistakes are
  recoverable.
- That account should hold the **Editor** role, *not* Administrator. Administrator
  can delete the dataset, revoke the `SANITY_API_READ_TOKEN` the live site depends
  on, and change project settings — too much power to attach to a shared password.
  The initial invite went out as Administrator (2026-07-14) and was flagged for
  correction; **verify the current role** in sanity.io/manage before assuming it
  was fixed. Note Editor may require the paid Growth plan (~$15/seat/mo).

---

## 8. Commands

```bash
npm run dev                # dev server (localhost:3000; /studio for the CMS)
npm run build              # production build
npx tsc --noEmit           # typecheck
npx eslint .               # lint
npx sanity schema validate                                 # see §4
npx sanity documents validate --dataset production --yes   # see §4
npx sanity cors list       # check allowed Studio origins
```

Push to `main` → Vercel deploys automatically. `npx vercel ls gtcio-site --yes`
shows deploy status.

---

## 9. Working notes

- **Site nav order** (locked with Jan): About (Mission / Bulloch Development
  Authority / History of Partnership / FAQ) · IOT Diploma Program · Facility (with
  BOOK A TOUR) · Training · Partners · Contact.
- **Partners page is the priority page.** Jan called it out as needing to work
  "even before the website."
- The five current partners: Development Authority of Bulloch County, Koyo
  Bearings, Georgia Power, Ajin Georgia, Amazon.
- Useful confirmed facts (from OTC's 2026-07-09 press release): $27M / 40,000 sq
  ft facility, ~460,000 instructional hours/year capacity, SACA credential offered
  alongside the diploma, August 2026 launch. Media contact: Sean Payne,
  spayne@ogeecheetech.edu. Applications: www.ogeecheetech.edu/IOT.
- `EDITING.md` in this repo is the **plain-English guide written for the admin
  assistant**, not for developers. If you change how editing works, update it —
  it is the thing a non-technical person actually reads.
