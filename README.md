# GTCIO website

The website for the **Georgia Training Center for Industrial Operations**, a
division of Ogeechee Technical College.

- **Live:** https://gtcio-site.vercel.app
- **Content editing:** https://gtcio-site.vercel.app/studio

Next.js 16 (App Router) · React 19 · Tailwind v4 · Sanity CMS · deployed on Vercel.

## Documentation

| File | Who it's for |
| --- | --- |
| **[PROJECT.md](./PROJECT.md)** | **Developers and AI agents. Start here.** Architecture, the CMS content model, how the forms work, environment variables, and the non-obvious traps that will bite you. |
| [EDITING.md](./EDITING.md) | Marketing staff. Plain-English guide to changing text, photos, and partner logos — no code. |
| [AGENTS.md](./AGENTS.md) | Warning that this is Next.js 16, not the version in your training data. |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000  ·  /studio for the CMS
```

You'll need `.env.local` with the Sanity project ID, dataset, and API tokens —
see [PROJECT.md §6](./PROJECT.md#6-environment--config).

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
