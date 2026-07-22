#!/usr/bin/env bash
# Invoked by .github/workflows/deploy.yml, on the self-hosted runner, after a
# successful `npm run build`. Syncs the freshly-built workspace into the live
# app directory and restarts the service. No SSH — the runner already runs on
# the same host that serves the site.
#
# Requires (see the migration runbook for full setup):
#   - a "gtcio" system user owning /opt/gtcio-site
#   - /opt/gtcio-site/shared/.env.production (persistent secrets, NOT synced)
#   - a sudoers rule letting the runner's service account run exactly the
#     rsync/chown/systemctl lines below without a password
set -euo pipefail

APP_DIR=/opt/gtcio-site/app
WORKSPACE="${GITHUB_WORKSPACE:?GITHUB_WORKSPACE not set — run this from the Actions job, not by hand}"

sudo mkdir -p "$APP_DIR"

# --delete keeps the live directory from accumulating stale files across
# deploys; the excludes protect the one thing that must survive every sync.
sudo rsync -a --delete \
  --exclude='.git' \
  --exclude='.env*' \
  --exclude='*.log' \
  "$WORKSPACE"/ "$APP_DIR"/

sudo chown -R gtcio:gtcio "$APP_DIR"
sudo systemctl restart gtcio-site.service
