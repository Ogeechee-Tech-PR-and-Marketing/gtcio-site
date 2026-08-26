# GTCIO website

The website for the **Georgia Training Center for Industrial Operations**, a
division of Ogeechee Technical College.

- **Live:** https://gtcio-site.vercel.app
- **Content editing:** none — content lives in code, see
  [EDITING.md](./EDITING.md). The site is being handed off to Third Wave
  Digital, who will connect their own CMS.

Next.js 16 (App Router) · React 19 · Tailwind v4 · Adobe Fonts (Trade Gothic
Next) · deployed on Vercel.

## Documentation

| File | Who it's for |
| --- | --- |
| **[PROJECT.md](./PROJECT.md)** | **Developers and AI agents. Start here.** Architecture, where content lives now that it's code-only, how the forms work, environment variables, the confirmed facts behind the copy, and the non-obvious traps that will bite you. |
| [EDITING.md](./EDITING.md) | Where a copy change (text, photos, partners, news) lives in the code now that there's no CMS. |
| [AGENTS.md](./AGENTS.md) | Warning that this is Next.js 16, not the version in your training data. |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

Copy [`.env.example`](./.env.example) to `.env.local` and fill it in — it lists
every variable, where to get each value, and what breaks without it. Details in
[PROJECT.md §6](./PROJECT.md#6-environment--config).

**Access a new developer needs** (who to ask: PROJECT.md §13): the GitHub repo
(`Ogeechee-Tech-PR-and-Marketing/gtcio-site`) and the Vercel project
(`jake-hallmans-projects/gtcio-site`).

## Checks

```bash
npm run build              # production build
npx tsc --noEmit           # typecheck
npx eslint .               # lint
```

## Deploying

Push to `main`. Vercel deploys automatically — this is the only trigger;
there's no CMS-publish rebuild path anymore. Hosting is expected to move as
part of the Third Wave Digital handoff (PROJECT.md §1, §13); there is no
OTC self-hosting plan.

⚠️ **Two integrations await setup** (details in PROJECT.md §5/§8/§9):
Microsoft Graph credentials aren't configured yet, so form submissions
currently fail outright (there's no CMS inbox to fall back to anymore) — this
is now urgent. And the newsletter's Constant Contact integration needs a
Vercel KV store provisioned before it will reconnect (its old token store was
the CMS, also removed).
