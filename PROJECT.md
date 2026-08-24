# GTCIO website — project brief

Everything a developer or AI agent needs to pick this project up cold. Last
updated 2026-08-11. Check claims against the code before trusting them.

---

## 1. What this is

The website for **GTCIO** (Georgia Training Center for Industrial Operations), a
division of **Ogeechee Technical College** (OTC) in Statesboro, GA. GTCIO trains
people for industrial maintenance / automation / controls work, and launches an
Industrial Operations Technology (IOT) diploma program in **August 2026**.

- **Live:** https://gtcio-site.vercel.app
- **Repo:** https://github.com/Ogeechee-Tech-PR-and-Marketing/gtcio-site (private,
  transferred 2026-07-22 from Jake's personal `revjake1` account — see §12)
- **Editing UI:** none right now. The Sanity CMS was fully removed from the
  codebase 2026-08-11, ahead of handing the site off to a new agency, **Third
  Wave Digital**, who will connect their own CMS. Until then, content lives in
  code — see §4.
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
src/middleware.ts         site-wide PIN gate — see §6
src/app/
  layout.tsx              root: <html>/<body> only, no chrome
  site-pin/               /site-pin    PIN entry screen (outside (site) — no Header/Footer)
  (site)/                 ← every public page. Route group.
    layout.tsx            Header + Footer
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
  api/
    site-pin/             POST target that checks the PIN gate cookie (§6)
    inquiry/              POST target for all three forms (§5)
    newsletter/            POST target for the footer sign-up form (§11)
    constant-contact/
      oauth/start/         human-run once, kicks off the CTCT OAuth grant (§11)
      oauth/callback/      stores the resulting refresh token (§11)
src/lib/
  site.ts                 SITE_URL — the canonical origin (§6)
  site-pin.ts             SITE_PIN_COOKIE — shared by middleware.ts and api/site-pin (§6)
  constantContact.ts      token refresh + list lookup/create + the actual
                          sign-up call. Server-only (§11)
  constantContactStore.ts Vercel KV wrapper (getConstantContactAuth /
                          setConstantContactAuth / patchConstantContactAuth) —
                          replaced the old Sanity draft-doc token store
                          2026-08-11, see §11
  links.ts                DESTINATIONS: ctaButton destination keys → real
                          hrefs, plus safeHref/resolveHref/isExternal — moved
                          here verbatim from sanity/lib/links.ts 2026-08-11
  partners.ts             the 5 partner companies (name/description/logo
                          path/website) — exported from Sanity 2026-08-11,
                          see §4
  news.ts                 all 14 news items (press + media) — exported from
                          Sanity 2026-08-11, see §4
  iot-curriculum.ts       the IS32 course table + SACA credential glossary.
                          Always code, not CMS — read its header comment
                          before touching it (§4).
  credentials.ts          SACA's tier ladder + the four accreditations OTC holds.
                          Same code-not-CMS reasoning (§4). The accreditations
                          are the shared fallback for /credentials AND /training
                          (each page shows a different subset — see §10's
                          "Affiliations now split by audience" note).
src/components/           Header, Footer, PageHero, InquiryForm
  Button.tsx              the raw styled link (variant, target/rel)
  CtaButton.tsx           renders a `ctaButton`-shaped value via links.ts (§4)
  HeroCard.tsx            the blurred rounded scrim card behind hero copy,
                          shared by Home and every PageHero — see §10's
                          "Home hero headline is sized to fit one line" note
  NewsletterSignup.tsx    rendered inside Footer, sitewide, UI-only — see §8
deploy/                   self-hosting scaffolding — NOT yet in use (§8):
  README.md               the migration runbook (setup + cutover steps)
  gtcio-site.service      systemd unit for the on-campus server
  nginx.conf.example      reverse proxy + TLS termination template
  deploy.sh               rsync + restart, run by the Actions workflow
.github/workflows/
  deploy.yml              build-and-deploy on a self-hosted runner — parked
                          (manual workflow_dispatch only) until the
                          migration starts; see §8
```

**Why the `(site)` route group exists:** so plain, chrome-free routes — `/site-pin`
today — don't inherit the site's Header/Footer. `/site-pin` sits outside `(site)`
for exactly this reason (no CMS fetch either, it's a static form). If you add
another route that shouldn't carry the nav/footer, keep it out of `(site)` too.

---

## 4. Content — now static, pending Third Wave Digital's CMS

**The Sanity CMS was fully removed from the codebase 2026-08-11.** As of that
date, content is code-only: every page component defines a `DEFAULTS` object
and renders it directly — no CMS fetch, no fallback, no `{...DEFAULTS,
...cmsData}` merge. `DEFAULTS` **is** the content now, not a fallback for it.
The site is being prepared for handoff to a new agency, **Third Wave Digital**,
who will connect their own CMS; until that happens, a copy change means editing
the relevant file, committing, and pushing to `main` (which auto-deploys — see
§9). This section describes where that content lives today.

This was a mechanical refactor, not a content edit: every field was diffed
against the live published Sanity document before removal and matched
character-for-character in every case across all 9 pages plus the old
`siteSettings`. So every fact documented elsewhere in this file (tuition,
timeline, advisory board roster, brand terminology, etc. — see §10) is still
accurate and still live on the site; it's just sourced from a file now instead
of a document in a CMS.

### Where content lives

- **Every page's copy** is a `DEFAULTS` object in
  `src/app/(site)/<page>/page.tsx` (home, about, facility, training,
  credentials, iot-diploma-program, contact, partners, news). Every page
  component is a plain synchronous function now — no `async`, no CMS fetch, no
  `await`.
- **What used to be `siteSettings`** (top banner text, address, phone, footer
  newsletter copy) is now hardcoded constants directly in the components that
  use them: `BANNER_ORG_TEXT`/`BANNER_PARENT_TEXT` in
  `src/components/Header.tsx`, `TAGLINE`/`ADDRESS`/`PHONE` in
  `src/components/Footer.tsx`, and
  `EYEBROW`/`TITLE`/`BODY`/`BUTTON_LABEL`/`CONFIRMATION` in
  `src/components/NewsletterSignup.tsx`.
- **`src/lib/partners.ts`** — the 5 partner companies (Ajin Georgia, Amazon,
  Development Authority of Bulloch County, Georgia Power, Koyo Bearings), each
  with name/description/logo path/website. This content had **no** code
  fallback before removal — it was queried live from Sanity with nothing to
  fall back to — so it was newly exported here 2026-08-11. Logos live at
  `public/images/partner-<slug>.<ext>`, downloaded byte-for-byte from Sanity's
  CDN before the CMS was removed.
- **`src/lib/news.ts`** — all 14 news items (7 press, 7 media), same fields as
  before the removal (category/title/date/source/url/excerpt/image/imageAlt/
  imagePosition). Also had no prior code fallback, also newly exported
  2026-08-11. The 5 items that carry a thumbnail have their images at
  `public/images/news/<slug>.<ext>`, also downloaded byte-for-byte beforehand.
- **`src/lib/links.ts`** — `DESTINATIONS` (ctaButton destination keys → real
  hrefs), the `CtaButton` type, and `safeHref`/`resolveHref`/`isExternal`.
  Moved verbatim from `sanity/lib/links.ts` 2026-08-11 (it was already pure
  TypeScript with no real Sanity dependency); every importer across the
  codebase was updated to `@/lib/links`. **If a route ever moves, change
  `DESTINATIONS` here** — every button that references that key follows.
- **`src/lib/iot-curriculum.ts` and `src/lib/credentials.ts` were ALWAYS
  code, not CMS** — this is a different, older, and still-unchanged reason
  from the rest of the site being code-only as of today. The IS32 course table
  (12 program courses + 3 required general education courses, 53 credit hours
  total) and the SACA credential glossary (22 entries) that drive
  `/iot-diploma-program/curriculum` and `/credentials` are a faithful
  transcription of an *accredited* course catalog — codes, credit hours, and
  credential mappings are matters of record, not marketing copy, and a wrong
  edit misstates the program to prospective students. When the curriculum
  changes it arrives as a new brochure and a developer updates the file, same
  as always. `public/SITEMAP.html` still labels these pages "…data
  code-managed" for the stakeholder view. `src/lib/credentials.ts` (the SACA
  tier ladder and OTC's accreditations, both on `/credentials`) is code for
  the same reason. **One cross-page wrinkle, unchanged by the CMS removal:**
  the accreditations shown on `/credentials` (2 of the 4 — see §10's
  "Affiliations now split by audience" note) are the same array as
  `/training` shows, filtered by a `showOn` tag (`affiliationsFor()` in
  `credentials.ts`) — a single source feeding both pages, not two lists to
  keep in sync by hand.
- Don't confuse these two categories of "code, not a CMS field": everything in
  the previous bullet list (partners, news, page DEFAULTS, links) is code
  *as of 2026-08-11, because Sanity was removed*; `iot-curriculum.ts` and
  `credentials.ts` were *always* code, for a program-accuracy reason that has
  nothing to do with the CMS removal.

If you're reading an older commit, a design doc, or a stakeholder note that
still says "CMS-first" or "patch the Sanity doc" — that language describes how
things worked before 2026-08-11 and no longer applies. §10's historical bullets
still use that old phrasing in places since they're a record of what actually
happened at the time; see the note at the top of §10 for how to read those now.

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
3. **If the Contact form's "Sign me up for GTCIO's newsletter" checkbox is
   checked, adds the submitter to Constant Contact** (added 2026-07-22) —
   reuses `addNewsletterSignup()` from `src/lib/constantContact.ts`, the same
   function the footer's newsletter form calls (see §11). Best-effort and
   independent of the rest of the handler: a failure here is caught and
   logged (`console.error`), never turned into an error response — the
   visitor's inquiry still succeeds either way. This is the only form-level
   opt-in — Partner and Tour submissions never touch Constant Contact.
4. **Emails staff** via Microsoft Graph's `sendMail` API (an Azure AD app
   registration, client-credentials grant — see the Microsoft Graph subsection
   below) with `subject` built from the dropdown choice and `replyTo` set to
   the submitter, so staff can just hit Reply. **This is now the only record
   of an inquiry — there is nothing else it's saved to.**

**🔴 Changed 2026-08-11, and this is a deliberate, accepted risk Jake signed
off on:** until 2026-08-11, every submission was saved to Sanity as a
`formSubmission` document *before* any email was attempted, specifically so a
bounced or spam-filtered notification never meant a lost lead — a failed send
still left the inquiry sitting in the Studio inbox for someone to find by hand.
That Sanity write is gone; there is no CMS to write it to anymore. The route
now succeeds **only if the email actually delivers to every intended
recipient**. If Microsoft Graph isn't configured, or delivery fails for any
other reason, the route returns a `500` with
`{"error": "Something went wrong on our end. Please email us directly."}` and
the submission is gone — not saved anywhere, not queued, not recoverable.
**As of today none of the four `MS_GRAPH_*` vars are set in Vercel production**
(see §8) — this is the same pre-existing gap as before 2026-08-11, but the
consequence changed: previously a misconfigured Graph meant "saved but not
emailed," now it means **lost entirely**. Finishing the Microsoft Graph setup
(§8) is now urgent, not just a nice-to-have — until it's done, every Partner
and Contact submission that reaches the site with Graph unconfigured
disappears with no trace.

### Dropdowns

- **Become a Partner** — options are generated from `DEFAULTS.pathways` in
  `partners/page.tsx`, i.e. the same Partnership Pathway cards displayed above
  the form, so renaming a pathway card's title generally carries through to
  the form automatically.
  **This is deliberately NOT total sync, though** — `FORM_LABEL_OVERRIDES` and
  `EXTRA_FORM_OPTIONS` in `partners/page.tsx` let two checkbox choices diverge
  from the cards on purpose (currently: "Training Program Partner" shows as
  "Become a Training Partner" on the form, and "Facility Tour" is a form
  choice with no matching card at all) — see §10's "Partners page pathways
  restructured" note for why. Don't "fix" that mismatch by reconciling the two
  lists. Then a hardcoded "Something else / not sure yet" is appended.
  **Checkboxes, not a dropdown** (changed 2026-07-20) — a prospective partner
  can be interested in more than one pathway at once.
- **Contact** — options come from `DEFAULTS.contactReasons` in
  `src/app/(site)/contact/page.tsx`, a plain array in code. **Single-select
  dropdown** — a visitor picks exactly one reason (tried
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
- Renaming the "Media inquiry" checkbox label in the code breaks this
  matching silently — `MEDIA_REASON` in the route file has to change with it.
- Changing who receives notifications (e.g. Jan or Sean changes roles) means
  editing `NOTIFY_EMAIL`/`NOTIFY_EMAIL_MEDIA` in the route and redeploying —
  same tradeoff the code already accepts for `MEDIA_REASON`.

**🔴 If Microsoft Graph isn't configured (any of the four `MS_GRAPH_*` env
vars missing), the submission is lost.** Before 2026-08-11 this degraded
gracefully — the site still worked and still saved every submission to the
Sanity inbox, it just didn't email anyone. There is no CMS to fall back to
now: the route returns a `500` and nothing about the inquiry survives
anywhere. See the 🔴 note above and §8 for the current status — this is why
finishing Microsoft Graph setup is now urgent.

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
   Copy the secret's **value** immediately — it's shown once and can't be
   retrieved again. This becomes `MS_GRAPH_CLIENT_SECRET`.
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
MS_GRAPH_TENANT_ID=<see §5; unset = no email, and the inquiry is lost, not saved>
MS_GRAPH_CLIENT_ID=<see §5; from the Azure AD app registration>
MS_GRAPH_CLIENT_SECRET=<see §5; from the same app registration, secret>
MS_GRAPH_SENDER_EMAIL=<see §5; the mailbox notification emails send AS>
CONSTANT_CONTACT_CLIENT_ID=<see §11; from the Constant Contact developer app>
CONSTANT_CONTACT_CLIENT_SECRET=<see §11; from the same app, secret>
CONSTANT_CONTACT_SETUP_SECRET=<see §11; any random string you pick — gates the one-time OAuth URL>
KV_REST_API_URL=<see §11; auto-injected once Vercel KV is provisioned — NOT set as of 2026-08-11, see §8>
KV_REST_API_TOKEN=<see §11; auto-injected alongside KV_REST_API_URL>
SITE_ACCESS_PIN=<optional — see "Site-wide PIN gate" below; unset = gate is off>
```

