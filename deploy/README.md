# Self-hosting migration runbook

The plan for moving hosting off Jake Hallman's personal Vercel account onto an
OTC on-campus server. **Status (2026-07-23): nothing here is live.** The site
still runs on Vercel; these files are scaffolding, committed 2026-07-22 so the
pieces exist and are reviewed before a server does. See PROJECT.md §8 for
status and §12 for the account-ownership picture this closes out.

Steps below marked **⚠️ untested** have never been run — verify as you go
rather than trusting this file.

## What's in this directory

| File | What it is |
| --- | --- |
| `gtcio-site.service` | systemd unit — runs `npm start` as the `gtcio` user, loopback-only on port 3000 |
| `nginx.conf.example` | reverse proxy + TLS termination — the only thing exposed to the internet |
| `deploy.sh` | rsync build → `/opt/gtcio-site/app` + service restart, run by the Actions workflow |
| `../.github/workflows/deploy.yml` | builds on a **self-hosted runner** on the same box, then runs `deploy.sh` — **parked**: its `push`/`repository_dispatch` triggers are commented out until the runner exists (step 3 below) |

The deploy model: the GitHub Actions runner lives **on the serving host**, so a
deploy is a local rsync + `systemctl restart` — no SSH, no artifacts shipped
over the network.

## Prerequisites (get these before starting)

- A Linux server from OTC IT (Ubuntu assumed by the paths below), reachable on
  ports 80/443, with outbound internet (GitHub, npm, api.github.com).
- A hostname assigned by OTC IT (the nginx template guesses
  `gtcio.ogeecheetech.edu` — **placeholder, not decided**) and a DNS record
  pointing it at the server.
- Node.js 22 (the workflow builds with 22 — keep the server on the same major),
  nginx, certbot, rsync.
- Admin on the `Ogeechee-Tech-PR-and-Marketing` GitHub org (to register the
  runner) — Jake has this.
- The production secret values currently in Vercel → gtcio-site → Settings →
  Environment Variables (the variable list is `.env.example` in the repo root).

## Server setup — ⚠️ untested

1. **App user and directories:**

   ```bash
   sudo useradd --system --create-home --shell /usr/sbin/nologin gtcio
   sudo mkdir -p /opt/gtcio-site/app /opt/gtcio-site/shared
   sudo chown -R gtcio:gtcio /opt/gtcio-site
   ```

2. **Secrets:** create `/opt/gtcio-site/shared/.env.production` with every
   variable from `.env.example`, values copied out of Vercel. `chmod 600`,
   owned by `gtcio`. `deploy.sh` never touches `shared/`, so this survives
   every deploy.

3. **Self-hosted runner:** GitHub → repo (or org) → Settings → Actions →
   Runners → New self-hosted runner; follow GitHub's install steps, run it as
   a service under its own account (not `gtcio`, not root). Then **re-enable
   the workflow's automatic triggers**: uncomment the `push` and
   `repository_dispatch` blocks in `.github/workflows/deploy.yml` (commented
   out 2026-07-23 because runnerless pushes left runs stuck "queued"). Do
   steps 1–2 and 4–5 before the first run executes.

4. **Sudoers for the runner's account** — exactly the commands `deploy.sh`
   runs, no blanket sudo (`sudo visudo -f /etc/sudoers.d/gtcio-deploy`):

   ```
   runner-user ALL=(root) NOPASSWD: /usr/bin/mkdir -p /opt/gtcio-site/app, /usr/bin/rsync *, /usr/bin/chown -R gtcio\:gtcio /opt/gtcio-site/app, /usr/bin/systemctl restart gtcio-site.service
   ```

   (Tighten the rsync pattern if OTC IT wants; the workflow is the only thing
   invoking it.)

5. **systemd unit:** copy `gtcio-site.service` to `/etc/systemd/system/`,
   `sudo systemctl daemon-reload && sudo systemctl enable gtcio-site`. It
   won't start cleanly until the first deploy has populated `app/`.

6. **nginx + TLS:** copy `nginx.conf.example` to
   `/etc/nginx/sites-available/gtcio-site`, set the real hostname (both
   `server_name` lines and the two certificate paths), symlink into
   `sites-enabled`, then run certbot for the cert. The app sets all security
   headers itself (including HSTS, added 2026-07-22 for exactly this setup) —
   don't duplicate them in nginx.

7. **First deploy:** push to `main` (or run the workflow via
   `workflow_dispatch`) and watch the Actions run. Then hit the hostname over
   HTTPS and check `/` and a form submission.

## Cutover checklist — the part that breaks things if skipped

This is the **domain move** PROJECT.md warns about in §6/§7. (There used to be
a CMS-publish rebuild path to re-point here too — moot since Sanity was
removed 2026-08-11; deploys are now purely push-to-`main` triggered, which the
workflow's own `push` trigger already covers once the runner is registered.)

1. `SITE_URL` in `src/lib/site.ts` → the new origin (feeds metadata, robots,
   sitemap.xml).
2. Adobe Fonts: add the new domain to web project `jok5hww` (OTC's work Adobe
   account as of 2026-08-12 — see PROJECT.md §7) in Adobe's dashboard, or
   Trade Gothic stops loading.
3. Constant Contact: the OAuth redirect URI on the Custom App points at
   `gtcio-site.vercel.app` (PROJECT.md §11). It only matters when re-running
   the one-time connect flow, but update it to the new origin anyway so a
   future reconnect doesn't fail mysteriously.
4. DNS flip / announce the new URL. The old `gtcio-site.vercel.app` URL is
   printed on shared material (SITEMAP.html links) — update README.md and
   PROJECT.md's URLs in the same change.

## After cutover

- Keep the Vercel project up until the new host has survived a real code
  deploy, then remove the Vercel deploy hook and archive the Vercel project.
- Update PROJECT.md §8 (close this item) and §12 (ownership table). Flip the
  relevant SITEMAP.html status if routes change.
- Rollback while Vercel still exists: point DNS back / share the vercel.app
  URL — the Vercel deployment keeps working untouched until it's deleted.
