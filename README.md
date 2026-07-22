# GTCIO website

The website for the **Georgia Training Center for Industrial Operations**, a
division of Ogeechee Technical College.

- **Live:** https://gtcio-site.vercel.app
- **Content editing:** https://gtcio-site.vercel.app/studio

Next.js 16 (App Router) · React 19 · Tailwind v4 · Sanity CMS · Adobe Fonts
(Trade Gothic Next) · deployed on Vercel.

## Documentation

| File | Who it's for |
| --- | --- |
| **[PROJECT.md](./PROJECT.md)** | **Developers and AI agents. Start here.** Architecture, the CMS content model, how the forms work, environment variables, the confirmed facts behind the copy, and the non-obvious traps that will bite you. |
| [EDITING.md](./EDITING.md) | Marketing staff. Plain-English guide to changing anything on the site — copy, photos, buttons, partners, news, the timeline — no code. |
| [AGENTS.md](./AGENTS.md) | Warning that this is Next.js 16, not the version in your training data. |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000  ·  /studio for the CMS
```

Copy [`.env.example`](./.env.example) to `.env.local` and fill it in — it lists
every variable, where to get each value, and what breaks without it. Details in
[PROJECT.md §6](./PROJECT.md#6-environment--config).

**Access a new developer needs** (who to ask: PROJECT.md §12): the GitHub repo
(`Ogeechee-Tech-PR-and-Marketing/gtcio-site`), the Vercel project
(`jake-hallmans-projects/gtcio-site`), and an invite to the Sanity project
(`kjz4q8d4`) to mint API tokens.

## Checks

```bash
npm run build              # production build
npx tsc --noEmit           # typecheck
npx eslint .               # lint
npx sanity schema validate                                 # CMS schema
npx sanity documents validate --dataset production --yes   # CMS content
```

Note that CMS changes **cannot** be verified by looking at the rendered site — a
page can render perfectly while the editing UI is broken. Use the two `sanity`
commands above. [PROJECT.md §4](./PROJECT.md#4-the-cms--read-this-before-touching-content)
explains why.

## Deploying

Push to `main`. Vercel deploys automatically.

Publishing in the Studio also redeploys the site on its own (a Sanity webhook →
Vercel deploy hook chain, set up 2026-07-20 — see
[PROJECT.md §8](./PROJECT.md#8-open-work)), so marketing edits go live without a
developer.

⚠️ **One integration still awaits one-time setup** (details in PROJECT.md §5):
Microsoft Graph credentials aren't configured yet, so form submissions are
saved to the Studio inbox but **email nobody**. Constant Contact (the
newsletter sign-up, including the Contact form's opt-in checkbox — PROJECT.md
§11) is fully connected and verified working.