`KV_REST_API_URL`/`KV_REST_API_TOKEN` come from a Vercel KV (Upstash Redis)
store connected to the project — you don't set these by hand. Vercel →
gtcio-site → Storage → Create Database auto-injects both into every
environment. **This store does not exist yet as of 2026-08-11** (Jake said
he'll provision it himself) — see §8 and §11.

**Site-wide PIN gate** (added 2026-08-06, pre-launch). `src/middleware.ts` runs
on every request; if `SITE_ACCESS_PIN` is set, a visitor with no matching
`gtcio_pin` cookie is redirected to `/site-pin`, a plain form (no CMS fetch, no
Header/Footer — same route-group isolation as noted in §3) that POSTs to
`/api/site-pin`. A correct submission sets an httpOnly cookie holding the PIN
itself, valid 30 days, and the visitor is sent back to the page they wanted.
This is a **basic deterrent, not real authentication** — the PIN is shared and
sits in plaintext in the cookie (readable in devtools by the visitor holding
it, not by anyone else) and there's no rate limiting on guesses. Good enough to
keep an unlaunched site off casual visitors' radar; not a substitute for actual
auth if that's ever needed.
- **Unset = fails open.** Forgetting to set `SITE_ACCESS_PIN` in Vercel means
  the site is fully public, not fully locked — deliberate, so a missing env var
  can't accidentally lock Jake out too.
- **Bypassed paths** (`BYPASS_PATHS` in `middleware.ts`): `/site-pin` and
  `/api/site-pin` (or the gate could never be passed), and
  `/api/constant-contact/oauth/callback` (§11's OAuth redirect target — a third
  party sends the visitor's browser here, and it shouldn't depend on gate-cookie
  state). Everything else sits behind the gate.
- **Static assets bypass the gate entirely** via `middleware.ts`'s `matcher`
  (common file extensions, `_next/*`) — a direct link to a video or PDF isn't
  blocked, only the pages that link to them are. Acceptable for a casual-visitor
  deterrent.
- **To turn the gate off:** unset `SITE_ACCESS_PIN` in Vercel and redeploy — no
  code change needed. To change the PIN, just change the env var and redeploy;
  everyone's existing cookie stops matching and they'll be asked again.

`next.config.ts` no longer allow-lists any remote image host (the `images.remotePatterns`
block was deleted 2026-08-11 along with `cdn.sanity.io`, the only entry it
ever had) — every image on the site is local, served from `public/`. If a
future integration needs a remote image host again, add an `images` config
block back to `next.config.ts` or those images will 500.

`next.config.ts` also sets security headers on every route (added 2026-07-20):
**`X-Frame-Options: DENY`** and **`Content-Security-Policy`'s
`frame-ancestors 'none'`** (tightened 2026-08-11 — these were `SAMEORIGIN` /
`frame-ancestors 'self'` only because the Sanity Studio's "Edit on page" tool
iframed the site from `/studio` on the same origin; with the Studio gone
there's no legitimate same-origin iframe use case left, so this is a security
tightening, not just cleanup), `X-Content-Type-Options: nosniff`,
`Referrer-Policy`, a restrictive `Permissions-Policy`, and (added 2026-07-21) a
baseline `Content-Security-Policy` (`object-src 'none'; base-uri 'self'` —
deliberately not a full `default-src` policy, which Adobe Fonts would make
fragile). `Strict-Transport-Security` is set by the app itself as of
2026-07-22 (previously left to Vercel's edge, which sets it on `*.vercel.app`
— the planned self-hosted setup has no equivalent edge layer, so the app owns
the header now; harmless duplication while still on Vercel).

`next.config.ts` also serves `public/videos|images|documents` with
`Cache-Control: public, max-age=31536000, immutable` (added 2026-07-21 — they
previously revalidated on every visit). ⚠️ Consequence: **never change one of
those files in place** — prior visitors would see the stale version for up to a
year. Rename the file (`hero-construction-2.mp4`) and update its references
instead. Originals of the re-encoded media live outside the repo in
`../media-originals/`.

**`otc-industrial-systems-training-program-2.pdf`** (swapped in 2026-08-05,
replacing `otc-industrial-systems-training-program.pdf`) restores the training
catalog PDF to its **original, uncompressed 29.7MB** file — the previous file
had been recompressed to 11.9MB at some point and Jake said it "looks
terrible" (visibly degraded image quality in the brochure's photos). Restored
byte-for-byte from `../media-originals/otc-industrial-systems-training-program.pdf`
(checksum-verified identical to Jake's supplied copy) rather than
re-compressed — **do not recompress this file**. `industrial-operations-program.pdf`
was checked at the same time and was already byte-identical to Jake's supplied
copy, so it needed no change. Referenced from `CATALOG_PDF_URL` in
`src/app/(site)/training/page.tsx`.

**`otc-industrial-systems-training-program-3.pdf`** (swapped in 2026-08-06,
replacing `-2.pdf`) is a genuinely updated brochure Jake supplied directly —
`2026-08-06_Industrial_Operations_Program_v01_jh.pdf`, 22 pages, 5.85MB — not
a re-compression of the old one. Content confirmed via `pypdf` text
extraction to be the same "Train Your Team, Retain Your Team" employer
training catalog before wiring it up (its filename's "Industrial Operations
Program" is misleading — that's the name of the *other* PDF on this site,
`industrial-operations-program.pdf`; don't confuse the two on a future
update). Copied byte-for-byte (checksum-verified) to both
`public/documents/otc-industrial-systems-training-program-3.pdf` and
`../media-originals/otc-industrial-systems-training-program-3-source.pdf`,
same `-source.pdf` naming pattern as the hero video swaps. **The old
`-2.pdf` (29.7MB) was deleted from `public/`** — confirmed by grep it was
referenced nowhere else in the repo besides `CATALOG_PDF_URL`, same cleanup
pattern as retired hero videos (§10's home-hero notes). If this file is
swapped again, re-encode/replace from a fresh original rather than
compounding edits on this one, and re-verify the content still matches the
training catalog (not the diploma-program PDF) before pointing
`CATALOG_PDF_URL` at it.

**`otc-industrial-systems-training-program-4.pdf`** (swapped 2026-08-18,
replacing `-3.pdf`) is another genuine content update Jake supplied directly
as `OTC Industrial Systems Training Program.pdf` (22 pages, 4.77MB — Jake's
own smaller export, not recompressed by this session). Diffed against `-3.pdf`
via `pypdf` text extraction plus a page-by-page embedded-image hash compare
(`PyMuPDF`) before wiring it up, since a text-only diff would have missed a
photo swap: text changes are cosmetic (the "AT A GLANCE" stat block now reads
"Training Hours in 2026" / 198,000, was "...2024" / 242,000 — not a figure
this site displays, see the `242,000 hours in 2024` note further down this
section) and every embedded image is byte-identical **except** two pages —
p6's stock robot-arm close-up was replaced with a real instructor/student lab
photo, and p9 lost a stray **`PRAXIS3` logo watermark** bleeding into its
bottom-right corner (PRAXIS3 is the GTCIO building's architecture firm, §10 —
unrelated to this brochure; its presence there was a leftover export artifact
in `-3.pdf`, now fixed upstream). No page.tsx copy changes were needed. Copied
byte-for-byte (checksum-verified) to both
`public/documents/otc-industrial-systems-training-program-4.pdf` and
`../media-originals/otc-industrial-systems-training-program-4-source.pdf`.
**The old `-3.pdf` (5.85MB) was deleted from `public/`** — confirmed by grep
it was referenced nowhere else besides `CATALOG_PDF_URL`, same cleanup
pattern as prior swaps. If this file is swapped again, run the same
image-hash diff (not just text) before assuming nothing but stats changed.

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

**`hero-construction-6.mp4`** (swapped in 2026-08-03, replacing
`hero-construction-5.mp4` with the same footage re-compressed — same 43.2s
duration and frames, just a better encode) is **not** part of that pipeline —
Jake supplied it already compressed (22MB, 1920×1080, h264, ~4.1 Mbps, no
audio), and it's used byte-for-byte as delivered, same as `-5` before it.
**Do not re-encode it** if it's swapped again; same reasoning applies to
whatever replaces it unless told otherwise. The delivered original lives at
`../media-originals/hero-construction-6-source.mp4`.
`hero-construction-poster-5.jpg` is a plain `ffmpeg -ss 2 ... -vf scale=1600:-2`
frame grab from it — regenerate the same way from whatever video replaces this
one. The prior pair, `hero-construction-5.mp4` and `hero-construction-poster-4.jpg`,
were deleted from `public/` after the swap, following the same pattern as
`hero-construction-4.mp4` before them — nothing else in the repo referenced
them (verified by grep) and Sanity's `homePage` doc has no
`heroVideo`/`heroImage` override (verified via the API) that would need
patching.

**The canonical site origin lives in `src/lib/site.ts`** (`SITE_URL`). It feeds
`metadataBase` (root layout), `src/app/robots.ts` (which disallows `/api/` —
the `/studio` entry was dropped 2026-08-11, that route no longer exists), and
`src/app/sitemap.ts`. On a domain move, change it there — plus the Adobe Fonts
project (§7).

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
Logo: `public/images/gtcio-logo.png` (red/black, Header on the white banner) and
`public/images/gtcio-logo-white.png` (Footer on `bg-brand-black`) — **two
separate source files, not one file plus a CSS filter.** The white version was
added 2026-08-24, replacing a `brightness-0 invert` filter applied to the
red/black file: that filter flattens every opaque pixel to black then white
regardless of its original color, and the OTC diamond icon in the middle of
the Georgia shape is drawn as color-on-color (not a transparency cutout), so
it disappeared into a solid white silhouette. The white file is a dedicated
export from OTC's Design Hub
(`** Design Hub/** Logos/**Econ Development/Georgia Training Center for
Industrial Operations/GTCIO Logo - Final/GTCIO_Logo_White.png` on
`/Volumes/PR_Marketing`) where the icon is a real transparency cutout, so it
renders correctly with no filter. If the brand mark is ever swapped, update
both files from the same Design Hub source rather than reintroducing a CSS
filter on one of them.

### Type — real Trade Gothic Next, via Adobe Fonts

The brand guide's actual faces are loaded from Adobe Fonts under OTC's Creative
Cloud licence (kit `jok5hww`, linked in `src/app/layout.tsx`). Arial Narrow — the
guide's own approved substitute — remains the fallback.

**Moved to OTC's own Adobe account 2026-08-12** — until then this was actually
running under Jake's personal Adobe account (kit `fgt0fkg`, now retired), not
OTC's licence as this section previously (incorrectly) said. Jake got a proper
work Adobe account, created a new web project there with the same three faces
(`trade-gothic-next-compressed` 800, `trade-gothic-next-condensed` 700/400),
set `font-display: Swap` on all three (verified via the same curl check
below), and the kit ID was swapped in `layout.tsx`. If font licensing questions
come up again, the account of record is the work Adobe ID, not Jake's personal
one.

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
   2026-08-12, on the new work-account kit — the new web project defaulted to
   `auto` on all three faces and had to be switched by hand before the kit ID
   was put into the code) — but the setting lives in Adobe's dashboard, not in
   this repo, so it can be changed out from under the code and won't show in a
   diff. If text ever flashes invisible, check this first:
   `curl -s https://use.typekit.net/jok5hww.css | grep -o 'font-display:[a-z]*' | sort | uniq -c`
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

**✅ Vercel's connection to the repo was repaired 2026-07-22**, after the
same-day GitHub transfer to `Ogeechee-Tech-PR-and-Marketing` broke it (a
GitHub App installation is scoped to the account it's installed on, and the
new org had no Vercel App installation at all). Jake reconnected Vercel →
`gtcio-site` → Settings → Git, which installed the Vercel GitHub App on the
new org — confirmed via the GitHub API (`installations` now shows the
`vercel` app subscribed to `push` events) and via a real test: pushing commit
`aa89948` triggered an automatic Vercel deployment that reached `READY`.
**The reconnect did drop the `sanity-publish` deploy hook**, exactly the risk
flagged when this was diagnosed — the project's `deployHooks` list came back
empty afterward. Recreated it (new id `e73E4bmO3a`, same name/branch) and
re-pointed the existing Sanity webhook (`cu422aiH3auTR0Au`) at its new URL;
confirmed by POSTing the hook directly and seeing a `PENDING` build job
returned. **If Vercel's Git connection is ever disconnected/reconnected
again, re-check `deployHooks` on the project afterward** — this isn't a
one-time fluke, it's how that Vercel flow behaves.

**🟡 The self-hosting migration is scaffolded but not started.** `deploy/`
(systemd unit, nginx template, deploy script) and
`.github/workflows/deploy.yml` were committed 2026-07-22 as the first step of
moving hosting off Jake's personal Vercel account onto an OTC on-campus
server. Nothing is live: no server exists yet, no self-hosted runner is
registered, and the site still deploys through Vercel. The full setup +
cutover checklist is **`deploy/README.md`** (this is "the migration runbook"
the deploy files refer to). The workflow's automatic triggers (`push` and
`repository_dispatch`) are **commented out as of 2026-07-23** — with no
runner to land on, every push to `main` was leaving a GitHub Actions run
stuck "queued" indefinitely (observed sitting 16+ hours; all cancelled).
Only manual `workflow_dispatch` remains enabled. **Restoring those two
triggers is part of the migration** (deploy/README.md, server setup step 3)
— don't forget, or the finished pipeline will only ever deploy by hand.

**🔴 No inquiry emails are being sent yet — and as of 2026-08-11 this means
lost leads, not just unsent notifications.** None of the four `MS_GRAPH_*` env
vars are set. Before 2026-08-11, an unconfigured Graph meant a submission was
still saved to the Sanity inbox for someone to follow up on by hand. The
Sanity save is gone now — see §5's 🔴 note — so today, every Partner/Contact
submission that comes in disappears with no record anywhere. **This raises the
priority of finishing Microsoft Graph setup considerably.** To finish (see
§5's Microsoft Graph subsection for the full detail): an OTC Microsoft 365
tenant admin registers an Azure AD app, grants it `Mail.Send` (application
permission, admin-consented), scopes it via an Exchange application access
policy to a single sending mailbox, sets
`MS_GRAPH_TENANT_ID`/`MS_GRAPH_CLIENT_ID`/`MS_GRAPH_CLIENT_SECRET`/
`MS_GRAPH_SENDER_EMAIL` in Vercel, and redeploys. Then submit the Contact form
twice — once with only "Media inquiry" checked, once with anything else — and
confirm each lands with the right person (Jan Moore / Sean Payne — both fixed
in `src/app/api/inquiry/route.ts`, not env-configurable). **Email delivery has
never been tested end to end**, because it can't be without a working Azure
app registration. (This replaced a Web3Forms-based design 2026-07-22 — Jake
chose to drop the third-party dependency in favor of the business's own
Microsoft 365 tenant; see §5 for how the new integration differs.)

**🔴 Vercel KV store not yet provisioned — blocks the newsletter's Constant
Contact integration.** The Constant Contact OAuth token store moved from a
Sanity draft document to Vercel KV on 2026-08-11 (see §11) — `src/lib/constantContactStore.ts`
wraps `@vercel/kv`. No KV store is connected to the `gtcio-site` Vercel
project yet, so every call throws, which currently surfaces to visitors as the
newsletter form's existing "Constant Contact is not connected yet" failure
mode (same symptom as before 2026-08-11, different underlying cause). Jake
said he'll provision it himself: Vercel → gtcio-site → Storage → Create
Database, which auto-injects `KV_REST_API_URL`/`KV_REST_API_TOKEN`. This is
also explicitly an **interim** solution — when Third Wave Digital takes over,
Jake will work out the newsletter integration's longer-term home with them
directly, so don't treat Vercel KV as a permanent architectural decision.

**The Sanity project itself (`kjz4q8d4`/`production`) was deliberately left
intact, not deleted**, when the CMS was removed from the codebase 2026-08-11
— it sits dormant as a historical record/rollback option. That's Jake's
account-level call, nothing in this repo depends on it anymore. Nobody needs
Sanity access for day-to-day site operation now — the shared-account
Administrator-vs-Editor role concern that used to sit here is moot.

**Who edits the site:** as of 2026-08-11, through a developer — there's no
CMS login for marketing staff to make changes with. The shared departmental
mailbox `prmarketing@ogeecheetech.edu` was the Sanity Studio login before the
CMS was removed; it isn't how edits happen anymore. See §4 for where content
lives and how to change it.

**✅ The old Sanity publish webhook was deleted 2026-08-11.** Before that date,
a Sanity webhook (`sanity-publish`, id `cu422aiH3auTR0Au`) fired a Vercel
deploy hook (id `e73E4bmO3a`) on every publish, so an editor's change would
trigger a fresh production build without anyone having to push code — full
mechanics were documented here in earlier revisions of this file, see git
history if that's ever useful again. That chain became moot the moment Sanity
was removed (no more publish event to trigger anything), and the webhook
itself was deleted via the Sanity Management API the same day (confirmed via
`GET /v2025-08-04/hooks/projects/kjz4q8d4` returning `[]` afterward).
**Deploys are now purely push-to-`main`** — every content change is a code
change, and Vercel's existing auto-deploy-on-push (unaffected by any of this,
§2) is the only mechanism left. The Vercel deploy hook itself was left in
place (harmless, and reused as-is if the self-hosting migration's
`repository_dispatch` idea ever comes back for a different trigger).

**✅ Newsletter signup is wired to Constant Contact, and the one-time OAuth
setup is done** (2026-07-21) —
`src/components/NewsletterSignup.tsx`, rendered inside `Footer.tsx` on **every
page** (moved out of the home page the same day, per Jake — it used to render
only in `(site)/page.tsx`), POSTs to `/api/newsletter`, which adds the address
via Constant Contact's API. See §11 for the full integration; the connection
was verified live 2026-07-22 (a real test signup landed in the "GTCIO Website
Sign-ups" list). **2026-07-22:** the Contact form also gained a "Sign me up
for GTCIO's newsletter" checkbox that reuses this same integration — see §5.
Its copy (`EYEBROW`/`TITLE`/`BODY`/`BUTTON_LABEL`/`CONFIRMATION`) lives as
constants directly in `NewsletterSignup.tsx` itself as of 2026-08-11 (formerly
on the Sanity `siteSettings` singleton — see §4) — one file, rendered inside
`Footer.tsx` on every page, so one edit still covers every page.

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
- **✅ Tuition, program length, and financial aid are now confirmed and
  published** (Jake, 2026-07-30 — resolves both the "content still pending"
  and "financial aid not mentioned" cautions that used to sit here, dated
  2026-07-16/07-20; see them in git history if the reasoning below ever needs
  re-checking). **Time to complete: four semesters. Approximate cost: ~$9,000**
  before financial aid — the site now explicitly names the **HOPE Grant, HOPE
  Career Grant, and Pell Grant** as applicable, which resolves the earlier
  caution against claiming HOPE Career Grant eligibility without GTCIO
  confirmation (Jake confirmed it directly this session). Both figures appear
  in the same **four** places on the IOT Diploma Program page as before — the
  "Time to complete" and "Approximate cost" boxes (`timeToComplete`,
  `approximateCost`) and the matching FAQ answers (`faqs[_key=="f5"]` and
  `[_key=="f4"]`) — patched in code and in the published `iotDiplomaProgramPage`
  doc (no draft existed to reconcile). **The "still being confirmed" wording is
  gone from all four; don't reintroduce it.** Credit hours (**53, across 15
  courses** — 12 program courses + 3 general education courses, per
  `0317_001.pdf`, 2026-07-21 — supersedes the earlier 45-across-12 figure from
  the brochure alone) remain a separate fact from tuition/length and were never
  used to derive either.
- **✅ Advisory Board section (About page) is populated** (Jake, 2026-08-06),
  from a photo of the GTCIO Advisory Board roster sheet. New object type
  `boardMember` (`sanity/schemaTypes/objects/boardMember.ts` — name, title,
  organization, and a `category` radio splitting Board Member vs. Ex Officio)
  backs a new `aboutPage.advisoryMembers` array field; `about/page.tsx` renders
  the two groups as separate labeled card grids under the existing
  `advisoryBody` paragraph. Seeded in code `DEFAULTS` and patched directly onto
  the published `aboutPage` doc (no draft existed to reconcile) — 9 Board
  Members, 6 Ex Officio. `advisoryNote`'s old "(members to be added)" placeholder
  is cleared in both places.
  - **Two rows on the source sheet were incomplete and were omitted rather than
    guessed**, per Jake's explicit choice when asked: a "Board Member" seat
    tied to "Ogeechee Technical College Local Board of Directors" had no name
    filled in, and Southeastern Technical College's President was listed as
    "TBD." Neither is on the published roster. **If either name is confirmed
    later, add them to `advisoryMembers` in `about/page.tsx`'s `DEFAULTS`**
    (the only place this content lives now — §4).
  - **Roster fact-checked 2026-08-06** (web research, all 15 people). 12 of 15
    checked out cleanly against current sources: Daniel Cox, Tramaine Melvin,
    Rob Lanham, Kent Powell, David Rogers, Jim Wall, Lori Durden, Billy
    Hickman, Lehman Franklin, Doug Lambert, Benjy Thompson, and — per Jake's
    direct confirmation — **Matt Dollar** (independent sourcing found was
    ~4 years old, from his Feb. 2022 appointment as TCSG Deputy Commissioner
    of Economic Development, with nothing more recent; Jake confirmed he's
    still in the role) and **Jan Moore's "Board Chair" title** (not
    independently verifiable online, since it's an internal board
    designation rather than a public title; Jake confirmed it directly).
    Two findings acted on differently:
    - **Sandy Lake's org fixed**: "Georgia Center **for** Innovation" →
      "Georgia Center **of** Innovation" (the Georgia Dept. of Economic
      Development's actual name for it, confirmed via LinkedIn and
      georgia.org). Patched in both the code `DEFAULTS`
      (`advisoryMembers`, key `bm5`) and the published `aboutPage` doc (no
      draft existed).
    - **Stuart Gregory's org left as Shalotek, deliberately** — every
      independent source found (RocketReach, ZoomInfo, the
      Statesboro-Bulloch Chamber directory) ties him to Bulloch Solutions
      instead, but **Jake confirmed Shalotek is correct** and asked to keep
      it as published. Don't "fix" this to Bulloch Solutions based on the
      secondary sourcing alone — this has already been checked with Jake.
