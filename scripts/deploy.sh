#!/usr/bin/env bash
# Humanade — deploy/update script for a Hostinger VPS (or any Linux server).
#
# First time:
#   1. Install Node.js 20+ (e.g. via https://github.com/nvm-sh/nvm) and pm2:
#        npm install -g pm2
#   2. Clone the repo and enter it:
#        git clone https://github.com/spreadenergy/humanade.git && cd humanade
#   3. Create the environment file:
#        cp .env.example .env && nano .env   # set ADMIN_KEY etc.
#   4. Run this script:
#        bash scripts/deploy.sh
#
# Updates: just run `bash scripts/deploy.sh` again — it pulls the latest
# main, rebuilds, and restarts the app without losing the database.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Pulling latest main…"
git pull origin main

echo "==> Installing dependencies…"
npm install

echo "==> Syncing database schema (data is preserved)…"
npx prisma db push

if [ "${SEED:-}" = "1" ]; then
  echo "==> Seeding sample data (only if the database is empty)…"
  npm run db:seed
fi

echo "==> Building…"
npm run build

echo "==> (Re)starting with pm2…"
if pm2 describe humanade >/dev/null 2>&1; then
  pm2 restart humanade --update-env
else
  PORT="${PORT:-3000}" pm2 start npm --name humanade -- start
  pm2 save
fi

echo "==> Done. App is running on port ${PORT:-3000}."
echo "    Point your reverse proxy / hPanel domain config at this port."