- **Partner website links:** each partner block shows a red **LEARN MORE** button
  only when that partner's `website` URL is set. All five are set and were each
  verified against the live site (2026-07-16): Development Authority of Bulloch
  County → advantagebulloch.com, Ajin Georgia → ajingeorgia.com, Georgia Power →
  georgiapower.com, Koyo Bearings → jtekt-na.com/products/koyobearings/ (JTEKT
  rebranded the Koyo bearings brand to JTEKT in 2022; Jake chose JTEKT North
  America), Amazon → aboutamazon.com (corporate, Jake's choice over retail).
  Verify any new partner URL against the real site before setting it.
  ⚠️ **That partner card's LEARN MORE button isn't currently visible** — the
  whole "Our Partners" section is hidden site-wide as of 2026-08-06 (see the
  §8 entry above). Jake asked 2026-08-06 for at least one *currently live*
  place linking to advantagebulloch.com, so a second, independent link was
  added: `aboutPage.bdaWebsite` (new `url` field, bda group), rendered as a
  matching red LEARN MORE button at the end of the About page's Development
  Authority of Bulloch County section (`#bulloch-development-authority`),
  same styling as a partner card's button and same `safeHref()` sanitizing.
  Seeded to `https://advantagebulloch.com/` in both the code `DEFAULTS` and
  the published doc (no draft existed). If the Partners directory section
  ever comes back, both links will point at DABC's site independently —
  that's intentional redundancy, not a bug to reconcile.
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
    figures out of these pieces** — current is 39,700 sq ft / $27M / ~460,000 hrs
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
  - **Thumbnails added 2026-07-23** — `newsItem` gained optional `image` +
    `imageAlt` fields (hotspot-cropped, same pattern as a partner logo).
    Populated for the **5 of 7 press releases** whose OTC article page had a
    usable photo, pulled directly from `ogeecheetech.edu` and uploaded as
    Sanity assets: beam signing, ACE Electric gift, groundbreaking, the 2023
    training-center-announcement rendering, and Goodman's Diamond Award. The
    2026-07-08 IOT launch item has no URL to pull from (see above); the
    2021-09-29 commissioners item's image path 404s (an old relative-path
    image link on OTC's site that no longer resolves) — soft-404 HTML was
    returned with a 200 status, so **check any future pull actually got image
    bytes, not an HTML error page, before uploading it as an asset.**
    **Deliberately not pulled for the 7 "In the News" (media) items** — Jake's
    call: those photos belong to WSAV/Statesboro Herald/Statesboro
    Magazine/Grice Connect, and republishing another outlet's editorial
    photography on GTCIO's own site has no license behind it, unlike reusing
    OTC's own press photos on OTC's own division site. If that changes, get
    each outlet's permission first — don't bulk-pull them the same way.
- **🔴 Book a Tour is off the site entirely until 2026-10-26** (Jake, 2026-07-20
  — reversed the earlier plan of keeping the form live with a gold "not open
  yet" notice banner). Removed: the red header button (desktop nav and mobile
  menu), the Footer's "Book a Tour" link, and the whole `#book-a-tour` section
  on the Facility page (heading, notice banner, and the request form itself).
  At the time, the `tour` group and its four fields (`bookTourTitle`,
  `bookTourIntro`, `tourNoticeHeading`, `tourNotice`) were commented out of
  the Sanity schema rather than deleted, so the field *values* — including the
  October 26 date — sat intact in the dataset, ready to reappear once
  uncommented. **That restore path no longer exists as of 2026-08-11** — there
  is no Sanity schema to uncomment anymore, and `facilityPage.ts`'s `DEFAULTS`
  in `src/app/(site)/facility/page.tsx` was never given a `tour`/`bookTour*`
  block (the section was already off the page before today's removal, so
  there was nothing live to carry over). **Restoring Book a Tour now means
  writing the copy fresh in code**, not recovering it from anywhere — though
  the old field values may still be sitting in the dormant `kjz4q8d4` Sanity
  project (left intact, not deleted, see above) if anyone wants to mint a
  fresh read token and pull them for reference before writing the section by
  hand. Restoring also means: re-adding the `<section id="book-a-tour">` block
  to `facility/page.tsx` (removed 2026-07-20 — check git history for the exact
  JSX) plus the two Header links and the Footer link, and adding a `tour`
  destination back to `DESTINATIONS` in `src/lib/links.ts` if the section uses
  a `ctaButton`-style link. `src/app/api/inquiry/route.ts` and
  `InquiryForm.tsx` were left alone — `formType: "tour"` still works, nothing
  to restore there. Keep `public/SITEMAP.html` in sync when it comes back
  (Facility card, Header/Footer "On every page" cards, and the two
  form/deep-link tallies at the top).
- **🔴 The Partners page's "Our Partners" section is hidden — no return date
  set** (Jake, 2026-08-06). Both halves of it are off: the logo collage and
  the five full per-partner cards (logo, description, LEARN MORE) below it —
  they're both inside the same `<section>` in `partners/page.tsx`, so hiding
  one meant hiding both. Implementation is a `SHOW_PARTNER_DIRECTORY = false`
  constant guarding the whole section with `{SHOW_PARTNER_DIRECTORY && (...)}`
  — lighter-weight than the Book a Tour removal above since there's no schema
  or nav/footer link tied to this section (no header/footer link points at
  it, and it carries no `id` anchor of its own — only the individual partner
  cards inside it do, e.g. `#ajin-georgia`, which are also hidden along with
  everything else in the section). **To restore: flip the constant back to
  `true`.** Nothing else needs to change — the 5 partner companies now live in
  `src/lib/partners.ts` (moved there from Sanity 2026-08-11, see §4) and
  `directoryTitle`/`directoryIntro` copy is part of `DEFAULTS` in
  `partners/page.tsx`; neither needed touching for the section to be hidden,
  same as before. Kept in sync: `public/SITEMAP.html`'s Partners card lost the
  "Our Partners" section row and its purpose line was trimmed, plus a tag
  noting the removal and its date (no return date given, unlike Book a Tour's
  fixed 10/26 — update the tag if one is set later).
- **Facility photo gallery** shows grey PHOTO PLACEHOLDER boxes until real photos
  are added — as of 2026-08-11 that means editing the gallery array in
  `DEFAULTS` in `src/app/(site)/facility/page.tsx` (formerly a Studio field,
  Facility Page → Photo gallery). A new **"What it will look like"** band
  above it (added 2026-07-20) now carries the architect's exterior rendering,
  extracted from the Industrial Operations Program brochure to
  `public/images/facility-rendering.jpg` (2400×1350, 720 KB). It is its own
  16:9 band rather than a gallery slot — the gallery crops square and a square
  crop loses the building. The image is code-side; its heading and caption
  (`renderingTitle`, `renderingCaption`) are also plain `DEFAULTS` fields now.
  **Keep the word "rendering" in the caption** — the building is under
  construction until autumn 2026 and an uncaptioned drawing reads as a photo
  of a finished facility.
  ⚠️ The brochure's other usable image is a **lab photo with identifiable
  students' faces**. Jake declined to publish it 2026-07-20 pending confirmation
  that photo releases exist — don't add it without asking.
- **✅ "What is Industrial Operations Technology?" video is live** (Jake,
  2026-08-24). Replaced the video-placeholder box on `/iot-diploma-program`
  (`whatIsTitle` section, `src/app/(site)/iot-diploma-program/page.tsx`) with
  an embedded YouTube iframe — video id `gCkUwZqdZMc`, 2:32, unlisted, on the
  GTCIO channel, titled "What's IOT?". Embedded via
  `youtube-nocookie.com/embed/<id>` (privacy-enhanced mode, no cookies until
  playback starts) inside the same `aspect-video` box the placeholder used, so
  no surrounding layout changed. Confirmed embeddable (200 from the embed
  endpoint; unlisted videos embed fine, only "private" would block it) before
  wiring it in. No CSP change needed — `next.config.ts`'s policy has no
  `frame-src`/`default-src` restricting outbound iframes, only
  `frame-ancestors` (which governs framing *this* site, not what this site
  embeds).
- **Nav and footer link columns** are code-only (`Header.tsx`, `Footer.tsx`) —
  deliberate even before the CMS removal, since a typo'd href there breaks
  navigation site-wide; as of 2026-08-11 the rest of the site's content is
  code-only too, see §4 for the `ctaButton`/`links.ts` pattern that keeps
  in-page buttons safe. The logo is also code-only, as it always was. The
  footer's newsletter signup copy lives in `NewsletterSignup.tsx` as of
  2026-08-11 (moved off the Sanity `siteSettings` singleton — formerly moved
  off `homePage` onto `siteSettings` 2026-07-21, see §8). The Home and About
  hero videos are plain `DEFAULTS` fields on their pages now, same as
  everything else (closed as a CMS feature 2026-07-20, superseded by the
  broader CMS removal 2026-08-11).
- **Home hero headline is sized to fit one line** (Jan, 2026-07-16). The sizes in
  `(site)/page.tsx` are measured, not guessed: the headline renders ~21.7px wide
  per 1px of font-size in Trade Gothic Next Heavy Compressed, so 52px ≈ 1128px and
  56px ≈ 1215px inside a 1200–1280px container from `xl` up. It is deliberately
  **not** `whitespace-nowrap` — the hero is `overflow-hidden`, so a longer headline
  (or the wider Arial Narrow fallback if Adobe Fonts fails) would be *clipped*
  rather than wrapped. A longer headline just wraps to two lines. Re-measure if
  the headline changes materially.
  - **🔴→✅ Fixed 2026-07-30: the scrim card used to overshoot a wrapped
    headline.** Reported by Jake: on viewports too narrow for one line but
    still fairly wide, the dark card behind the Home headline extended well
    past "...industry" even though "transformation." (alone on line two) is
    much shorter than line one. Root cause, confirmed with an isolated test
    page: a shrink-to-fit box's auto width (this card was a plain
    `inline-block` div) resolves to the full *available* width the instant
    its content wraps to more than one line — not to the narrower width the
    wrapped lines actually render at. Verified this isn't an `inline-block`
    quirk specifically — a `display:table` box does the exact same thing, so
    no swap of display mode fixes it. The card and PageHero's card share this
    exact structure, so both had the bug; it stayed invisible on interior
    pages because those titles are usually short enough to hold one line.
    Fixed by extracting both into `HeroCard.tsx`, a small client component
    that measures the actual widest rendered text line via
    `Range.getClientRects()` and sets an explicit pixel width, re-measuring
    on resize and once Adobe Fonts finishes loading (fallback-vs-real-font
    metrics differ, §7). One non-obvious trap hit while building it: the
    first version cleared the card's width by mutating `card.style.width`
    directly before remeasuring, then called `setState` with the recomputed
    value — if that value happened to equal the already-committed state
    (the common case, e.g. the fonts.ready remeasure firing right after
    mount at the same viewport), React bails out of re-rendering for an
    unchanged value, silently stranding the DOM with the manually-cleared
    style and no re-render to restore it. Fixed by doing the "reset to
    natural width" step through React state (`setWidth(undefined)`) instead
    of a raw DOM mutation, so the DOM never goes out of sync with what React
    thinks it rendered. Per-line "highlighter chip" backgrounds
    (`box-decoration-break: clone`) were considered and rejected — Jake
    already disliked that look when it came up for PageHero (see its code
    comment: "per-line chips read as 'gross'/segmented").
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
npm run dev                # dev server (localhost:3000)
npm run build              # production build
npx tsc --noEmit           # typecheck
npx eslint .               # lint

# Exercise the form endpoint without a browser:
curl -s -X POST http://localhost:3000/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"formType":"contact","reason":"Media inquiry","firstName":"A","lastName":"B","email":"a@b.com","message":"hi"}'
# → {"ok":true} only if Microsoft Graph is configured and the email actually
# delivers (§5) — as of 2026-08-11 there's nowhere else the submission is
# recorded, so a 500 here with Graph unconfigured is expected, not a bug.
```

Push to `main` → Vercel deploys automatically. `npx vercel ls gtcio-site --yes`
shows deploy status.

---

## 10. Working notes

**Read this before the dates below confuse you.** Everything in this section
is a historical log — it records content decisions, sourcing, and how past
edits were made, in the state they were true at the time. Many entries below
describe patching a change into "both the code `DEFAULTS` and the published
Sanity doc" (and checking for a stale draft to reconcile) — that was how a
copy change reached the live site **before 2026-08-11**, when the CMS was
removed (see §4). **It no longer applies.** As of 2026-08-11 every fact below
is still accurate and still live on the site, but a future change to any of
it only touches the code side — there is no Sanity doc to patch anymore, and
no draft to check for. The individual bullets below are left in their
original wording as a record of what happened; don't take their "patch the
Sanity doc" phrasing as current instructions.

- **✅ Training page's "student certifications and credentials" stat — sourcing
  documented, 2026-08-18** (Jake asked for a full pass confirming every
  number on the site is current). The value **"6,226 ... since 2024"**
  (added 2026-07-30, commit `b19476a`) had no documented source anywhere in
  this file or the commit message, and doesn't appear in the training
  brochure's own AT A GLANCE page — which only ever gave a training-hours
  figure, not a credentials count, so it was never going to be there. That
  absence was wrongly read as "unverified" and the number was briefly
  replaced with a different, real-but-lower figure (Durden's 1,300+
  diploma-graduate figure, see the deck note below) before Jake caught it:
  **6,226 is per Justin Goodman, who oversees certifications for the
  program** — a direct internal source, not a published one, which is
  exactly why nothing in the repo could confirm it. Jake confirmed it's
  correct and likely an undercount now, since it hasn't been refreshed since
  2026-07-30. **Restored to 6,226**, now with that sourcing documented in the
  code comment so this doesn't happen again. `STATS` in
  `src/app/(site)/training/page.tsx`. **Ask Justin Goodman for a current
  number** before raising it further; verify any change locally via `npm run
  dev` before pushing — `preview_start` throws `EPERM` in this directory (a
  known sandboxing quirk, not a real error), so launch the dev server with a
  background Bash command instead and point `preview_start` at the resulting
  `localhost:3000` URL.
  - **Not the same figure as the deck's "1,300+."** The GTCIO history deck
    (`GTCIO_HISTORY_DOSSIER.md`) separately uses "1,300+ degrees and
    certifications earned by 774 industrial technologies graduates in 2024,"
    sourced to Durden's February 2025 report to city council — that's a
    narrower population (diploma-track graduates only) for a specific year,
    not a competing count against this page's broader "since 2024, all
    certifications" figure. The two aren't in tension and neither needed to
    change to match the other.
  - Rest of the site checked the same pass and found current, no changes
    needed: 39,700 sq ft / $27M / ~460,000 hrs (facility, about), 12
    industrial labs, four semesters / $9,000 / 53 credit hours across 15
    courses (IOT diploma program), 21 SACA credentials + 1 FANUC = 22 total
    (credentials page). No county-served figure (8/9/11) appears anywhere on
    the site, so that ambiguity — open in the deck's own question list —
    doesn't surface here. The Amazon MRA "one of five colleges nationally"
    line in `news.ts` was **not** changed — it's a dated (2021-05-24) excerpt
    of what Grice Connect reported at the time, not a live claim, matching
    this project's existing policy of leaving old news excerpts as published
    rather than correcting them against current facts (see the "Several
    headlines carry superseded specs" bullet further down this section).
- **Site nav order** (as of 2026-07-20): About (Mission / History / Advisory Board
  / Development Authority of Bulloch County / FAQ) · IOT Training Programs · IOT
  Diploma Program · **Credentials** · Facility · Partners · News · Contact.
  "Training" is labelled **IOT Training Programs** in the nav and sits *before*
  IOT Diploma Program; Credentials was added between IOT Diploma Program and
  Facility 2026-07-20. The
  home hero buttons are IOT Training Programs · IOT Diploma Program · Become a
  Partner (a red "Become a GTCIO Partner" band sits lower on the home page).
  Nav/footer link columns are code-only (`Header.tsx`, `Footer.tsx`); the
  footer's newsletter signup copy is a `DEFAULTS`-style constant in
  `NewsletterSignup.tsx` as of 2026-08-11 (was on the Sanity `siteSettings`
  singleton before that — see §4) and renders on every page, not just Home
  (moved out of Home-only 2026-07-21 — see §8).
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
  `nonTraditionalResources` are plain fields on `DEFAULTS` in
  `iot-diploma-program/page.tsx` as of 2026-08-11 (were on the `iotDiplomaProgramPage`
  Sanity doc's "What is IOT?" group before that). Mirrors OTC's own program
  page, which flags IOT as non-traditional
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
  `ctaButton`-shaped `DEFAULTS` fields (§4). Two new `DESTINATIONS` keys back them:
  `iotProgramFlipbook` (<https://online.fliphtml5.com/exygb/xhzf/#p=1>, verified
  200, same `exygb` account as the employer catalog flipbook) and
  `iotProgramPdf` (`/documents/industrial-operations-program.pdf`). This mirrors
  the Training page's existing `CATALOG_URL` / `CATALOG_PDF_URL` pairing.
  - **File destinations download rather than navigate.** `DOWNLOAD_DESTINATIONS`
    in `src/lib/links.ts` (moved from `sanity/lib/links.ts` 2026-08-11, see §4)
    lists which keys are files; `CtaButton` adds the
    `download` attribute for those. A file destination is never "external" in the
    new-tab sense, so the two branches are mutually exclusive. **Adding another
    downloadable PDF means adding its key to that set too**, or the button will
    navigate away from the site instead of saving.
- **`/iot-diploma-program/curriculum`** (added 2026-07-20, from the brochure) is
  the course table + per-course detail. **Deliberately not in the top nav**
  (Jake) — students reach it from the "Every course, in detail" band in the
  Curriculum section. It cross-links with `/credentials` by anchor in both
  directions: courses use `#isat-1102`-style ids, credentials use `#c-201`-style
  ids. In `sitemap.ts`, `SITEMAP.html`, and `src/lib/links.ts`'s `DESTINATIONS`.
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
    other change needed; its label was changed to "VIEW CREDENTIALS". Renaming
    the key would have orphaned that button. (In the old Sanity Studio, the
    dropdown for that destination showed "Credentials page" — moot now that
    there's no Studio, but explains why the destination key itself
    (`certifications`) doesn't match the page's current name.)
  - Framing copy is `DEFAULTS` in `credentials/page.tsx` as of 2026-08-11 (was
    the `credentialsPage` Sanity singleton before that); reference data is
    `src/lib/iot-curriculum.ts` + `src/lib/credentials.ts`.
  - ⚠️ **The nav is now 9 top-level items.** Verified 2026-07-20 to fit without
    overflow at the `xl` (1280px) breakpoint where the desktop nav appears —
    21px clear of the logo, 47px of the right edge. A tenth item, or materially
    longer labels, will need re-checking; the desktop nav has no wrap/overflow
    handling, it just gets tighter.
- **Affiliations now split by audience, and Amatrol was dropped as an
  accreditation** (Jake, 2026-07-27). `AFFILIATIONS` in `src/lib/credentials.ts`
  is still the one shared list feeding both `/credentials` and `/training`
  (`trainingPage.affiliations`, one field, two pages — §4), but each item now
  carries a `showOn: "both" | "employer" | "student"` tag, and each page
  filters through the new `affiliationsFor()` helper. Reason: the diploma only
  builds in FANUC and SACA credentials, so `/credentials` showing Mitsubishi
  Electric or Rockwell overstated what a student leaves with. `/credentials`
  now shows only FANUC + SACA Gold (`showOn: "both"`); `/training` shows all
  four, including the two `showOn: "employer"` cards.
  - **Amatrol removed as an affiliation card entirely** — gone from both
    pages' accreditation grids, the `/training` "What credentials can
    employees earn?" FAQ answer, and the About page FAQ line ("...and an
    Amatrol certified instructor training site"). **Deliberately NOT removed**
    from `SERVICES` on `/training` (the "Amatrol's e-learning curriculum",
    "Amatrol LMS & open lab", and "Amatrol ATTI" instructor-training entries)
    — those describe how OTC delivers *other* companies' short courses, a
    delivery-method fact rather than a credential/accreditation claim, and
    Jake's call was to leave that alone.
  - **The old "Advanced Manufacturing Academy Training Center" entry is now
    "Rockwell Automation."** The brochure's own wording doesn't match
    Rockwell's actual program name — Rockwell's is "**Academy of** Advanced
    Manufacturing" (AAM), word order reversed from the brochure's "Advanced
    Manufacturing Academy." Web research 2026-07-27 found no public
    confirmation anywhere (not Rockwell's own AAM page, its press coverage, or
    OTC's site) that GTCIO is an AAM partner site. **Jake confirmed it
    directly**, so it's published as Rockwell — but if this ever needs
    re-verifying, that's why the brochure's wording doesn't line up on its
    own. New copy: "An Academy of Advanced Manufacturing (AAM) training
    site."
  - New Sanity object type `affiliationCard` (`sanity/schemaTypes/objects/`)
    replaces `infoCard` for just the `affiliations` field — adds the "Show on"
    radio (Both pages / Training only / Credentials only) without leaking that
    concept onto Facility's focus-area cards or Training's own service cards,
    which also use `infoCard` and don't need it. `trainingPage.affiliations`
    in the dataset was patched directly (write token) to the new `_type` and
    tags; no draft existed to reconcile. `npx sanity schema validate` and
    `documents validate` both ran clean afterward.
- **SACA tier ladder on `/credentials` reordered, Professional dropped, and the
  glossary now labels its micro-credential block** (Jake, 2026-07-27).
  `SACA_TIERS` in `src/lib/credentials.ts` no longer includes the Professional
  tier (engineering-level, `inProgram: false` — the diploma never touched it,
  and it was cluttering the page). The remaining two entries were reordered —
  **Specialist displays as Tier 1, Associate as Tier 2** — which is a pure
  presentation choice, not a correction: re-verified 2026-07-27 directly
  against saca.org's Associate and Specialist Certifications pages, SACA does
  **not** rank its three categories ("Associate", "Specialist",
  "Professional") hierarchically or number them — it calls them stackable.
  The page's own `Tier {i+1}` numbering (`(site)/credentials/page.tsx`) was
  always this site's invention, driven by array order.
  - **New glossary heading**, "Micro-credentials included in Specialist
    Certification," inserted in the "Every credential in the diploma" section
    right after the four Associate credentials (C-101–C-104) and before the
    Systems & Controls family begins — i.e. it introduces every family from
    that point on (Systems & Controls, Robotics). Jake's first draft said
    "Associate," not "Specialist" — corrected before publishing: saca.org's
    Specialist Certifications page explicitly says Specialist certifications
    "consist of a series of core and elective **micro-credentials**," and the
    Associate page never mentions micro-credentials at all. This also matches
    the page's own pre-existing Specialist-tier copy ("The diploma's C-2xx and
    C-3xx credentials are these building blocks"), which the original wording
    would have contradicted a few sections up the same page. Jake confirmed
    "Specialist" after being shown the conflict.
  - ⚠️ **The Robotics family mixes a real SACA micro-credential (C-215,
    C-216) with one that isn't (FANUC-1)** — FANUC-1 is FANUC America's own
    credential, unrelated to SACA's Specialist bundling (see the existing
    `SACA_CREDENTIALS` filter comment in `iot-curriculum.ts`, which excludes
    it from SACA counts for the same reason). Rather than split the Robotics
    family or add a second heading, the new intro paragraph carries a
    one-line parenthetical calling this out ("The FANUC credential further
    down is issued directly by FANUC America, not SACA...") so the umbrella
    heading doesn't misstate that one card.
  - Every SACA-issued code (`C-` prefix) on the page now displays as
    "SACA C-201" rather than bare "C-201" — both tier boxes above and every
    card in the glossary — so it's visually unambiguous next to `FANUC-1`,
    which stays unprefixed. Both tier boxes also link out to SACA's own
    Associate/Specialist Certifications pages. **The same "SACA C-XXX"
    prefix was applied 2026-07-28 to `/iot-diploma-program/curriculum`'s**
    course table (the "Credentials" column) and its per-course "Credentials
    earned" cards — same logic (`code.startsWith("C-")`), so `FANUC-1` and
    the literal string `"OSHA 10"` in `PROGRAM_COURSES` stay unprefixed
    there too. Anchor hrefs/ids on both pages still use the raw code
    (`c-201`, lowercase, no "SACA") — only the display label changed.
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
- **Sitewide terminology: "manufacturing facility/facilities", not "factory"**
  (Jan via Jake, 2026-07-30) — "factory" reads as having a negative connotation.
  Fixed this pass in the Home hero, the Facility page's focus-area copy and
  hero alt text, the IOT Diploma Program hero/intro, and the SACA credential
  glossary in `iot-curriculum.ts`; applies to all future copy too, not just
  those instances. No proper noun or direct quote on the site currently uses
  "factory," so there's no exception to carry forward.
- **Partners page pathways restructured, and a logo collage added above the
  directory** (Jake, 2026-07-30). `DEFAULTS.pathways` in `partners/page.tsx`
  (and the published `partnersPage` doc) dropped "Sponsor a Robot," "Facility
  Tour," and "GTCIO Advisory Board" entirely; "Sponsor Equipment" was renamed
  "Sponsorship Opportunities"; two new cards were added with placeholder copy
  ("Details on this partnership pathway are coming soon."): "Training Program
  Partner" and "K-12 Partner" — four cards total, down from five. The new
  **logo collage** (a uniform grid of white tiles, one per partner logo) sits
  between the directory intro and the existing full-card directory list;
  each tile links via `#${partnerSlug(partner.name)}` down to that partner's
  full card, which now also carries a matching `id`.
  **The "Become a Partner" form's checkbox list is deliberately NOT kept in
  sync with the pathway cards** — `FORM_LABEL_OVERRIDES`/`EXTRA_FORM_OPTIONS`
  in `partners/page.tsx` mean the form still offers "Facility Tour" and
  "Become a Training Partner" (renamed from "Training Program Partner") even
  though neither matches a current pathway card verbatim. This is Jake's
  explicit instruction, not drift — don't "fix" the mismatch by reconciling
  the two lists.
- **The `apply` CTA destination changed 2026-07-20**: `DESTINATIONS.apply` in
  `src/lib/links.ts` (moved from `sanity/lib/links.ts` 2026-08-11, see §4) now points to
  `https://www.ogeecheetech.edu/admissions/next-steps` (was `/IOT`, which no
  longer resolved to an application path). The IOT Diploma Program page also
  gained two more Apply Now buttons — one in the hero, one after "More than one
  way in" — beyond the original bottom Apply band, all sharing the same
  `applyButton` `DEFAULTS` field. The footer's "Apply to the Program" link
  (code-only, `Footer.tsx`) now points straight at `DESTINATIONS.apply` instead of
  the in-page `#apply` anchor, and opens in a new tab like the site's other
  external footer links.
- **The mission statement is signed off** (Jan, 2026-07-16): **"Building a
  workforce ready for industry transformation."** It is deliberately the same
  sentence as the Home hero headline — the hero states the mission verbatim, so
  **if one changes, change both**: `DEFAULTS.missionStatement` in
  `about/page.tsx` and `DEFAULTS.heroTitle` in `(site)/page.tsx` (formerly
  `aboutPage.missionStatement` and `homePage.heroTitle` on Sanity, plus the
  code `DEFAULTS` for each — now just the two `DEFAULTS`, see §4). The old
  "(Formal mission-statement wording pending final sign-off…)" note is gone;
  don't reintroduce it.
- **Partners page is the priority page.** Jan called it out as needing to work
  "even before the website."
- **IOT Training Programs page is employer-facing.** The old "For Students" box
  was removed 2026-07-16 (students are served by the IOT Diploma Program page), and
  `trainingPage.studentsBody` was dropped from the Sanity schema and unset in
  the dataset at the time. The whole page — stats, employer copy, catalog
  band, credentials, services, course areas, FAQ — is a single `DEFAULTS`
  object in `training/page.tsx` as of 2026-08-11 (§4); there's no separate
  fallback layer anymore, `DEFAULTS` is the only copy.
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
  **Square footage superseded 2026-08-17** — the CBAER economic-impact report
  (see the dated note further down this section) gives a more precise 39,700
  gross sq ft; the site now publishes that figure. $27M and ~460,000 hrs are
  untouched by that report and still trace to this press release.
  Media contact: Sean Payne, spayne@ogeecheetech.edu. Applications:
  www.ogeecheetech.edu/admissions/next-steps (the `apply` destination in
  `src/lib/links.ts`, moved from `sanity/lib/links.ts` 2026-08-11 — changed
  2026-07-20 from the old `/IOT` URL, which no
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
  **Do not put those numbers on the site** — the current specs are
  **39,700 sq ft / $27M / ~460,000 hrs** (sq ft from the CBAER report, the
  other two still from the 2026 press release — see the dated note further
  down this section). Use these PDFs for the *why*, not the specs. (The docs also disagree with each other on
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
  Project timeline): 7/22 push for funding begins incl. a pledge from DABC to
  donate the land · 9/22 initial funding approved · 7/23 design team selected, **PRAXIS3**
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
    main campus** — the college's existing industrial operations training
    facility (16 Joe Kennedy Blvd;
    houses the robotics and industrial maintenance labs, Electrical Systems
    Technology and Logistics; built 2018) — and move into the new GTCIO building on
    AJ Riggs Road once it opens. OTC's own release notes the industrial systems
    program was projected to hit capacity in that building, which is *why* the new
    center exists. This is on the site as an About timeline milestone and an IOT
    Diploma Program FAQ ("Where will classes be held?"). Tour booking opening 10/26
    is consistent with the 10/15 ribbon cutting.
  - Jan's source note said "9/26 HOPEFULLY finished" — the site says "targeted for
    completion"/"scheduled" instead. Don't publish the hedge verbatim.
  - **Three wording corrections, Jake, 2026-08-06** (all patched in both the
    code `DEFAULTS` and the published `aboutPage` doc, no draft to reconcile):
    July 2022 (`t1`) now reads "a pledge to donate the land from the
    Development Authority of Bulloch County," not "acquiring the land" — DABC
    pledged the land at this point in the timeline, the formal deed came
    later (matches `bdaBody`'s "deeded the land ... to the Technical College
    System of Georgia"). September 2023 (`t5`) gained a second and third "to"
    for parallel structure — "meant to triple ... capacity, to anchor
    training ... and to serve as a model ..." — a pure grammar fix, no
    factual change. August 2026 (`t6b`) now calls the Industrial Technology
    Building "the college's existing industrial operations training
    facility" instead of "existing robotics facility" — the building's own
    description a few paragraphs up (16 Joe Kennedy Blvd note, this same
    bullet) was updated to match.
  - **Expanded 2026-07-23 by actually reading the linked articles behind the
    News page's `newsItem` docs** (WebFetch on all 13 URLs; an initial pass had
    only mined the excerpts already stored in Sanity, which missed everything
    below). Grice Connect (4 URLs) and WSAV both blocked/hung on every attempt,
    live browser included — same bot-protection PROJECT.md already flagged for
    Grice; Issuu's Statesboro Magazine embed returned only viewer chrome, no
    article text. Everything added is sourced from the 5 OTC press releases and
    1 Statesboro Herald piece that did return content:
    - Three new `historyTimeline` milestones, each carrying its source article
      in the new `sourceUrl` field (see below): **September 2021** "County
      commissioners approve funding" (`_key: t0`, now the timeline's earliest
      entry — the article itself calls this "the earliest public step");
      **June 2023** "State budget funds the project" (`_key: t2b`, Governor
      Kemp signing the amended FY23 budget — a distinct step from the
      September 2022 TCSG capital-outlay-list approval, confirmed by the OTC
      article rather than guessed); **November 2024** "Groundbreaking
      ceremony" (`_key: t5b`).
    - ⚠️ **The Nov 2024 groundbreaking and the existing "Construction begins —
      June 2025" milestone (Jan's figure, approved 2026-07-16) read like the
      same event ~7 months apart.** Jake was asked and chose to keep both as
      separate milestones rather than have either overwritten — don't
      "resolve" this a different way without asking again.
    - `timelineEvent` gained a `sourceUrl` field (optional `url`, alongside
      `highlight`) — renders as a small "Read more →" link under a milestone
      in `AboutTimeline.tsx`. Only set where a specific `newsItem` on the News
      page actually documents that exact milestone — 4 entries have one so far
      (t0, t2b, t5b, and Dec 2025 "Beam signing ceremony" `t6a`); don't add one
      just because a date is close, per the same reasoning as the
      groundbreaking/June-2025 tension above.
    - `aboutPage.bdaBody` (Development Authority of Bulloch County section)
      was rewritten — it previously read as filler ("helped make GTCIO's new
      facility possible... doesn't get built without local backing"). It now
      states the actual mechanism: DABC deeded the land to TCSG, and Bulloch
      County's Board of Commissioners (a separate body from DABC) funded the
      initial site design and an economic-impact study. The existing
      `bdaQuote` (Benjy Thompson) was left as-is — it's presumably from an
      internal doc Jake supplied, not something contradicted by the new
      sourcing, so it wasn't swapped for the differently-worded Thompson quote
      the groundbreaking article carries ("It was an easy yes for us...").
      **Updated again 2026-08-06 (Jake):** added a third funded item — the
      sentence now reads "initial site design, an economic-impact study, and
      an access road from Highway 301." Patched in both the code `DEFAULTS`
      and the published doc (no draft existed).
    - `aboutPage.historyBody` gained a sourced economic-impact figure: a
      Georgia Southern University Center for Business Analytics and Economic
      Research study projects **$8.98M in regional economic output in year
      one, growing to $15.68M by FY2033** — sharper than not having a number
      there at all. (The groundbreaking article's own project-cost figure,
      $23M, is an earlier estimate superseded by the confirmed $27M already on
      site — not used.)
      **⚠️ Superseded 2026-08-06 — see the dated note below.**
    - `facilityPage.overviewBody` gained a room-level detail from the same
      groundbreaking article: **12 industrial labs, plus classrooms, computer
      labs, and meeting space** — the page previously described the building
      only in aggregate (square footage, cost, hours).
    - The Dec 2025 beam-signing milestone's `detail` was expanded to name the
      design/construction partners OTC's own release listed as attending —
      **PRAXIS3, ICB, LS3P, and Buro Happold** — the first mention on the site
      of LS3P or Buro Happold; their specific roles weren't stated in the
      source, so don't infer more than "attended" from this.
    - Not added, on purpose: ACE Electric's gift and Justin Goodman's Diamond
      Award (both confirmed, on a full read, to have no GTCIO connection —
      consistent with PROJECT.md's existing note on those two items) and the
      2021 Amazon MRA / 2023 Amatrol items (OTC training capability generally,
      already the reasoning on file for excluding them from a "strictly
      GTCIO" read).
    - All changes patched to both the code `DEFAULTS` and the published
      Sanity docs (`aboutPage`, `facilityPage`); no drafts existed for either
      at patch time. `npx sanity schema validate` and `documents validate`
      both ran clean afterward.
- **✅ Economic-impact figure updated 2026-08-06** against a new, formal source:
  *Economic Impact Analysis of the Georgia Training Center for Industrial
  Operations* (CBAER — Center for Business Analytics and Economic Research,
  Georgia Southern University's Business Innovation Group — July 31, 2026,
  in the parent folder as `OTC 2026 GTCIO Report.pdf`). This supersedes the
  2026-07-23 figure above ($8.98M / $15.68M by FY2033), which came from an
  earlier/informal source this report doesn't cite or reconcile against.
  The new report frames the 10-year IMPLAN analysis (FY2026–FY2035) around
  three benchmark years — **FY2026** ($12.14M output, last year of operations
  on the OTC campus), **FY2027** ($13.21M output, first year in the new
  building), and **FY2035** ($16.64M output, "the total economic impact for
  this analysis") — plus GRP, labor income, and employment figures for each
  (Tables 1–4, p8–9). `aboutPage.historyBody`'s sentence now reads **"$13.21
  million in regional economic output in its first year in the new building,
  growing to $16.64 million by FY2035"** — output was kept as the cited metric
  (matching the old sentence's framing) rather than switching to GRP or labor
  income. Patched in both the code `DEFAULTS` and the published `aboutPage`
  doc (no draft existed to reconcile); `tsc`, `eslint`, and both `sanity`
  validation commands ran clean afterward.
  - Same pass: the About page's mission paragraph (`missionBody`) changed
    "people for jobs in industrial automation" to **"people for jobs in
    industrial operations and automation"** (Jake, 2026-08-06) — a wording
    request independent of the report, patched the same way.
  - **✅ Square footage corrected to the report's figure, 2026-08-17** (Jake
    asked directly to reconcile the site against this report). The report
    states the new GTCIO building at **39,700 gross square feet** (p1, p8 —
    6,500 office + 20,000 instructional + 13,200 common area) — supersedes
    the 40,000 sq ft figure this project had treated as current since the
    2026-07 press release. Changed in all five places it appeared:
    `facilityPage.heroDescription` and `stats` in
    `src/app/(site)/facility/page.tsx`, `aboutPage.historyBody` and the June
    2025 "Construction begins" timeline entry in `src/app/(site)/about/page.tsx`,
    and the Statesboro Magazine excerpt in `src/lib/news.ts` (the site's own
    description of the article's content, not a quoted headline — unlike the
    old news headlines discussed below, which stay untouched on purpose).
    `public/SITEMAP.html`'s Facility card and colophon date were updated to
    match. **Not changed:** the $27M cost figure — the report is silent on
    construction cost (see below), so that's still sourced only from the
    2026-07 press release, unaffected by this report. The ~460,000 hrs/yr
    instructional-capacity figure is likewise untouched — this report doesn't
    address it either.
  - The report gives a total project cost of $27M nowhere — it's silent on
    construction cost — so that figure's sourcing is still just the 2026-07
    press release, unchanged by this report.
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
  `Header.tsx` and `src/lib/links.ts`. Regenerate the tallies (pages / nav items /
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
- **🔴 Tokens live in Vercel KV as of 2026-08-11, not an env var — and this is
  required, not a preference.** Constant Contact **rotates the refresh token
  on every use**: each refresh call returns a *new* refresh token, and the old
  one stops working. A build-time env var can't be rewritten by a running
  serverless function, so it can't hold a value that changes on every use.
  Before 2026-08-11 the tokens lived on a Sanity draft document
  (`drafts.constantContactAuth`); that store is gone along with the rest of
  the CMS (§4). `src/lib/constantContactStore.ts` now wraps `@vercel/kv`'s
  `kv` client with `getConstantContactAuth()` / `setConstantContactAuth()` /
  `patchConstantContactAuth()`, storing one record under the key
  `"constantContactAuth"` — same shape as before
  (accessToken/accessTokenExpiresAt/refreshToken/listId/updatedAt).
  `src/lib/constantContact.ts` and
  `src/app/api/constant-contact/oauth/callback/route.ts` use the store instead
  of the old `writeClient`. **This requires a Vercel KV (Upstash Redis) store
  connected to the project, which does not exist yet as of 2026-08-11** — see
  §6 and §8; every `@vercel/kv` call throws until Jake provisions one (Vercel
  → gtcio-site → Storage → Create Database). This is explicitly an **interim**
  solution — when Third Wave Digital takes over, Jake will work out this
  integration's longer-term home with them directly, so don't treat Vercel KV
  as a permanent architectural decision. If you need to inspect the stored
  record (e.g. to check the connection is alive) once the store exists, use
  the Vercel CLI or dashboard (Storage → the KV store → Data Browser →
  key `constantContactAuth`) — there's no more Studio/API-token route to it.
- **The list is found-or-created lazily**, on the first real sign-up after
  setup, and its id is then cached on the same document — every later signup
  skips the lookup. The list name is the literal string `"GTCIO Website
  Sign-ups"` (the `LIST_NAME` constant in `constantContact.ts`). To route
  signups into a *different* existing list instead (an option Jake considered
  and could still choose later), either rename that constant to match the
  existing list's exact name before the first signup runs the lookup, or call
  `patchConstantContactAuth({ listId: "<target list id>" })` directly (once
  the KV store exists) to override the cached lookup.
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
- **No separate record is kept for newsletter signups** beyond Constant
  Contact's own list — always true, and more so now that §5's forms have no
  record-keeping of their own left either (see §5's 🔴 note). A newsletter
  signup isn't a lead needing staff follow-up the way a Partner/Contact
  inquiry is, so Constant Contact's list has always been the sole record of
  truth here; that was true even back when the other three forms had a Sanity
  inbox behind them, and it's still true today.
- **Spam protection is a honeypot field only** (`botcheck`, same pattern as
  `InquiryForm.tsx`) — no rate limiting, matching the accepted risk already
  documented for `/api/inquiry` in §8. If this becomes a problem, add real
  rate limiting to both routes together.

### One-time setup — needs re-running once Vercel KV exists

The Constant Contact "Custom App" itself (steps 1–4 below) was set up once,
2026-07-21, and doesn't need repeating — that's account-level config on
Constant Contact's side, unrelated to where the tokens are stored. But the
**tokens themselves** lived in the now-deleted Sanity draft document, and
Vercel KV — their new home as of 2026-08-11 (see "How it works" above) — does
not exist yet (§8). A runtime store's contents can't be carried over by a code
change, so **once Jake provisions the KV store, step 6 below (visiting the
OAuth start URL and approving the consent screen) needs to be run again** to
populate it — until then, `/api/newsletter` and the Contact form's newsletter
checkbox will fail with "Constant Contact is not connected yet." The `.env`
values from the original 2026-07-21 setup (Client ID/Secret,
`CONSTANT_CONTACT_SETUP_SECRET`) are unaffected by the KV migration and don't
need reissuing — only the callback needs to fire once more to write into the
new store. The steps below are also kept as reference for **reconnecting** if
the app is ever disconnected from Constant Contact's side (see
Troubleshooting).

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

Everything below was true 2026-07-23 except where a later date is noted.
**The GitHub repo moved to an OTC-owned org 2026-07-22**
(`Ogeechee-Tech-PR-and-Marketing`, Jake has admin rights there). That transfer
briefly broke Vercel's push-to-deploy and silently dropped a deploy hook —
both fixed the same day; see §8 for the details and the re-check to do if Git
is ever reconnected again. **Vercel hosting itself is still Jake Hallman's
personal account**, pending the self-hosting migration to an on-campus server
— scaffolding and runbook live in [`deploy/`](./deploy/README.md), status in
§8. That's one piece of this handoff to close.

**The site is being prepared for handoff to a new agency, Third Wave
Digital**, as of 2026-08-11 — they'll connect their own CMS once that handoff
happens (§1, §4). Nothing beyond that is settled in this repo; don't assume
more about the handoff than what's stated here.

### Who owns what

| Service | Identifier | Owner / login | Used for |
| --- | --- | --- | --- |
| GitHub | `Ogeechee-Tech-PR-and-Marketing/gtcio-site` (private) | OTC PR & Marketing org (Jake: admin) | Source of truth; push to `main` deploys |
| Vercel | `jake-hallmans-projects/gtcio-site` | Jake Hallman — **not yet migrated off**; self-hosting planned, see §8 + `deploy/README.md` | Hosting, env vars, deploy hooks, function logs |
| Vercel KV | not yet provisioned | Jake — **not yet provisioned as of 2026-08-11**, see §6, §8, §11 | Constant Contact OAuth token store |
| Adobe Fonts | web project kit `jok5hww` | OTC's Creative Cloud licence (moved from Jake's personal Adobe account 2026-08-12 — see §7) | Trade Gothic Next (see §7 — settings live in Adobe's dashboard) |
| Microsoft Graph | Azure AD app registration | the OTC Microsoft 365 tenant (§5; tenant admin required) | Form notification email (§5; not yet set up) |
| Constant Contact | "Custom App" at developer.constantcontact.com | the OTC/GTCIO Constant Contact account (§11) | Newsletter list (§11; app connected since 2026-07-21, but its token store needs Vercel KV provisioned before it works again — §11) |

*(The Sanity project (`kjz4q8d4`/`production`) is no longer used by this repo
as of 2026-08-11 — see §4 and §8. It was deliberately left intact, not
deleted, as a dormant historical record/rollback option; that's Jake's
account-level call. Nobody needs Sanity access for day-to-day site operation
anymore.)*

### Getting set up as a new developer

1. Get invited to the GitHub repo and the Vercel project (someone in the
   table above sends each invite).
2. `git clone`, `npm install`, then copy `.env.example` → `.env.local` and
   fill it in. There are no CMS tokens to mint anymore (§4) — the secrets you
   need (Microsoft Graph app credentials, Constant Contact app credentials,
   the Vercel KV vars once that store exists) are in Vercel → Settings →
   Environment Variables once configured.
3. `npm run dev` — the site renders with no env vars set at all (every page's
   content is code, §4); env vars only gate the forms (§5) and the newsletter
   integration (§11).
4. Read §4 before touching content, and §3 before moving files.

### Adding a page — the full checklist

A new page touches more files than you'd guess; missing one is silent. As of
2026-08-11 (no CMS — §4) this is shorter than it used to be: there's no schema
to register, no Studio nav, no "Edit on page" wiring. In order:

1. **Route:** create `src/app/(site)/<slug>/page.tsx` — inside `(site)` or it
   won't get the Header/Footer. Follow the existing pattern: a `DEFAULTS`
   object (in page order) rendered directly — no fetch, no `async`, `DEFAULTS`
   *is* the content (§4).
2. **Navigation:** add it to `NAV_ITEMS` in `src/components/Header.tsx`
   (⚠️ re-measure — 9 items barely fit at `xl`) and the Explore column in
   `src/components/Footer.tsx`.
3. **Links plumbing:** if any `ctaButton`-shaped button elsewhere should be
   able to point at it, add a destination key to `DESTINATIONS` in
   `src/lib/links.ts`.
4. **Sitemaps, both of them:** `src/app/sitemap.ts` (search engines) and
   `public/SITEMAP.html` (the stakeholder deliverable — update its tallies and
   the colophon date).
5. **Write the content** directly into `DEFAULTS` — there's no separate
   seeding step anymore, the code you write is what ships.
